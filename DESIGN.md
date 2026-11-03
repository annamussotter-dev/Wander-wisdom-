# Design System: Wander Wisdom

Reference: brandonstanton.com (Squarespace 7.1, Fluid Engine), measured on 3 Nov 2026.
Values marked **measured** come from the reference's HTML and inline styles. Its theme
stylesheet (static1.squarespace.com) was blocked by the network, so the reference's exact
colour hex values and font sizes could not be read. Those are marked **not measured**.
Wander Wisdom's own tokens follow the reference's principles and are marked **applied**.

---

## 1. Visual theme and atmosphere

- Photography-first, editorial and quiet. Images carry the emotion and the colour; the
  interface stays neutral and steps back.
- No ornament: square corners, no strokes, no gradients, no decorative icons.
- One type family in the reference; hierarchy comes from weight and size, not from mixing
  families.
- Calm pacing: full-bleed sections with generous height, one idea per section.
- Bookended by a black footer.

What makes it feel expensive:
1. Large, high-resolution photography at native ratios, edge to edge.
2. Restraint in motion: section animations are switched off everywhere.
3. A single, condensed type family used with discipline.
4. A strict grid with one small gutter (11px) repeated everywhere.
5. Square corners and no shadows on interface elements.
6. Neutral section themes, so colour only comes from images.

## 2. Colour palette and roles

Reference (**measured** theme names, **not measured** hex values): sections use the
Squarespace themes `white-bold`, `light`, `white` and `black`. These are neutral
greyscale themes; colour comes from the photographs.

Wander Wisdom (**applied**):

| Token | Hex | Role |
|---|---|---|
| Paper | `#FFFFFF` | Page background, journal pages |
| Ink | `#000000` | Headlines, body text, primary buttons, footer background |
| Surface | `#F3F3F1` | Quiet grey for image sections (open book, gallery tiles, prompt box) |
| Hairline | `#EBEAE8` | Dividers, card outlines |
| Dot grid | `#C9C7C4` | Journal dot grid, dashed lines |
| Muted text | `#6B6966` | Captions, labels, secondary text |
| Map land | `#D4D2CE` | Dot-grid continents |
| Map ink orange | `#FF5A1F` | Person dot 1, order-section dot |
| Map ink blue | `#1F3DDB` | Person dot 2 |
| Map ink pink | `#FF4F8B` | Person dot 3 |
| Map ink yellow | `#F2A900` | Person dot 4 |
| Map ink green | `#11A07A` | Person dot 5 |

Rule: the five map inks appear **only on the map** (person dots and their halos). Everything
else is black, white and grey.

## 3. Typography

Reference (**measured**): a single webfont family, **Barlow Semi Condensed**, loaded in
500, 500 italic, 700 and 700 italic. Exact sizes are **not measured**.

Wander Wisdom (**applied**):

| Role | Font | Weight | Size | Line height | Case |
|---|---|---|---|---|---|
| Display / hero | Anton | 400 | clamp(2.6rem, 7.4vw, 7rem) | 0.92 | Uppercase |
| Section headline | Anton | 400 | clamp(3.2rem, 9vw, 8rem) | 0.9 | Uppercase |
| List headline | Anton | 400 | clamp(1.6rem, 2.6vw, 2.2rem) | 1.0 | Uppercase |
| Lead quote | Jost Italic | 400 | clamp(1.6rem, 3.6vw, 2.9rem) | 1.2 | Sentence |
| Body | Jost | 400 | 1.125rem (18px) | 1.6 | Sentence |
| Label / caption | Jost | 400 | 0.8 to 0.95rem | 1.2 to 1.5 | Sentence |
| Button | Jost | 600 | 1rem | 1 | Sentence |
| Handwriting (entries) | Caveat, Kalam, Nanum Pen Script, Gochi Hand, Shadows Into Light Two | 400 to 500 | 1.2 to 1.85rem | 1.25 | As written |

Line length stays under about 34em. Anton echoes the book cover; Jost is the clean
geometric body text from the book. Each person on the map writes in their own handwriting.

## 4. Layout and spacing

Reference (**measured**):
- Grid: 24 columns on desktop (min-width 768px), 8 columns on mobile.
- Column and row gap: 11px everywhere.
- Max content width: 1500px.
- Outer gutter: 4vw on desktop, 6vw on mobile.
- Row height scales with container width (factor 0.0215).
- Every section is full-bleed, content width "wide", horizontally centred.
- Image galleries: 20px gap between tiles.
- Section rhythm, top to bottom: full-bleed image hero (white-bold, image overlay 40%)
  → light image section (overlay 15%) → white section → short light section →
  black footer (min-height 10vh, content bottom-aligned).

Wander Wisdom (**applied**):
- Gutter: clamp(1rem, 4vw, 3.5rem).
- Section padding: clamp(5rem, 11vw, 9rem) top and bottom.
- Gallery: 3 columns, 20px gap (2 columns at 960px and below, 12px gap on phones).
- Text measure: 34em. Story and concept use a 5:6 two-column split; one column below 960px.
- Rhythm: map hero (white) → story (white) → concept (surface grey) → open-book image
  (surface grey, full-bleed) → inside the book (white) → order with empty map (white) →
  black footer.

## 5. Components

- **Buttons:** square (2px radius), 48px minimum height, black fill with white text. Hover
  swaps to an outline. One primary button per section at most.
- **Text links:** underlined, 1px, offset 0.18em.
- **Top bar:** transparent and fixed, wordmark on the left, three links on the right.
  Text switches between black and white depending on the section underneath. The reference
  uses a thin-line (1px) menu icon.
- **Journal page card:** white paper with a dot grid (18px), thin grey corner brackets, a
  soft shadow and a 1px hairline. Printed labels in Jost; answers in handwriting.
- **Image tiles:** book page on a surface-grey tile, soft drop shadow under the page,
  caption below in muted text.
- **Open-book spread:** two pages side by side, full-bleed surface background, centre fold
  shading, large soft shadow.
- **Lists:** 1px black rules between rows, Anton titles on the left, body on the right.

## 6. Imagery

Reference (**measured**): about 30 images. Landscapes at about 3:2 (e.g. 5686 × 3791),
portraits at 3:4 (3000 × 4000, contained), squares at 1250 × 1250 for book covers.
Corner radius 0. Image overlays 0%, 15% or 40%. Object-fit cover for full-bleed
backgrounds.

Wander Wisdom (**applied**): real journal pages at their native A5 ratio. Product and travel
photography to be added: candid, natural light, people writing in the journal, generous
negative space.

## 7. Motion

Reference (**measured**): `sectionAnimation: none` and `backgroundMediaEffect: none` on every
section. The only motion is a font-loading fade.

Wander Wisdom (**applied**): motion is reserved for two moments.
1. The intro: the book opens (about 4s, skippable).
2. The map: the journey line draws once, then the camera flies between people on request.
Everything else is static. `prefers-reduced-motion` turns all of it off.

## 8. Do and don't

Do:
- Let images and the map carry the colour.
- Keep one idea per section and lots of white space.
- Use square corners and hairline rules.

Don't:
- Add colour to sections, buttons or headlines.
- Animate sections on scroll.
- Use rounded cards, gradients or decorative icons.
