# Morningside Mobile Website

Professional static website for **Morningside Mobile**, a **Bell Authorized Dealer** offering mobile phones, accessories, and mobility plans.

## Pages

- `index.html` - Home page
- `products.html` - Phones, accessories, and plans
- `about.html` - Business story and values
- `contact.html` - Contact form, store info, social links, and embedded map

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome icons
- Google Fonts (Inter)
- Formspree (contact form handling)

## Features

- Responsive sticky navigation
- Light professional UI with purple gradient branding
- Product filtering (brand + price) and phone search
- Accessories live search
- Contact form connected to Formspree
- Success message after form submission
- Clickable contact actions (map, phone, WhatsApp, email)
- Social media links (Facebook, Instagram, TikTok)
- Embedded Google Map on contact page

## Project Structure

```text
morningsidemobile/
├── index.html
├── products.html
├── about.html
├── contact.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── ...images/logo/favicon...
└── README.md
```

## Run Locally

No build step is required.

1. Open the project folder.
2. Open `index.html` in your browser.

For best behavior (especially form redirects and asset paths), use a local server if available.

## Contact Form (Formspree)

The form on `contact.html` submits to:

- `https://formspree.io/f/mykjzerb`

Current form behavior:

- sends message with custom subject
- redirects back to `contact.html?success=true`
- shows a success banner after redirect

## Quick Content Updates

### Store information

Update these in:

- `contact.html` (Store Information block)
- all page footers (`index.html`, `products.html`, `about.html`, `contact.html`)

### Social links

Update anchor URLs in:

- footer sections (all pages)
- contact page Follow Us block

### Featured products and accessories

Update in:

- `products.html`

If adding more phones, keep `data-category` and `data-price` attributes so filtering continues to work.

## Notes

- Favicon is set to `assets/img/logo.jpg` on all pages.
- Keep paths consistent (`assets/css/style.css`, `assets/js/script.js`) when moving files.
