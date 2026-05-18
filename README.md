<div align="center">
  <h1>📦 LeadGen.js</h1>
  <p><strong>Zero‑dependency JavaScript library for capturing leads directly to Google Sheets — no backend required.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
    <img src="https://img.shields.io/badge/size-3KB%20gzipped-brightgreen" alt="3KB gzipped">
    <img src="https://img.shields.io/badge/dependencies-none-success" alt="No dependencies">
    <img src="https://data.jsdelivr.com/v1/package/gh/NileGazer00/leadgen.js/badge" alt="jsDelivr CDN">
  </p>
  <p>
    <a href="https://js-leadmachine.js.org">📘 Documentation</a> •
    <a href="#-quick-start">⚡ Quick Start</a> •
    <a href="#-features">✨ Features</a> •
    <a href="#-api-reference">📖 API</a>
  </p>
  <br>
</div>

## 🎬 Demo & Animation

> **Want to see it in action?**  
> *(Insert a GIF or video of a form submitting to Google Sheets here)*  
> 👉 *Recommended: use a screen recording of the form filling, sheet updating live, or add a Lottie animation of data flowing.*  
> **Placeholder:** `![Demo Animation](https://via.placeholder.com/800x400?text=Live+Demo+GIF+Coming+Soon)`

## ✨ Features

- 🚀 **Zero Backend** – Google Sheets is your database.  
- ⚡ **3KB gzipped** – No bloat, fast loading.  
- 🎨 **Themes** – Light, dark, or custom CSS.  
- ✅ **Built‑in Validation** – Required fields, email format.  
- 📊 **Analytics** – Submission counters & conversion rate.  
- 🔒 **Concurrency‑safe** – LockService prevents lost writes.  
- 🌐 **Framework Agnostic** – Works with React, Vue, Svelte, or vanilla.  
- 📦 **CDN / npm** – Install in seconds.

## 🚀 Quick Start

### 1. Create your HTML form

```html
<form id="lead-form">
  <input type="text" name="fullName" placeholder="Full name" required>
  <input type="email" name="email" placeholder="Email address" required>
  <button type="submit">Submit</button>
</form>
