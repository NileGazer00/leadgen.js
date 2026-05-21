# LeadGen.js

Zero-dependency JavaScript library for capturing leads directly to Google Sheets — no backend required.

[GitHub Repository](https://github.com/NileGazer00/leadgen.js) • [Live Site](https://leadgen.nilegazer.org/)

## About

LeadGen.js is a lightweight JavaScript library that connects HTML forms to Google Sheets using Google Apps Script. It is built for developers who want a simple way to capture leads, newsletter signups, contact form submissions, or other form data without setting up a backend or database.

## Features

- Zero dependencies.
- No backend required.
- Framework agnostic.
- Built-in validation.
- Theme support.
- Session analytics.
- CDN friendly.
- Easy Google Sheets integration.

## How It Works

1. A visitor submits an HTML form.
2. LeadGen.js validates the input and prepares the payload.
3. Data is sent to a Google Apps Script web app.
4. Apps Script writes the row into Google Sheets.
5. The user gets a success response, redirect, or callback.

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/NileGazer00/leadgen.js/leadgen.js"></script>
<script>
  LeadGen.init({
    formId: "lead-form",
    sheetUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL",
    theme: "light",
    validate: true
  });
</script>
```

## Example Form

```html
<form id="lead-form">
  <input name="name" type="text" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <button type="submit">Send</button>
</form>
```

## Google Sheets Setup

1. Create a Google Sheet.
2. Add headers in the first row that match your form field names.
3. Open **Extensions → Apps Script**.
4. Add your script and deploy it as a web app.
5. Copy the deployed web app URL.
6. Paste that URL into `LeadGen.init({ sheetUrl: ... })`.

## Docs

- [Getting Started](docs/getting-started.html)
- [Installation](docs/installation.html)
- [Google Sheets Setup](docs/google-sheets-setup.html)
- [API Reference](docs/api-reference.html)
- [Examples](docs/examples.html)
- [Troubleshooting](docs/troubleshooting.html)

## Project Goal

LeadGen.js is designed to make lead capture simple, fast, and usable on static sites or frontend-only projects. It is intended to be a practical utility for freelancers, agencies, and small teams that need to collect and store leads without building a full backend.

## License

MIT
