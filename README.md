# Wander Wisdom

A single-page website for selling the Wander Wisdom travel journal. Plain HTML/CSS/JS — no build step, no dependencies.

## Files

- `index.html` — page content and structure
- `styles.css` — all styling
- `script.js` — mobile nav, FAQ, email signup toast, and buy-button wiring

## Running locally

Just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Connecting real checkout

Buy buttons currently show a "checkout not connected" message. To accept real payments without a backend:

1. Create a [Stripe Payment Link](https://dashboard.stripe.com/payment-links) or a [Gumroad](https://gumroad.com) product for each item (Digital Edition, Printed Journal, Gift Set).
2. Open `script.js` and fill in the `CHECKOUT_LINKS` object with those URLs:

   ```js
   const CHECKOUT_LINKS = {
     "Wander Wisdom — Digital Edition": "https://buy.stripe.com/xxxxx",
     "Wander Wisdom — Printed Journal": "https://buy.stripe.com/yyyyy",
     "Wander Wisdom — Gift Set": "https://buy.stripe.com/zzzzz",
   };
   ```

3. That's it — the buttons will navigate straight to checkout.

The email signup form currently only shows a confirmation toast. To actually collect emails, connect it to a service like Mailchimp, ConvertKit, or Buttondown (they each provide a form action URL you can drop into `signupForm` in `index.html`).

## Customizing

- Update copy, prices, and images directly in `index.html`.
- Colors and fonts are defined as CSS variables at the top of `styles.css` (`:root`).
- The journal cover and about-section graphics are inline SVG — swap in real product photos by replacing the `.hero-art` / `.about-art` markup with `<img>` tags.

## Deploying

Any static host works — GitHub Pages, Netlify, Vercel, or Cloudflare Pages. For GitHub Pages: push this repo, then enable Pages in the repo settings pointing at the root of the default branch.
