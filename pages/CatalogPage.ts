import { Page, Locator } from '@playwright/test'; // Importación necesaria

/**
 * @fileoverview Page Object Model for the Catalog/Collections page.
 * URL: https://vanesa-qa-sandbox.myshopify.com/collections/all
 */

export class CatalogPage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance.
   */
  constructor(page) {
    this.page = page;

    // ── Navigation ──────────────────────────────────────────────────────────
    this.catalogNavLink = page.getByRole('link', { name: 'Catalog' }).first();

    // ── Page header ─────────────────────────────────────────────────────────
    this.pageHeading = page.getByRole('heading', { name: 'Products' });

    // ── Product grid ─────────────────────────────────────────────────────────
    this.productGrid = page.locator('#product-grid');
    this.productCards = page.locator('.product-card-wrapper');

    // ── Availability badges ──────────────────────────────────────────────────
    this.soldOutBadges = page.locator('.badge').filter({ hasText: 'Sold out' });
    this.saleBadges    = page.locator('.badge').filter({ hasText: 'Sale' });

    // ── Sort control ─────────────────────────────────────────────────────────
    /**
     * Uses getByLabel, which targets the visible <label for="SortBy"> on
     * desktop. Falls back gracefully because both desktop and mobile selects
     * share the same label text.
     */
    this.sortBySelect = page.getByLabel('Sort by:').first();

    // ── Product count ────────────────────────────────────────────────────────
    this.productCount = page.locator('#ProductCount');

    // ── Filter panel (mobile) ────────────────────────────────────────────────
    this.filterButton    = page.getByRole('button', { name: /filter/i });
    this.availabilityFilterSection = page.getByRole('button', { name: 'Availability' });

    // ── Cart drawer ──────────────────────────────────────────────────────────
    this.cartIcon        = page.getByRole('link', { name: /cart/i });
    this.cartDrawer      = page.locator('#CartDrawer');
    this.cartDrawerClose = page.getByRole('button', { name: 'Close' });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigates directly to the catalog page.
   */
  async goto() {
    await this.page.goto('/collections/all');
    await this.productGrid.waitFor({ state: 'visible' });
  }

  // ── Dynamic product locator ────────────────────────────────────────────────

  /**
   * Returns a locator for a product link inside the catalog grid,
   * matched by its exact visible name.
   *
   * Usage:
   *   const locator = catalogPage.getProductLink('The Complete Snowboard');
   *   await locator.click();
   *
   * @param {string} productName - Visible product name as shown in the UI.
   * @returns {import('@playwright/test').Locator}
   */
  getProductLink(productName) {
    /**
     * Scope the search to the product grid to avoid matching navigation
     * links (header / footer) that could share the same text.
     * getByRole('link') + exact name mirrors how a real user would identify
     * the card, keeping the locator resilient to class/id changes.
     */
    return this.productGrid.getByRole('link', { name: productName, exact: true }).first();
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Clicks a product card by name and waits for navigation to the
   * product detail page.
   *
   * @param {string} productName - Visible product name.
   * @returns {Promise<void>}
   */
  async clickProduct(productName) {
    const link = this.getProductLink(productName);
    await link.waitFor({ state: 'visible' });
    await link.click();
    // Wait until the browser leaves the collections URL.
    await this.page.waitForURL(/\/products\//);
  }

  /**
   * Selects a sorting option from the "Sort by" dropdown and waits for
   * the product grid to re-render.
   *
   * @param {string} optionLabel - Visible option text, e.g. 'Price, low to high'.
   * @returns {Promise<void>}
   */
  async sortBy(optionLabel) {
    await this.sortBySelect.selectOption({ label: optionLabel });
    /**
     * After sorting, Shopify re-renders the grid via AJAX.
     * Waiting for the loading overlay to disappear confirms the grid is stable.
     */
    await this.page.locator('.loading-overlay').waitFor({ state: 'hidden' });
    await this.productGrid.waitFor({ state: 'visible' });
  }

  /**
   * Returns the total product count displayed on the page (e.g. "13 products").
   *
   * @returns {Promise<string>}
   */
  async getProductCount() {
    await this.productCount.waitFor({ state: 'visible' });
    return (await this.productCount.textContent()).trim();
  }

  /**
   * Returns an array of all visible product names in the current grid state.
   *
   * @returns {Promise<string[]>}
   */
  async getAllProductNames() {
    await this.productGrid.waitFor({ state: 'visible' });
    const links = this.productGrid.getByRole('heading', { level: 5 });
    return links.allInnerTexts();
  }

  /**
   * Checks whether a specific product is marked as "Sold out".
   *
   * @param {string} productName - Visible product name.
   * @returns {Promise<boolean>}
   */
  async isProductSoldOut(productName) {
    /**
     * Scope the badge check to the card wrapper that contains the product link,
     * avoiding false positives from other cards.
     */
    const card = this.productGrid
      .locator('.product-card-wrapper')
      .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });

    const soldOutBadge = card.locator('.badge').filter({ hasText: 'Sold out' });
    return soldOutBadge.isVisible();
  }

  /**
   * Returns the names of all products currently marked as "Sold out".
   *
   * @returns {Promise<string[]>}
   */
  async getSoldOutProductNames() {
    await this.productGrid.waitFor({ state: 'visible' });

    const soldOutCards = this.productGrid
      .locator('.product-card-wrapper')
      .filter({ has: this.page.locator('.badge').filter({ hasText: 'Sold out' }) });

    const names = await soldOutCards
      .getByRole('heading', { level: 5 })
      .allInnerTexts();

    return names.map((n) => n.trim());
  }

  /**
   * Returns the names of all products currently marked as "Sale".
   *
   * @returns {Promise<string[]>}
   */
  async getSaleProductNames() {
    await this.productGrid.waitFor({ state: 'visible' });

    const saleCards = this.productGrid
      .locator('.product-card-wrapper')
      .filter({ has: this.page.locator('.badge').filter({ hasText: 'Sale' }) });

    const names = await saleCards
      .getByRole('heading', { level: 5 })
      .allInnerTexts();

    return names.map((n) => n.trim());
  }

  /**
   * Opens the cart drawer by clicking the cart icon and waits until
   * the drawer is visible.
   *
   * @returns {Promise<void>}
   */
  async openCartDrawer() {
    await this.cartIcon.click();
    await this.cartDrawer.waitFor({ state: 'visible' });
  }

  /**
   * Closes the cart drawer and waits until it leaves the DOM/visibility.
   *
   * @returns {Promise<void>}
   */
  async closeCartDrawer() {
    await this.cartDrawerClose.click();
    await this.cartDrawer.waitFor({ state: 'hidden' });
  }

  // ── Assertions (built-in helpers for specs) ────────────────────────────────

  /**
   * Asserts that the catalog page heading is visible.
   * Useful as a post-navigation smoke check.
   *
   * @returns {Promise<void>}
   */
  async assertPageLoaded() {
    await this.pageHeading.waitFor({ state: 'visible' });
    await this.productGrid.waitFor({ state: 'visible' });
  }

  /**
   * Asserts that clicking a product navigates to its detail URL.
   * Wraps clickProduct with a URL pattern assertion.
   *
   * @param {string} productName - Visible product name.
   * @param {string | RegExp} expectedUrlPattern - URL pattern to validate, e.g. /\/products\/the-complete-snowboard/.
   * @returns {Promise<void>}
   */
  async assertProductNavigation(productName, expectedUrlPattern) {
    await this.clickProduct(productName);
    await this.page.waitForURL(expectedUrlPattern);
  }
}