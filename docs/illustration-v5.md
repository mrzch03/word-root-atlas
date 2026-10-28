# Word Root Atlas · illustration set v5

Output: 42 × `<id>.webp` (900×1200, q82). Every card has a cream rgb(241,231,221) ground, and the model is ~78% of the width, centred at 56% height.
- `accents.json`: the signature hex for all 42 cards, measured from each final image (median of the most chromatic pixels in that card's signature hue band).
- `_contact-sheet.jpg`: sorted by accent hue (OKLab), as in the album. `_contact-sheet-original-order.jpg`: original order.
- Scripts and intermediates are in `_work/` (clean.py removes baked text, build.py normalises, finalize.sh does recolour and toning, accents.py measures accents and neighbour ΔE).

## Applied to every old v2 card
- **Baked title text removed.** The text area is filled with a background fitted from nearby cream plus matched grain. A 6× contrast check shows no ghosting.
- **Size and position normalised** with norm.py (v3), using the same width, centre and cream as the v4 set.

## Per card
| id | source | change |
|---|---|---|
| spir, port, struct, rupt, spect, chron, voc | v4 | unchanged |
| bio | v4 + recolour | olive grass and tree changed to fresh leaf green (target ~#4E7D35), which separates it from ped and the olive cards |
| sent | v4 + recolour | coral stola changed to soft rose pink (#D98B93), which separates it from cord and phil |
| cord | v4 + image edit | coral changed to deep heart-red crimson. Added a crimson mantle, a cushion and a crimson thread (larger area) |
| phil | v4 + image edit | coral himation changed to saffron-amber, with amber lamplight pooling on the scroll and floor. The warm shadow cast is neutralised |
| ped | v4 + image edit | olive changed to bronze-ochre. The statue's bronze feet are larger and gleaming, and the walker's tunic and the awning are bronze |
| mit | v4 + image edit | the messenger's cloak is now a large billowing magenta-crimson cloak (a raspberry slot of its own, away from the coral group). Magenta ribbon on the tablet |
| cred | v4 + image edit | larger gold area: full gold toga, gilded shrine pediment, gold Fides and spilled coins. Slightly deepened to antique gold to separate it from struct |
| meter | v4 + image edit | thick mint-jade banded rod, a mint tunic and a mint cord |
| graph | v4 + image edit (2 passes) | full-length indigo robe and mantle, and indigo cloth on the tool box. The stele stands on a stone base (pass 1 had drifted to an easel) |
| scrib | re-render | plain limestone floor (checkerboard removed), wax tablet and stylus, a stack of tablets and a scroll. Bold ultramarine tunic. Refined figurine instead of the toy figure |
| log | re-render + recolour | the modern green library is replaced by a stoa with two philosophers in dialogue and a scroll. Robe recoloured to Tyrian plum, so it no longer collides with spect's green |
| ject | re-render + edit | flat neon grass field replaced by a sand palaestra on a strata plinth. Lemon-yellow chiton, a ribbon banner and cushions, and the discus in flight |
| tract | re-render + recolour | toy figures and the cart are replaced by an ox and a worker hauling a block on log rollers with a taut rope. Turf moved to spring green, between vert and bio |
| mal | re-render | the cartoon hut is replaced by a cracked hut on a marsh pool, with grey-violet mist ("mala aria"), a rain cloud and a dead tree |
| vid | re-render (3 tries) | thin slab and painted-picture window replaced by a wall with a window. The viewer is in front and a sculpted sunflower field sits behind (large sunflower-gold area) |
| aud | v2 + recolour | wisteria and stone shifted from lavender to periwinkle blue-violet, to separate it from psych |
| hydr | v2 + recolour | pool water shifted from teal to clear aqua, to separate it from duc and pend |
| form | v2 + recolour | navy pots changed to bright faience turquoise, to separate them from graph and scrib |
| morph | v2 + recolour + tone | butterfly is a more saturated morpho blue, to separate it from flu. Grass ground toned down |
| cap | v2 + recolour + tone | apples brightened. Grass toned down |
| vert, duc, flu, geo, manu, mov, psych, bene, pend | v2 + tone | over-saturated grounds toned down (OKLab chroma ×0.78–0.9). The signature hue is protected and the background untouched |
| dict, luc, phon, phot, path, aster | v2 | text removed and normalised only |

## Hue separation (OKLab ΔE between neighbours in hue order)
Before v5 the closest pairs were (v4 set, same method): ped/bio, both olive; cord/phil/sent/mit, all coral at okh ~10–14; psych/aud 0.023; hydr/duc 0.035; manu/cap 0.039; flu/morph 0.045; cred/struct 0.046. During v5, log/spect (0.028), form/graph (0.018) and vert/tract (0.009) also came up, and each was fixed by recolouring.
In v5 every neighbouring pair is at least 0.043. The closest are tract/bio 0.043, vert/tract 0.049, duc/form 0.049, aud/mal 0.050, pend/duc 0.054, hydr/flu 0.056 and rupt/port 0.057. The whole cards still look clearly different (for example tract's ox haul vs bio's terraced garden).
