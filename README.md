# Wander Wisdom

Website for the Wander Wisdom travel journal by Anna Mussotter.
Plain HTML, CSS and JavaScript. No build step. Open `index.html` or deploy the folder to Vercel/Netlify as a static site.

## Files

- `index.html`: page content (map, idea, inside the book, how to use it, story, launch section)
- `styles.css`: black-and-white styling based on the book (Anton, Jost, Nanum Pen Script from Google Fonts)
- `script.js`: the interactive map. **The people on the map are listed at the top of this file.**
- `images/`: pages rendered from the printed book
- `wander-wisdom-book/`: the book's full text (`BOOK.md`) and style reference pages

## Replacing the example entries

The five entries in `PEOPLE` in `script.js` are examples. For each real entry (with the person's permission), fill in place, date, question, answer, first name and hometown, and set `example: false`. The "Example entry" badge disappears automatically. Also remove the line "These five entries are examples…" in `index.html` when all entries are real.

`x` and `y` are positions on the 1000×500 map (Natural Earth projection). Rough guide: x = 500 is Africa/Europe's longitude 0°, Australia is x ≈ 790–890, the Americas x ≈ 180–380. Easiest: ask Claude Code "add a person in <city> to the map".

## Selling

The launch section links to Instagram for now. When the shop is ready, replace the link of the "Follow the launch on Instagram" button in `index.html` with a Stripe Payment Link or Gumroad/Etsy product link, and add the price to the text above it.
