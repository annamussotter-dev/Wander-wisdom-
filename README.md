# Wander Wisdom

Landing page for **Wander Wisdom**, the co-creation travel journal by Anna Mussotter.
Plain HTML, CSS and JavaScript: no build step, no cookies, fonts are self-hosted.

## Files

| File | What it is |
|---|---|
| `index.html` | All text on the page |
| `script.js` | The people on the map (`PEOPLE` at the top), the book intro, the journal card |
| `styles.css` | Colours, fonts and layout |
| `images/` | Book pages and **your photos** (see below) |
| `assets/fonts/` | Self-hosted fonts (no Google Fonts requests, better for GDPR) |
| `impressum.html`, `datenschutz.html`, `widerruf.html` | Legal placeholder pages, **fill in before going live** |
| `DESIGN.md` | Design system (for Stitch) |
| `wander-wisdom-book/` | Book text (`BOOK.md`) and original page images |

## Add your photos

Upload them into the `images/` folder with exactly these names (JPG):

| File name | Where it appears |
|---|---|
| `anna-with-journal.jpg` | "The idea": you holding the book |
| `wisdom-1.jpg` … `wisdom-6.jpg` | "Collected wisdom": photos of entries and moments from your travels |

Portrait photos (4:5) look best. Until a photo exists, the frame shows "photo coming soon".
For the collected-wisdom photos, write a short caption into the matching `<figcaption>`
in `index.html` (search for `wisdom-1.jpg`). Only show entries with the writer's permission.

## Replace the example entries on the map

Open `script.js`. Each person in `PEOPLE` has a place, date, map position (`x`, `y`),
question, answer, name and hometown. Set `example: false` for real entries.

## Run it locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy on Vercel

1. vercel.com → sign in with GitHub → **Add New → Project**.
2. Pick the `Wander-wisdom-` repository. Framework preset: **Other**. No build command.
3. **Deploy**. Every push updates the site.
