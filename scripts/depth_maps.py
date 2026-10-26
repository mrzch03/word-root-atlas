#!/usr/bin/env python3
"""Depth maps for the 2.5D diorama cards.

Each illustration is a miniature on a cream ground, with the root title set in
the top-left margin. This script:

1. Estimates depth with Depth Anything V2 Small (quantized ONNX). The weights
   are downloaded into scripts/.cache and are not committed; the WebP maps are.
2. Flood-fills the cream that touches the border, and the top title band, so
   that ground is a flat far plane with alpha 0. The diorama reads as an object.
3. Remaps depth inside the object and blurs until the slope is gentle enough
   that a ±25° yaw does not tear the silhouette.

Output is an RGBA WebP at 450×600: RGB = depth (brighter = nearer), A = mask.

    pip install pillow numpy onnxruntime
    python3 scripts/depth_maps.py

If onnxruntime or the download is unavailable, the script falls back to a
smooth silhouette relief and says so. The maps in public/depth were produced
with the Depth Anything path.
"""

from __future__ import annotations

import os
import sys
import urllib.request
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "illustrations")
DST = os.path.join(ROOT, "public", "depth")
CACHE = os.path.join(ROOT, "scripts", ".cache")
MODEL = os.path.join(CACHE, "depth_anything_v2_small_q.onnx")
MODEL_URL = (
    "https://huggingface.co/onnx-community/depth-anything-v2-small/"
    "resolve/main/onnx/model_quantized.onnx"
)
W, H = 450, 600
# Per-pixel slope cap. 0.05 keeps a ±25° turn from stretching an edge by more
# than a couple of texels on the 64×86 subdivided plane.
MAX_SLOPE = 0.05


def srgb_to_lin(c: np.ndarray) -> np.ndarray:
    c = c.astype(np.float32) / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def oklab_LC(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    r, g, b = (srgb_to_lin(rgb[..., i]) for i in range(3))
    l = np.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    m = np.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    s = np.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return L, np.hypot(A, B)


def flood_background(cream: np.ndarray) -> np.ndarray:
    h, w = cream.shape
    bg = np.zeros((h, w), np.uint8)
    q: deque[tuple[int, int]] = deque()

    def push(y: int, x: int) -> None:
        if cream[y, x] and not bg[y, x]:
            bg[y, x] = 1
            q.append((y, x))

    for x in range(w):
        push(0, x)
        push(h - 1, x)
    for y in range(h):
        push(y, 0)
        push(y, w - 1)
    while q:
        y, x = q.popleft()
        if y > 0:
            push(y - 1, x)
        if y + 1 < h:
            push(y + 1, x)
        if x > 0:
            push(y, x - 1)
        if x + 1 < w:
            push(y, x + 1)
    return bg


def largest_component(obj: np.ndarray) -> np.ndarray:
    """Keep the largest foreground blob so the baked title does not survive."""
    small = np.array(
        Image.fromarray((obj.astype(np.uint8) * 255), mode="L").resize((W // 3, H // 3), Image.Resampling.BOX)
    ) > 40
    h, w = small.shape
    seen = np.zeros_like(small, np.uint8)
    best: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            if not small[y, x] or seen[y, x]:
                continue
            q = deque([(y, x)])
            seen[y, x] = 1
            cells = [(y, x)]
            while q:
                cy, cx = q.popleft()
                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < h and 0 <= nx < w and small[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = 1
                        q.append((ny, nx))
                        cells.append((ny, nx))
            if len(cells) > len(best):
                best = cells
    keep = np.zeros_like(small, np.uint8)
    for y, x in best:
        keep[y, x] = 255
    up = np.array(Image.fromarray(keep, mode="L").resize((obj.shape[1], obj.shape[0]), Image.Resampling.NEAREST)) > 0
    return obj & up


def object_mask(rgb: np.ndarray) -> np.ndarray:
    L, C = oklab_LC(rgb)
    cream = (L > 0.90) & (C < 0.045)
    cream[: int(rgb.shape[0] * 0.085), :] = True
    bg = flood_background(cream)
    return largest_component(~bg.astype(bool))


def blur_f32(values: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray(np.clip(values * 255.0, 0, 255).astype(np.uint8), mode="L")
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), np.float32) / 255.0


def erode_mask(mask: np.ndarray, px: int) -> np.ndarray:
    """Shrink the silhouette so the cream fringe is not part of the object."""
    size = max(1, px) * 2 + 1
    img = Image.fromarray((mask.astype(np.uint8) * 255), mode="L")
    return np.asarray(img.filter(ImageFilter.MinFilter(size))) > 127


def relief_fallback(mask: np.ndarray) -> np.ndarray:
    img = Image.fromarray((mask * 255).astype(np.uint8), mode="L")
    acc = np.zeros(mask.shape, np.float32)
    for radius in (2, 5, 10, 18, 28):
        acc += np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), np.float32) / 255.0
    acc /= acc.max() + 1e-6
    y = np.linspace(0.82, 1.08, mask.shape[0], dtype=np.float32)[:, None]
    return np.clip(acc * y, 0, 1) * mask


def load_session():
    try:
        import onnxruntime as ort
    except ImportError:
        print("onnxruntime is not installed; using silhouette relief", file=sys.stderr)
        return None
    os.makedirs(CACHE, exist_ok=True)
    if not os.path.exists(MODEL) or os.path.getsize(MODEL) < 1_000_000:
        print(f"downloading Depth Anything V2 Small → {MODEL}")
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    return ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])


def infer_depth(session, image: Image.Image) -> np.ndarray:
    """Aspect-preserving pad, 518² inference, crop back. Brighter = nearer."""
    w, h = image.size
    side = max(w, h)
    canvas = Image.new("RGB", (side, side), (250, 246, 238))
    canvas.paste(image, ((side - w) // 2, (side - h) // 2))
    resized = canvas.resize((518, 518), Image.Resampling.LANCZOS)
    arr = np.asarray(resized).astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], np.float32)
    std = np.array([0.229, 0.224, 0.225], np.float32)
    blob = ((arr - mean) / std).transpose(2, 0, 1)[None]
    pred = np.ascontiguousarray(session.run(None, {"pixel_values": blob})[0][0], dtype=np.float32)
    pred_img = Image.fromarray(pred, mode="F").resize((side, side), Image.Resampling.BILINEAR)
    full = np.asarray(pred_img, np.float32)
    x0 = (side - w) // 2
    y0 = (side - h) // 2
    crop = full[y0 : y0 + h, x0 : x0 + w]
    small = np.asarray(
        Image.fromarray(crop, mode="F").resize((W, H), Image.Resampling.BILINEAR),
        np.float32,
    )
    return small


def shape_depth(raw: np.ndarray, obj: np.ndarray) -> np.ndarray:
    """Keep the model's near/far contrast. A wide blur here made the card look flat."""
    vals = raw[obj]
    if vals.size < 10:
        return relief_fallback(obj)
    lo, hi = np.percentile(vals, [4, 96])
    span = float(hi - lo) if hi > lo else 1.0
    shaped = np.clip((raw - lo) / span, 0, 1)
    # Push the back wall back and leave boats / buildings forward.
    shaped = np.power(shaped, 1.45)
    # Taper only the last few pixels, so the silhouette has no cliff and the
    # interior relief survives.
    core = erode_mask(obj, 3)
    edge = blur_f32(core.astype(np.float32), 1.1)
    shaped = shaped * edge
    shaped *= obj.astype(np.float32)
    # One light pass kills single-pixel spikes without washing the relief out.
    soft = blur_f32(shaped, 0.6)
    soft *= obj.astype(np.float32)
    gy, gx = np.gradient(soft)
    steep = np.hypot(gx, gy) > MAX_SLOPE
    soft[steep] = np.minimum(soft[steep], blur_f32(soft, 1.0)[steep])
    return np.clip(fade_borders(soft), 0, 1)


def fade_borders(field: np.ndarray, px: int = 14) -> np.ndarray:
    """Scenes that touch the frame would otherwise turn as a hard rectangle."""
    h, w = field.shape
    y = np.minimum(np.arange(h), np.arange(h)[::-1]).astype(np.float32)
    x = np.minimum(np.arange(w), np.arange(w)[::-1]).astype(np.float32)
    return field * np.clip(y / px, 0, 1)[:, None] * np.clip(x / px, 0, 1)[None, :]


def make_alpha(obj: np.ndarray) -> np.ndarray:
    """Erode 2px to drop the light rim, then feather 2–4px. No cream halo."""
    core = erode_mask(obj, 2)
    soft = blur_f32(core.astype(np.float32), 1.35)
    soft *= obj.astype(np.float32)
    soft[: int(obj.shape[0] * 0.085), :] = 0
    return np.clip(fade_borders(soft), 0, 1)


def build(src: str, dst: str, session) -> str:
    full = Image.open(src).convert("RGB")
    rgb = np.asarray(full.resize((W, H), Image.Resampling.LANCZOS))
    obj = object_mask(rgb)
    if session is None:
        depth = relief_fallback(obj)
        how = "relief"
    else:
        depth = shape_depth(infer_depth(session, full), obj)
        how = "depth-anything-v2"
    alpha = make_alpha(obj)
    rgba = np.zeros((H, W, 4), np.uint8)
    d = (np.clip(depth, 0, 1) * 255).astype(np.uint8)
    rgba[..., 0] = d
    rgba[..., 1] = d
    rgba[..., 2] = d
    rgba[..., 3] = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(dst, "WEBP", quality=90, method=4)
    return how


def main() -> None:
    os.makedirs(DST, exist_ok=True)
    session = load_session()
    names = sorted(f for f in os.listdir(SRC) if f.endswith(".webp"))
    for name in names:
        how = build(os.path.join(SRC, name), os.path.join(DST, name), session)
        print(f"{name[:-5]:8} {how}")


if __name__ == "__main__":
    main()
