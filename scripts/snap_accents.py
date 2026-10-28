#!/usr/bin/env python3
"""Snap measured illustration accents onto the OKLCH bands used by the album.

Hue comes from accents.json. Lightness and chroma are the same twelve steps as
the previous ramps (step 3 wash, step 9 fill, step 11 text). Yellow hues
(70–115°) lift step 9 so the fill does not turn olive. Neighbours closer than
5° are eased apart, so a hue-sorted album does not place two identical swatches
side by side.
"""

from __future__ import annotations

import json
import math
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ACCENTS = json.loads((ROOT / "src/data/accents.json").read_text())
OLD_COLORS = (ROOT / "src/data/rootColors.ts").read_text()
ILLUSTRATIONS = ROOT / "public/illustrations"
THUMBS = ROOT / "public/thumbs"
SHEETS = ROOT / "docs/screens"
CARDS = Path("/tmp/v5cards")

# Measured from the previous port ramp. Step 9 is the fill; step 11 is text.
STEPS = [
    (0.986, 0.005),
    (0.971, 0.010),
    (0.954, 0.025),
    (0.939, 0.032),
    (0.916, 0.042),
    (0.889, 0.054),
    (0.825, 0.075),
    (0.754, 0.092),
    (0.699, 0.105),
    (0.621, 0.098),
    (0.451, 0.085),
    (0.341, 0.063),
]
MIN_GAP = 5.0


def lin_srgb(c: float) -> float:
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hue_of(hex_color: str) -> float:
    r, g, b = (lin_srgb(int(hex_color[i : i + 2], 16)) for i in (1, 3, 5))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = l ** (1 / 3), m ** (1 / 3), s ** (1 / 3)
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    return math.degrees(math.atan2(b, a)) % 360


def oklch_to_linear(L: float, C: float, H: float) -> tuple[float, float, float]:
    h = math.radians(H)
    a = C * math.cos(h)
    b = C * math.sin(h)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    blue = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return r, g, blue


def in_gamut(rgb: tuple[float, float, float]) -> bool:
    return all(-1e-4 <= c <= 1.0001 for c in rgb)


def to_srgb(c: float) -> int:
    c = min(1, max(0, c))
    v = 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055
    return int(round(min(1, max(0, v)) * 255))


def hex_oklch(L: float, C: float, H: float) -> str:
    chroma = C
    rgb = oklch_to_linear(L, chroma, H)
    if not in_gamut(rgb):
        lo, hi = 0.0, C
        for _ in range(18):
            mid = (lo + hi) / 2
            if in_gamut(oklch_to_linear(L, mid, H)):
                lo = mid
            else:
                hi = mid
        rgb = oklch_to_linear(L, lo, H)
    return "#" + "".join(f"{to_srgb(c):02X}" for c in rgb)


def project(xs: list[float], gap: float) -> None:
    n = len(xs)
    for _ in range(n * 3):
        changed = False
        for i in range(1, n):
            if xs[i] < xs[i - 1] + gap:
                mid = (xs[i - 1] + xs[i]) / 2
                xs[i - 1] = mid - gap / 2
                xs[i] = mid + gap / 2
                changed = True
        wrap = (xs[0] + 360) - xs[-1]
        if wrap < gap:
            extra = gap - wrap
            xs[0] += extra / 2
            xs[-1] -= extra / 2
            changed = True
        if not changed:
            return


def separate(measured: list[float], gap: float) -> list[float]:
    xs = measured[:]
    for i in range(1, len(xs)):
        if xs[i] < xs[i - 1] + gap:
            xs[i] = xs[i - 1] + gap
    for _ in range(900):
        for i, origin in enumerate(measured):
            xs[i] += 0.4 * (origin - xs[i])
        project(xs, gap)
    project(xs, gap)
    return xs


def old_hues() -> dict[str, float]:
    return {m.group(1): float(m.group(2)) for m in re.finditer(r"(\w+): \{ hue: ([0-9.]+)", OLD_COLORS)}


def key_order() -> list[str]:
    return re.findall(r"^  (\w+): \{ hue:", OLD_COLORS, re.M)


def contact(paths: list[tuple[str, Path]], dest: Path, title: str) -> None:
    cols, rows = 7, 6
    cell_w, cell_h, label_h = 150, 200, 18
    gap, pad = 10, 28
    width = pad * 2 + cols * cell_w + (cols - 1) * gap
    height = pad * 2 + 28 + rows * (cell_h + label_h) + (rows - 1) * gap
    sheet = Image.new("RGB", (width, height), (250, 248, 244))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
    draw.text((pad, 8), title, fill=(40, 36, 32), font=font)
    for i, (name, path) in enumerate(paths):
        col, row = i % cols, i // cols
        x = pad + col * (cell_w + gap)
        y = pad + 24 + row * (cell_h + label_h + gap)
        im = Image.open(path).convert("RGB").resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        sheet.paste(im, (x, y))
        draw.text((x, y + cell_h + 2), name, fill=(70, 64, 58), font=small)
    dest.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(dest, quality=88, optimize=True)


def ramp(hue: float) -> dict[str, object]:
    yellow = 70 <= hue <= 115
    steps = []
    for i, (L, C) in enumerate(STEPS):
        if i == 8 and yellow:
            L = 0.760
        if i == 10 and yellow:
            C = 0.090
        steps.append(hex_oklch(L, C, hue))
    return {
        "hue": round(hue, 1),
        "accent": steps[8],
        "deep": steps[10],
        "wash": steps[2],
        "skyTop": hex_oklch(0.930, 0.040, hue),
        "skyBottom": hex_oklch(0.975, 0.015, (hue + 30) % 360),
        "spark": hex_oklch(0.800, 0.070, (hue + 180) % 360),
        "steps": steps,
    }


def emit(order: list[str], colors: dict[str, dict[str, object]]) -> str:
    lines = [
        "/** OKLCH ramps. Hue is sampled from each illustration's vivid accent, then snapped to the brief's lightness/chroma bands. Step 9 is fill-only; step 11 is text. */",
        "export interface RootColor {",
        "  hue: number;",
        "  accent: string;",
        "  deep: string;",
        "  wash: string;",
        "  skyTop: string;",
        "  skyBottom: string;",
        "  spark: string;",
        "  steps: readonly string[];",
        "}",
        "",
        "export const rootColors: Record<string, RootColor> = {",
    ]
    for key in order:
        c = colors[key]
        steps = ", ".join(f"'{s}'" for s in c["steps"])  # type: ignore[index]
        lines.append(
            f"  {key}: {{ hue: {c['hue']}, accent: '{c['accent']}', deep: '{c['deep']}', wash: '{c['wash']}', skyTop: '{c['skyTop']}', skyBottom: '{c['skyBottom']}', spark: '{c['spark']}', steps: [{steps}] }},"
        )
    lines.append("};")
    lines.append("")
    lines.append("export function rootColor(id: string): RootColor {")
    lines.append("  return rootColors[id] ?? rootColors.port;")
    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    order = key_order()
    if not ACCENTS:
        raise SystemExit('missing accents')
    # Re-running refreshes the ramps only. Art, thumbs, and contact sheets
    # are written once, when the v5 files are still the incoming set.
    measured = sorted((hue_of(ACCENTS[key]), key) for key in order)
    origins = [h for h, _ in measured]
    names = [k for _, k in measured]
    placed = separate(origins, MIN_GAP)
    by_id = {name: hue for name, hue in zip(names, placed)}
    colors = {key: ramp(by_id[key]) for key in order}

    gaps = []
    ordered = sorted(names, key=lambda k: by_id[k])
    for i, name in enumerate(ordered):
        nxt = ordered[(i + 1) % len(ordered)]
        gaps.append(((by_id[nxt] - by_id[name]) % 360, name, nxt))
    print("min hue gap", min(g[0] for g in gaps))
    print("largest shifts")
    origin_of = dict(zip(names, origins))
    shifts = sorted(((by_id[k] - origin_of[k], k) for k in names), key=lambda t: -abs(t[0]))
    for delta, key in shifts[:8]:
        print(f"  {key} {delta:+.2f}°")

    (ROOT / "src/data/rootColors.ts").write_text(emit(order, colors))
    print("wrote", len(order), "ramps")

    if "--install" not in sys.argv:
        return
    before = sorted(old_hues().items(), key=lambda item: item[1])
    contact(
        [(key, ILLUSTRATIONS / f"{key}.webp") for key, _ in before],
        SHEETS / "v6-before.jpg",
        "Before · previous illustrations, sorted by the old accent hue",
    )
    contact(
        [(key, CARDS / f"{key}.webp") for key in ordered],
        SHEETS / "v6-after.jpg",
        "After · v5 illustrations, sorted by the snapped accent hue",
    )
    for key in order:
        shutil.copyfile(CARDS / f"{key}.webp", ILLUSTRATIONS / f"{key}.webp")
    THUMBS.mkdir(parents=True, exist_ok=True)
    for key in order:
        im = Image.open(ILLUSTRATIONS / f"{key}.webp").convert("RGB")
        im.thumbnail((480, 640), Image.Resampling.LANCZOS)
        im.save(THUMBS / f"{key}.webp", quality=80, method=6)
    print("installed illustrations and thumbs")


if __name__ == "__main__":
    main()
