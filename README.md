\# LeadGen.js



\*\*Zero-dependency JavaScript library for capturing leads directly to Google Sheets — no backend required.\*\*



\[!\[MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

\[!\[jsDelivr](https://data.jsdelivr.com/v1/package/gh/NileGazer00/leadgen.js/badge)](https://www.jsdelivr.com/package/gh/NileGazer00/leadgen.js)

!\[Size](https://img.shields.io/badge/size-3KB%20gzipped-brightgreen)

!\[Dependencies](https://img.shields.io/badge/dependencies-none-success)



\---



\## 🚀 Quick start



Add a form to your HTML, include LeadGen.js, and initialize with your Google Sheets URL.



```html

<form id="lead-form">

&#x20; <input type="text" name="fullName" placeholder="Full name" required>

&#x20; <input type="email" name="email" placeholder="Email address" required>

&#x20; <button type="submit">Submit</button>

</form>



<script src="https://cdn.jsdelivr.net/gh/NileGazer00/leadgen.js/leadgen.js"></script>

<script>

&#x20; LeadGen.init({

&#x20;   formId: "lead-form",

&#x20;   sheetUrl: "https://script.google.com/macros/s/YOUR\_SCRIPT\_ID/exec"

&#x20; });

</script>

