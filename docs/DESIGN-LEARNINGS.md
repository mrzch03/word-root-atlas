# Design learnings

The brief is in [`design-brief.md`](design-brief.md). Later passes overrode it where the two disagree: the hue is taken from the picture, not spaced evenly, and there is no root tree. three.js stays only for the opened card.

Screenshots of each pass live in [`screens/`](screens/).

## v1 — a brown tree

The first build could search a word, keep it in `localStorage`, show a specimen card, grow a 3D tree, and list a collection wall. One clay palette did every job. The trunk was dark, the leaves were discs, and the camera sat too close.

After looking at it, the owner said 「太丑了」 and 「为啥都是棕色」. The tree was the part that failed.

What that pass was reaching for:

- Josef Albers, *Interaction of Color*, and Johannes Itten: a hue only means something next to its neighbors. An even 8.57° wheel (the brief's first table) ignores what is actually in the picture.
- OKLCH, so forty-two accents can share one wall. Lightness and chroma stay in a band; hue is the only thing that changes.
- Monument Valley and Gris: a small world, a lot of air, color as the event.
- A museum specimen card (the CapWords kind of object): the picture is the thing, the type stays quiet.
- Radix's 12-step scales: a neutral has a job — page, fill, hairline, solid, quiet text, text — instead of a new gray on every screen.
- The floating glass-tank frames: a miniature is an object in a tinted void, not a diagram that fills the viewport.

## v2 — the metaphor should serve the moment

Don't force a tree. A tree is a map of everything at once. This product has two moments, and both are smaller than that.

**A. A new root.** The miniature rises out of the cream page, develops from grey to color the way a print comes up in the tray, the page washes to that root's sky, then the title and the meaning settle.

**B. A new word on a root already found.** A small serif tag leaves the search field and lands in that family. One faint slot fills, the count ticks, and the line says which root the word belongs to.

The family is a constellation around the card: collected words in color, the rest an outline. The collection is a gallery wall sorted by hue, so the album walks red to gold to green to blue to violet. An empty slot stays blank. The picture is the reward for finding the root.

Color follows the art. Each root's hue is sampled from the vivid accent in `accents.json`, then snapped onto the same OKLCH steps: wash at step 3, accent at step 9, text at step 11. The accent is a fill (a pip, a line, a chip's ground). It is never the type color. Hues around 70–115° use a lighter accent so yellow does not turn olive. Chrome is Radix sand — warm paper and near-black — and nothing else. The soil palette is gone.

Newsreader and Inter are self-hosted variable fonts. No Google Fonts, no Rough.js, no shadcn.

## The card is the diorama

Taking three.js off the tree was right. Taking it off the card was not. A thumbnail only needs a CSS tilt, about six degrees, with a spring back and a soft sheen. The opened card has to turn.

Depth is made offline by [`scripts/depth_maps.py`](../scripts/depth_maps.py). Depth Anything V2 Small (quantized ONNX) reads each of the 42 illustrations. The cream that touches the border, and the baked title in the top margin, become a flat far plane with alpha 0, so the miniature reads as an object rather than a rectangle. Slopes are clamped before the map is written, so a turn does not tear the silhouette. The maps are the committed files in `public/depth/`; the weights stay in a local cache.

The opened card is a subdivided plane displaced by that map. It is lazy-loaded, and three.js is not in the first bundle. Dragging rotates the scene about ±25° in yaw and ±10° in pitch. It keeps a little inertia, then springs back to rest. A phone can steer the same rotation with the device orientation. A soft sheen drifts across the surface. On the first discovery the object rises and makes one slow sway of about 20° while the grey develops into color.

The album never starts WebGL. `prefers-reduced-motion` keeps the still photograph and a fade. If the context fails, the same still is the fallback.
