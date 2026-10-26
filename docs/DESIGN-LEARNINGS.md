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

## v3 — a tilted picture is not a diorama

The first turning card still read as a photograph leaned back. Depth Anything's relief had been blurred until the boats and the back wall sat on one plane, so a drag only skewed a flat cut-out. A CSS drop-shadow drew a square around the canvas, and the matte kept a light rim. The new-word tag popped to full size in about a frame and landed on a chip that was already filled. On a wide screen the miniature was about a third of the ring, and `port · to carry` sat up against a tag. On a phone the words stacked in a column. Locked album cards were solid grey slabs.

What this pass changed:

- The depth map keeps the model's near/far contrast. A power curve pushes the back wall back; only the last few pixels of the silhouette are tapered. Blurring the whole relief is what made the turn look flat.
- The opened card is a displaced mesh in a 35° camera. Dragging rotates that mesh, about ±25° yaw and ±10° pitch, and a small parallax shift slides nearer texels farther than the wall. `?debug=depth` draws the relief itself, so a turn can be checked as geometry rather than as a hunch.
- The contact shadow is a soft ellipse on the page, under the miniature, and it slides with the yaw. The canvas has no box-shadow and no drop-shadow. The mask is eroded a couple of pixels, feathered, and faded at the frame so the cream ground is not a hard rectangle.
- A new word's slot stays an outline until the tag lands. The flying word is the input's own glyphs, at the input's size. It arcs for 650ms and settles within a few percent. The slot then fills, a small ripple plays, and the count ticks. The collected style is not painted on the first frame.
- The miniature is 48% of the ring, and the words sit in closer. `port · to carry` is the eyebrow above the root title, in the reading column.
- On a narrow screen the words wrap as chips under the card, in a few rows, not a vertical list.
- A locked album cell is blank cream, a dashed hairline, and the root in faint serif. A collected cell shows the picture.

The develop from grey to colour belongs to the mesh. Showing the rectangular photograph first, then swapping in a grey model, read as a glitch. The still stays hidden until the mesh is up, and the rise, the sway, and the develop start together.

## v4 — depth displacement from one image smears

A single displaced plane is a rubber sheet. Where the boat meets the back wall the depth jumps, and those texels stretch into a vertical smear. There is no real parallax: the boat and the wall are the same surface, so they cannot slide past each other, and the silhouette picks up a sawtooth from the grid. The honest 2.5D is layered parallax with inpainted layers, which is what a turnable card actually is.

[`scripts/layers.py`](../scripts/layers.py) cuts each illustration into four flat planes with the depth map: far, ground, mid, hero. Each plane behind the front is extended under the cut-out in front of it, by dilating that plane's own colours (a TELEA fill kept painting the boat back into the hole). The alpha is eroded a pixel and feathered one or two pixels, so the cream does not fringe. The files are `public/layers/<id>/0.webp` … `3.webp`.

The opened card draws those as flat planes at different z. Nothing is displaced per pixel, so a face cannot smear. Dragging yaws ±18° and pitches ±8°, with the same inertia and spring, and a phone can steer it from the device orientation. A sheen sits on the front plane only. The renderer is antialiased, premultiplied, mipmapped, and capped at a device pixel ratio of 2. The contact shadow is a light ellipse (opacity about 0.18) on the page, directly under the base, and it shifts a little against the tilt.

On a new root the planes rise staggered, the base first and the hero last, 60ms apart, while each one develops from grey to colour. The canvas starts clear and the whole canvas fades in. There is no frame.

A new word's chip stays an empty outline until the flying tag arrives, including the first paint. The count `n/10` sits on the ring, under the card, and ticks when the word lands. On a phone the header is fixed to the top of the viewport, and the diorama is about 85% of the width.

## v5 — a single image cannot be honestly turned

Real geometry beats faking it. Depth displacement smears. Layered parallax still left a boat-shaped ghost in the hole, cardboard edges, and a fringe, because every plane was a slice of the same photograph. A turnable card has to be built.

`port` is a miniature in three.js: a beveled plinth with soil strata on the cut, a volume of water with a deep side and a rippled surface, whitewashed blocks, a dock, a palm, amphorae, a tiny figure, and a boat with an orange lateen sail. The pieces are a kit in `src/three/kit/`. The arrangement is data, `src/three/scenes/port.ts`, so the other forty-one can be authored the same way. They still show the illustration until they have a scene.

The camera orbits a full turn. Pitch stays between 15° and 55°. It damps, zooms within a clamp, and idles in a slow spin that stops while you drag. A phone can nudge it from the gyroscope. Light is a soft key plus a hemisphere, with PCF soft shadows and a contact blob under the plinth. Tone mapping is ACES. Colours are the port teal and the sail orange, pushed so they stay vivid. On a new root the plinth rises, then the water, the buildings, and the boat last, each springing in and developing from grey. The illustration remains the album thumbnail, and the fallback when motion is reduced or WebGL fails. three.js stays out of the first bundle.

## v6 — the illustration is the card

The product is the illustration. Procedural three.js stays in the repo behind `PROCEDURAL_SCENES` and is off. Image-based 3D, when it comes back, will be a baked GLB, not another displacement of a photograph.

A scene must tell the root's origin story. The audit found `port` drawn as a harbour, which is the portus confusion: the ship was the hero, and the carrying disappeared. The new card is porters and amphorae. The dock is only the stage.

One signature colour in a clear area per card. `accents.json` is measured from that area. Each hue is snapped onto the same OKLCH bands as before: wash at step 3, the fill at step 9, text at step 11. Yellow hues (70–115°) use a lighter fill so they do not turn olive. The title is no longer baked into the picture. It is Newsreader, top-left in the cream margin: the root large, the meaning in small caps under it, in the step-11 text colour. The same overlay sits on the album thumbnail.

Avoid hue collisions in a hue-sorted album. Neighbours are eased apart until the hue gap is at least 5°, which is a minimum OKLab distance of about 0.009 between the snapped fills. The pictures themselves were separated further (neighbour ΔE at least 0.043). The album sort follows these hues.

Fake 3D from one image failed. Real 3D needs real geometry. Depth displacement smeared. Layered parallax left a ghost in the hole. A hand-built miniature still did not match the illustration, so it is parked.

Before and after, in hue order: [v6-before.jpg](screens/v6-before.jpg), [v6-after.jpg](screens/v6-after.jpg).
