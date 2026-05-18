# LeadGen.js

Zero‑dependency JavaScript library for capturing leads directly to Google Sheets.

- **MIT Licensed**
- **No backend required** – uses Google Sheets as a database
- **3KB minified+gzipped**
- **Works with any framework**

## Quick start

```html
<form id="my-form">
  <input name="name" required>
  <input name="email" type="email" required>
  <button>Submit</button>
</form>
<script src="https://cdn.jsdelivr.net/gh/NileGazer00/leadgen.js/leadgen.js"></script>
<script>
LeadGen.init({
  formId: "my-form",
  sheetUrl: "YOUR_GOOGLE_APPS_SCRIPT_URL"
});
</script>