import { Page, Locator } from "@playwright/test";

export class CatalogPage {
  // ── Property declarations ─────────────────────────────────────────────────
  readonly page: Page;

  // Navigation
  readonly catalogNavLink: Locator;
  readonly brandLogoLink: Locator;
  readonly homeNavLink: Locator;
  readonly contactNavLink: Locator;

  // Page header
  readonly pageHeading: Locator;

  // Product grid
  readonly productGrid: Locator;
  readonly productCards: Locator;

  // Availability badges (on cards)
  readonly soldOutBadges: Locator;
  readonly saleBadges: Locator;

  // Sort control
  readonly sortBySelect: Locator;

  // Product count
  readonly productCount: Locator;

  // ── Filter drawer ─────────────────────────────────────────────────────────
  readonly filterButton: Locator; // "Filter" button that opens drawer
  readonly filterDrawer: Locator; // The drawer panel itself
  readonly filterDrawerClose: Locator; // ✕ button on drawer
  readonly filterDrawerTitle: Locator; // "Filter" heading inside drawer

  // Filter drawer - main sections
  readonly availabilitySection: Locator; // "Availability →" row
  readonly priceSection: Locator; // "Price →" row

  // Filter drawer - Availability sub-panel
  readonly inStockCheckbox: Locator; // "In stock (10)"
  readonly outOfStockCheckbox: Locator; // "Out of stock (3)"
  readonly availabilityBackButton: Locator; // "← Availability" back arrow

  // Filter drawer - Price sub-panel
  readonly priceFromInput: Locator; // "From" input
  readonly priceToInput: Locator; // "To" input
  readonly priceMaxLabel: Locator; // "The highest price is $2,629.95"
  readonly priceBackButton: Locator; // "← Price" back arrow

  // Active filter pills (shown on grid after applying)
  readonly activeFilterPills: Locator; // All active filter tags
  readonly removeAllFiltersButton: Locator; // "Remove all" link

  // Cart drawer
  readonly cartIcon: Locator;
  readonly cartDrawer: Locator;
  readonly cartDrawerClose: Locator;
  filterDrawerDetails: Locator;

  // Logo/brand link → navigates to homepage

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.catalogNavLink = this.page
      .getByRole("banner") // Selects the header/banner region
      .getByRole("link", { name: "Catalog" });
    // Inside your CatalogPage class
    this.homeNavLink = this.page
      .getByRole("banner") // Selects the header/banner region
      .getByRole("link", { name: "Home", exact: true });
    this.contactNavLink = this.page
      .getByRole("banner") // Selects the header/banner region
      .getByRole("link", {
        name: "Contact",
      });

    // Logo/brand link → navigates to homepage
    this.brandLogoLink = page
      .locator("header")
      .getByRole("link", { name: "vanesa-qa-sandbox" });

    // Page header
    // En el constructor de CatalogPage.ts
    this.pageHeading = page.getByRole("heading", {
      name: "Products",
      level: 1,
    });

    // Product grid
    this.productGrid = page.locator("#product-grid");
    this.productCards = page.locator(".product-card-wrapper");

    // Availability badges (on cards)
    this.soldOutBadges = page.locator(".badge").filter({ hasText: "Sold out" });
    this.saleBadges = page.locator(".badge").filter({ hasText: "Sale" });

    // Sort control
    this.sortBySelect = page.locator("#SortBy");

    // Product count — e.g. "13 products" or "1 of 13 products"
    this.productCount = page.locator("#ProductCount");

    // ── Filter drawer ─────────────────────────────────────────────────────────
    //this.filterDrawer = page.locator(".mobile-facets__wrapper");
    // El <menu-drawer> NUNCA se oculta — jamás uses waitFor("hidden") sobre él.
    // El estado abierto/cerrado lo controla el atributo `open` del <details> interior.
    this.filterDrawer = page.locator(".mobile-facets__disclosure");

    this.filterDrawerDetails = page.locator(".mobile-facets__details");

    // El botón de abrir Y cerrar es el MISMO summary exterior — es un toggle nativo de <details>.
    // El .mobile-facets__close--no-js está oculto por CSS cuando JS está activo.
    this.filterDrawerClose = page.locator(
      "summary.mobile-facets__open-wrapper",
    );
    this.filterButton = page.locator("summary.mobile-facets__open-wrapper");

    //this.filterButton = page.locator("summary").filter({ hasText: "Filter" });
    //this.filterDrawerClose = this.filterDrawer.locator(
    //  "summary.mobile-facets__open-wrapper",
    //);
    this.filterDrawerTitle = page.getByRole("heading", { name: "Filter" });

    // Sin { visible: true } en la definición: ese filtro se aplica dinámicamente
    // en el momento de la aserción, no al construir el locator.
    this.availabilitySection = this.filterDrawer
      .locator("summary")
      .filter({ hasText: "Availability" });

    this.priceSection = this.filterDrawer
      .locator("summary")
      .filter({ hasText: "Price" });

    // Availability sub-panel checkboxes
    // Cambiar de input a label — el label es el elemento clickeable real
    this.inStockCheckbox = page.locator(
      'label[for="Filter-filter.v.availability-mobile-1"]',
    );
    this.outOfStockCheckbox = page.locator(
      'label[for="Filter-filter.v.availability-mobile-2"]',
    );

    this.availabilityBackButton = page
      .getByRole("button", { name: "Availability" })
      .filter({ hasText: "←" });

    // Price sub-panel inputs
    this.priceFromInput = page.locator("#Mobile-Filter-Price-GTE");
    this.priceToInput = page.locator("#Mobile-Filter-Price-LTE");
    this.priceMaxLabel = page.getByText(/The highest price is/);
    this.priceBackButton = page
      .getByRole("button", { name: "Price" })
      .filter({ hasText: "←" });

    // Active filter pills
    this.activeFilterPills = page.locator(".active-facets__button");
    this.removeAllFiltersButton = page.getByRole("button", {
      name: "Remove all",
    });

    // Cart drawer
    this.cartIcon = page.getByRole("link", { name: /cart/i });
    this.cartDrawer = page.locator("#CartDrawer");
    this.cartDrawerClose = page.getByRole("button", { name: "Close" });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  /** Navigates directly to the catalog page. */
  async goto(): Promise<void> {
    await this.page.goto("/collections/all", { waitUntil: "domcontentloaded" });
    await this.productGrid.waitFor({ state: "visible" });
  }

  /**
   * Clicks the brand logo and waits for navigation to the homepage.
   */
  async clickBrandLogo(): Promise<void> {
    await this.brandLogoLink.click();
    await this.page.waitForURL("/");
  }

  // ── Dynamic product locator ────────────────────────────────────────────────

  /**
   * Returns a scoped locator for a product link inside the grid.
   * @param productName - Visible product name.
   */
  getProductLink(productName: string) {
    return this.page
      .locator("#product-grid")
      .getByRole("link", { name: productName })
      .first();
  }

  // ── Sort ───────────────────────────────────────────────────────────────────

  /**
   * Selects a sort option and waits for the grid to re-render.
   * @param optionLabel - e.g. 'Price, low to high'
   */
  async sortBy(optionLabel: string): Promise<void> {
    await this.sortBySelect.selectOption({ label: optionLabel });
    await this.page.locator(".loading-overlay").waitFor({ state: "hidden" });
    await this.productGrid.waitFor({ state: "visible" });
  }

  // ── Filter drawer ──────────────────────────────────────────────────────────

  /** Opens the filter drawer and waits for it to be visible. */
  // CatalogPage.ts

  /* async openFilterDrawer(): Promise<void> {
    if (await this.filterDrawer.isVisible()) return;
    await this.filterButton.click();
    await this.filterDrawer.waitFor({ state: "visible", timeout: 8000 });

    // Esperar a que el contenedor interno deje de tener la clase
    // 'has-submenu' que bloquea la visibilidad de los summary internos.
    // Dawn JS añade/quita esta clase para mostrar el panel de filtros.
    await this.page.waitForFunction(
      () => {
        const main = document.querySelector(".mobile-facets__main");
        return main && !main.classList.contains("has-submenu");
      },
      { timeout: 8000 },
    );
  } */

  async openFilterDrawer(): Promise<void> {
    const isOpen = await this.filterDrawer.evaluate((el) =>
      el.hasAttribute("open"),
    );
    if (isOpen) return;
    await this.filterButton.click();
    await this.page.waitForFunction(
      () =>
        document
          .querySelector(".mobile-facets__disclosure")
          ?.hasAttribute("open"),
      { timeout: 8000 },
    );
  }
  /** Closes the filter drawer via the ✕ button. */
  /** Closes the filter drawer via the ✕ button. */
  async closeFilterDrawer(): Promise<void> {
    await this.filterDrawerClose.click();

    // Esperar que <details> pierda el atributo open — no que el wrapper se oculte
    await this.page.waitForFunction(
      () =>
        !document
          .querySelector(".mobile-facets__disclosure")
          ?.hasAttribute("open"),
      { timeout: 8000 },
    );
  }

  /**
   * Opens the Availability sub-panel inside the filter drawer.
   * Requires the drawer to be open first.
   */
  async openAvailabilityFilter(): Promise<void> {
    await this.availabilitySection.click();
    // Esperar al input, no al label, para detectar visibilidad real
    await this.page
      .locator("#Filter-filter\\.v\\.availability-mobile-1")
      .waitFor({ state: "visible" });
  }

  async filterByInStock(): Promise<void> {
    await this.openFilterDrawer();
    await this.openAvailabilityFilter();
    await this.inStockCheckbox.click();
    await this.page.waitForURL(/filter\.v\.availability=1/);
    // Esperar que aparezca "of 13 products" (formato de resultado filtrado)
    // en lugar de negar "13 products" (que siempre está presente)
    await this.page.waitForFunction(() =>
      document.querySelector("#ProductCount")?.textContent?.includes("of 13"),
    );
    await this.productGrid.waitFor({ state: "visible" });
  }

  async filterByOutOfStock(): Promise<void> {
    await this.openFilterDrawer();
    await this.openAvailabilityFilter();
    await this.outOfStockCheckbox.click();
    await this.page.waitForURL(/filter\.v\.availability=0/);
    await this.page.waitForFunction(() =>
      document.querySelector("#ProductCount")?.textContent?.includes("of 13"),
    );
    await this.productGrid.waitFor({ state: "visible" });
  }

  /**
   * Opens the Price sub-panel inside the filter drawer.
   */
  async openPriceFilter(): Promise<void> {
    await this.priceSection.click();
    await this.page
      .locator("#Mobile-Filter-Price-GTE")
      .waitFor({ state: "visible" });
  }

  /**
   * Filters products by a price range.
   * @param from - Minimum price (e.g. 0)
   * @param to   - Maximum price (e.g. 10)
   */
  async filterByPriceRange(from: number, to: number): Promise<void> {
    await this.openFilterDrawer();
    await this.openPriceFilter();
    await this.priceFromInput.fill(String(from));
    await this.priceToInput.fill(String(to));
    await this.priceToInput.press("Enter");
    await this.page.waitForURL(/filter\.v\.price/);
    await this.page.waitForFunction(() =>
      document.querySelector("#ProductCount")?.textContent?.includes("of 13"),
    );
    await this.productGrid.waitFor({ state: "visible" });
  }
  /** Removes all active filters by clicking "Remove all". */
  async removeAllFilters(): Promise<void> {
    const isOpen = await this.filterDrawer.evaluate((el) =>
      el.hasAttribute("open"),
    );
    if (isOpen) {
      await this.closeFilterDrawer();
    }

    await this.removeAllFiltersButton.click();

    // waitForURL no sirve aquí: la URL ya ES /collections/all antes del click.
    // Esperar que el ProductCount vuelva a "13 products" (sin "of").
    await this.page.waitForFunction(
      () => {
        const text = document.querySelector("#ProductCount")?.textContent ?? "";
        return text.trim() === "13 products";
      },
      { timeout: 10000 },
    );

    await this.productGrid.waitFor({ state: "visible" });
  }

  /**
   * Returns the text of all active filter pills.
   * e.g. ['Availability: In stock', '$0.00 -$10.00']
   */
  async getActiveFilterLabels(): Promise<string[]> {
    const pills = this.activeFilterPills;
    return (await pills.allInnerTexts()).map((t) => t.replace("×", "").trim());
  }

  // ── Product helpers ────────────────────────────────────────────────────────

  /** Returns the product count text, e.g. "13 products" or "1 of 13 products". */
  async getProductCount(): Promise<string> {
    await this.productCount.waitFor({ state: "visible" });
    return ((await this.productCount.textContent()) ?? "").trim();
  }

  /** Returns all visible product names in the current grid state. */
  async getAllProductNames(): Promise<string[]> {
    await this.productGrid.waitFor({ state: "visible" });
    return (
      await this.productGrid.getByRole("heading", { level: 3 }).allInnerTexts()
    ).map((n) => n.trim());
  }

  /**
   * Clicks a product and waits for navigation to its detail page.
   * @param productName - Visible product name.
   */
  async clickProduct(productName: string): Promise<void> {
    const link = this.getProductLink(productName);
    await link.waitFor({ state: "visible" });
    await link.click();
    await this.page.waitForURL(/\/products\//);
  }

  /**
   * Checks whether a specific product card shows the "Sold out" badge.
   * @param productName - Visible product name.
   */
  async isProductSoldOut(productName: string): Promise<boolean> {
    const productItem = this.productGrid
      .locator("li", { hasText: productName })
      .first();
    return await productItem
      .getByText("Sold out", { exact: true })
      .first()
      .isVisible();
  }

  /** Returns the names of all products marked as "Sold out". */
  async getSoldOutProductNames(): Promise<string[]> {
    await this.productGrid.waitFor({ state: "visible" });
    const cards = this.productGrid.locator(".product-card-wrapper").filter({
      has: this.page.locator(".badge").filter({ hasText: "Sold out" }),
    });
    return (await cards.getByRole("heading", { level: 5 }).allInnerTexts()).map(
      (n) => n.trim(),
    );
  }

  /** Returns the names of all products marked as "Sale". */
  async getSaleProductNames(): Promise<string[]> {
    await this.productGrid.waitFor({ state: "visible" });
    const cards = this.productGrid
      .locator(".product-card-wrapper")
      .filter({ has: this.page.locator(".badge").filter({ hasText: "Sale" }) });
    return (await cards.getByRole("heading", { level: 5 }).allInnerTexts()).map(
      (n) => n.trim(),
    );
  }

  // ── Cart drawer ────────────────────────────────────────────────────────────

  /** Opens the cart drawer. */
  async openCartDrawer(): Promise<void> {
    await this.cartIcon.click();
    await this.cartDrawer.waitFor({ state: "visible" });
  }

  /** Closes the cart drawer. */
  async closeCartDrawer(): Promise<void> {
    await this.cartDrawerClose.click();
    await this.cartDrawer.waitFor({ state: "hidden" });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /** Asserts heading and grid are visible — post-navigation smoke check. */
  async assertPageLoaded(): Promise<void> {
    await this.pageHeading.waitFor({ state: "visible" });
    await this.productGrid.waitFor({ state: "visible" });
  }

  /**
   * Clicks a product and asserts the resulting URL matches the expected pattern.
   * @param productName       - Visible product name.
   * @param expectedUrlPattern - e.g. /\/products\/the-complete-snowboard/
   */
  async assertProductNavigation(
    productName: string,
    expectedUrlPattern: string | RegExp,
  ): Promise<void> {
    await this.clickProduct(productName);
    await this.page.waitForURL(expectedUrlPattern);
  }
}
