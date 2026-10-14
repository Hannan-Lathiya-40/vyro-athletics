# VYRO Athletics

A static, two-page sportswear site for the fictional label **VYRO ATHLETICS**. Tagline: Built to outmove.

Open it with any static server. No build step, database, or backend.

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Pages

- `index.html` — campaign home
- `products.html` — filterable shop

## What works in the browser

- Shared bag and wishlist, saved in `localStorage` (`vyro-cart`, `vyro-wishlist`)
- Category, gender, collection, new, search, wishlist, and sort — no reload
- Quick view with size validation before add
- Newsletter addresses saved only on this device (`vyro-newsletter`)
- Motion uses CSS plus GSAP ScrollTrigger, and backs off when `prefers-reduced-motion` is set

Checkout is a preview. Nothing is charged and no order is sent.
