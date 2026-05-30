# 🛒 Playwright Automation Suite — Shopify Sandbox
> **Scalable End-to-End Testing Framework built with TypeScript, Playwright, and GitHub Actions using the Page Object Model (POM).**

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=Playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## 🎯 Project Overview
This repository contains a production-grade automated test suite designed to validate critical business flows, catalog behaviors, and filtering systems within a headless **Shopify Test Store (Hydrogen/Liquid)**. 

The core goal of this project is to demonstrate how to build robust, flakiness-free automation that adapts seamlessly to responsive design changes (Desktop vs. Mobile) and dynamic locator states.

---

## 🚀 Key Framework Features

* **Architectural Cleanliness (POM):** Implements a strict *Page Object Model* pattern to decouple test logic from DOM elements, reducing maintenance overhead.
* **Smart Catalog Validation:** Verifies dynamic visual states including item visibility, "Sale" tags, and "Sold Out" behavioral blocks.
* **Cross-Platform Responsive Testing:** Includes strategies to handle responsive layout shifts, drawer navigation overlays, and locator conflict resolutions across diverse viewports.
* **Algorithmic Sorting Assertions:** Deep checks for rendering logic, validating price changes, date filters, and alphabetical sort ordering.

---

## 🏗️ Core Architecture & Directory Layout

```text
├── .github/workflows/     # CI/CD Pipeline Definitions (Automated Runs on PR)
├── pages/                 # Page Object Models (Encapsulated Selectors & Actions)
├── tests/                 # Execution Spec Files (Isolated Test Scenarios)
├── playwright.config.ts   # Parallelization, Retries, and Browser Context Config
└── tsconfig.json          # TypeScript Compiler Rules
```
---
## 🛠️ Prerequisites & Local Setup

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/vanesasantos/shopify-e2e-playwright-ts.git
cd shopify-e2e-playwright-ts
```
### 2. Install Project Dependencies
```bash
npm install
```
### 3. Setup Automation Browsers
```bash
npx playwright install
```
---
## 🧪 Test Execution Suites
Run tests using one of the following commands depending on your target validation flow:

### 📑 Run All Automated Specs (Headless)
```bash
npx playwright test
```
### 🖥️ Launch Interactive UI Mode (Debugging & Trace Viewer)
```bash
npx playwright test --ui
```
### 🎯 Execute a Specific Test Context
```bash
npx playwright test tests/CatalogPage.spec.ts
```
---
## 👨‍💻 Author & Strategic Contact

* **Vanesa Santos** — *Software Engineer & QA Specialist*
* **LinkedIn:** [linkedin.com/in/santosvanesa](https://www.linkedin.com/in/santosvanesa/)
* **Credentials:** ISTQB® Certified | University Professor
