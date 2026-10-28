#!/usr/bin/env python3
"""Split each illustration into flat parallax layers.

A single depth-displaced mesh smears vertical faces. These layers are the
honest 2.5D: four flat planes (far, ground, mid, hero). Each plane behind the
front is inpainted under the cut-out in front of it, so a turn reveals colour
instead of a hole.

Reads public/illustrations/<id>.webp and public/depth/<id>.webp.
Writes public/layers/<id>/0.webp … 3.webp (0 = farthest). RGB is the defringed
straight colour; A is a 1–2px feather. The renderer premultiplies on upload.

    pip install pillow numpy opencv-python-headless
    python3 scripts/layers.py          # all roots
    python3 scripts/layers.py port     # one root
"""

from __future__ import annotations

import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "public", "illustrations")
DEPTH = os.path.join(ROOT, "public", "depth")
OUT = os.path.join(ROOT, "public", "layers")
W, H = 600, 800


def erode(mask: np.ndarray, px: int) -> np.ndarray:
    if px <= 0:
        return mask
    k = px * 2 + 1
    img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    return np.asarray(img.filter(ImageFilter.MinFilter(k))) > 127


def blur_mask(mask: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8), "L")
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), np.float32) / 255.0


def dilate(mask: np.ndarray, px: int) -> np.ndarray:
    if px <= 0 or not mask.any():
        return mask
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (px * 2 + 1, px * 2 + 1))
    return cv2.dilate(mask.astype(np.uint8), k) > 0


def fill_under(rgb: np.ndarray, hole: np.ndarray) -> np.ndarray:
    """TELEA-fill the cut-out, including a ring past its edge.

    The ring matters: the pixels touching the boat are still hull-coloured,
    and spreading those paints the boat back into the hole.
    """
    if not hole.any():
        return rgb
    mask = hole.astype(np.uint8) * 255
    canvas = rgb.copy()
    canvas[hole] = 0
    return cv2.inpaint(canvas, mask, 7, cv2.INPAINT_TELEA)


def feather_silhouette(obj: np.ndarray) -> np.ndarray:
    """Opaque inside, 1–2px falloff at the cream edge. No light fringe."""
    core = erode(obj, 1).astype(np.float32)
    soft = blur_mask(core, 1.15)
    # Keep the interior solid. The blur only owns the outer pixel or two.
    soft = np.maximum(soft, obj.astype(np.float32) * 0.0)
    inside = erode(obj, 3)
    soft[inside] = 1.0
    soft *= obj.astype(np.float32)
    return np.clip(soft, 0, 1)


def hero_mask(depth: np.ndarray, obj: np.ndarray) -> np.ndarray:
    """The nearest connected mass: the boat, the figure, the foreground prop.

    Equal-area quantiles cut that object in half, and the plane behind it
    still contained it, so a turn could not reveal the dock.
    """
    vals = depth[obj]
    if vals.size < 32:
        return obj.copy()
    near = obj & (depth >= float(np.quantile(vals, 0.72)))
    count, labels = cv2.connectedComponents(near.astype(np.uint8), connectivity=8)
    seed = obj & (depth >= float(np.quantile(vals, 0.90)))
    hero = np.zeros_like(obj)
    for i in range(1, count):
        comp = labels == i
        if (comp & seed).any():
            hero |= comp
    if int(hero.sum()) < 80:
        hero = seed
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))
    hero = cv2.morphologyEx(hero.astype(np.uint8), cv2.MORPH_CLOSE, k) > 0
    hero &= obj
    if float(hero.sum()) > float(obj.sum()) * 0.5:
        return seed
    return hero


def bands_from_depth(depth: np.ndarray, obj: np.ndarray) -> list[np.ndarray]:
    vals = depth[obj]
    if vals.size < 32:
        return [obj.copy()]
    hero = hero_mask(depth, obj)
    rest = obj & ~hero
    if int(rest.sum()) < 80:
        return [rest, hero]
    edges = [float(np.quantile(depth[rest], q)) for q in (0.0, 0.34, 0.67, 1.0)]
    for i in range(1, len(edges)):
        if edges[i] <= edges[i - 1]:
            edges[i] = min(1.0, edges[i - 1] + 1e-3)
    bands = []
    for i, (lo, hi) in enumerate(zip(edges, edges[1:])):
        if i == 2:
            bands.append(rest & (depth >= lo))
        else:
            bands.append(rest & (depth >= lo) & (depth < hi))
    bands.append(hero)
    return bands


def build_one(root_id: str) -> None:
    art_im = Image.open(os.path.join(ART, f"{root_id}.webp")).convert("RGB")
    dep_im = Image.open(os.path.join(DEPTH, f"{root_id}.webp")).convert("RGBA")
    art = np.asarray(art_im.resize((W, H), Image.Resampling.LANCZOS))
    dep = np.asarray(dep_im.resize((W, H), Image.Resampling.BILINEAR))
    depth = dep[:, :, 0].astype(np.float32) / 255.0
    obj = dep[:, :, 3] > 40
    # Title band and the cream margin are already alpha 0 in the depth map.
    parts = bands_from_depth(depth, obj)
    silhouette = feather_silhouette(obj)
    dst_dir = os.path.join(OUT, root_id)
    os.makedirs(dst_dir, exist_ok=True)

    nearer = np.zeros_like(obj)
    written = []
    # Walk near → far so each back plane can fill the hole the front will uncover.
    for index in range(len(parts) - 1, -1, -1):
        own = parts[index]
        if int(own.sum()) < 40 and index != 0:
            continue
        # Repaint a ring past the cut-out so the hull colour is not the source.
        hole = dilate(nearer, 12)
        colour = art if not hole.any() else fill_under(art, hole)
        if index == len(parts) - 1:
            alpha = blur_mask(erode(own, 1).astype(np.float32), 1.2)
            alpha *= own.astype(np.float32)
            alpha = np.clip(alpha, 0, 1) * silhouette
        else:
            cover = own | nearer
            alpha = silhouette * cover.astype(np.float32)
        # Edge pixels take their colour from the opaque interior, not the cream.
        fringe = (alpha > 0.02) & (alpha < 0.82)
        if fringe.any():
            colour = fill_under(colour, fringe)
        rgba = np.zeros((H, W, 4), np.uint8)
        rgba[:, :, :3] = colour
        rgba[:, :, 3] = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
        Image.fromarray(rgba, "RGBA").save(
            os.path.join(dst_dir, f"{index}.webp"),
            "WEBP",
            quality=82,
            method=4,
        )
        nearer = nearer | own
    print(f"{root_id:8} layers={len(parts)} px={[int(p.sum()) for p in parts]}")


def main() -> None:
    want = sys.argv[1:]
    names = want or sorted(f[:-5] for f in os.listdir(ART) if f.endswith(".webp"))
    for name in names:
        build_one(name)


if __name__ == "__main__":
    main()
