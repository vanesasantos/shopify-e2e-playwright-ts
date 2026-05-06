Playwright Automation Suite - Shopify Sandbox
This repository contains an automated test suite using Playwright with TypeScript, focused on validating critical catalog functionalities and filtering processes in a Shopify test store (Hydrogen/Liquid).

🚀 Key Features
Page Object Model (POM) Design Pattern: Maintainable and scalable structure.

Catalog Testing: Validation of product visibility, as well as "Sale" and "Sold out" badges.

Filter Management: Tests for opening/closing filter drawers and resolving locator conflicts in responsive environments (Desktop vs. Mobile).

Sorting Validation: Verification of sorting logic by price, date, and alphabetical order.

🛠️ Technologies Used
Playwright – Automation framework.

TypeScript – Language for type safety.

GitHub Actions – For CI/CD.

📋 Prerequisites
Node.js (v18 or higher)

npm or yarn

🔧 Installation and Setup
Clone the repository:

Bash
git clone https://github.com/vanesasantos/shopify-e2e-playwright-ts
cd shopify-e2e-playwright-ts
Install dependencies:

Bash
npm install
Install Playwright browsers:

Bash
npx playwright install
🧪 Running Tests
Run all tests:

Bash
npx playwright test
Run tests in UI mode (interactive):

Bash
npx playwright test --ui
Run a specific file:

Bash
npx playwright test tests/CatalogPage.spec.ts
