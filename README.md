Playwright Automation Suite - Shopify Sandbox

Este repositorio contiene una suite de pruebas automatizadas utilizando Playwright con TypeScript, enfocada en validar las funcionalidades críticas del catálogo y procesos de filtrado en una tienda Shopify de pruebas (Hydrogen/Liquid).

🚀 Características Principales

- Patrón de Diseño Page Object Model (POM): Estructura mantenible y escalable.
- Pruebas de Catálogo: Validación de visibilidad de productos, badges de "Sale" y "Sold out".
- Gestión de Filtros: Pruebas de apertura/cierre de cajones de filtrado y resolución de conflictos de locators en entornos responsive (Desktop vs Mobile).
- Validación de Ordenamiento: Verificación de lógica de ordenamiento por precio, fecha y orden alfabético.

🛠️ Tecnologías Utilizadas

- Playwright - Framework de automatización.
- TypeScript - Lenguaje para tipado seguro.
- GitHub Actions - Para CI/CD.

📋 Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn

🔧 Instalación y Configuración

Clonar el repositorio:

Bash git clone https://github.com/vanesasantos/shopify-e2e-playwright-ts

cd shopify-e2e-playwright-ts

Instalar dependencias:

Bash npm install

Instalar navegadores de Playwright:

Bash npx playwright install

🧪 Ejecución de Pruebas

Ejecutar todos los tests:

Bash npx playwright test

Ejecutar tests en modo UI (interactivo):

Bash npx playwright test --ui

Ejecutar un archivo específico:

Bash npx playwright test tests/CatalogPage.spec.ts
