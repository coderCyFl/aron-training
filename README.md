# Aron Training

Public website for Aron Training, a personal training practice. New clients can request a 1-hour trial session and complete a short intake survey.

## Live site

https://codercyfl.github.io/aron-training/

## Preview locally

This is a static site with no build step. From this folder:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Collecting trial requests

GitHub Pages cannot store form submissions on its own. Delivery is configured in `js/config.js`.

Until a real address is set, the form still validates and shows a thank-you screen. Visitors can copy their answers. Requests are **not** emailed automatically.

### Option 1 — Mailto (simplest)

1. Open `js/config.js`.
2. Set `contactEmail` to Aron's real email address.
3. Commit and push the change.

After a valid submit, the visitor's email app opens with a pre-filled message. They still need to press Send. Long answers may be shortened in the email; the full text remains on the thank-you screen.

### Option 2 — Formspree (recommended for reliability)

1. Create a form at [formspree.io](https://formspree.io).
2. Set `formEndpoint` in `js/config.js` to `https://formspree.io/f/xxxxxx`.
3. Commit and push.

Submissions are posted to Formspree and arrive in Aron's inbox without relying on the visitor's email app.

### Option 3 — FormSubmit

Set `formEndpoint` to `https://formsubmit.co/ajax/aron@example.com`, using Aron's real address. See [formsubmit.co](https://formsubmit.co).

Do not put a placeholder or made-up address in `contactEmail`.

## Deploy

The site is served from the `main` branch root by GitHub Pages. Pushing to `main` updates https://codercyfl.github.io/aron-training/

A workflow in `.github/workflows/pages.yml` deploys the repository root to Pages.

## Photos

Studio portraits of Aron are in `images/aron-front.jpg` and `images/aron-back.jpg`.
