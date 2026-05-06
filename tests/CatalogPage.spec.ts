import { test, expect } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";

test.describe("Catalog Page", () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    catalogPage = new CatalogPage(page);
    await catalogPage.goto();
  });

  // ── Smoke ──────────────────────────────────────────────────────────────────

  test.describe("Smoke", () => {
    test('loads with heading "Products" visible', async () => {
      await expect(catalogPage.pageHeading).toBeVisible();
    });

    test('displays "13 products" label above the product grid', async () => {
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });

    test('sort by dropdown is visible and set to "Alphabetically, A-Z" by default', async () => {
      await expect(catalogPage.sortBySelect).toBeVisible();
      await expect(catalogPage.sortBySelect).toHaveValue("title-ascending");
    });

    test("filter button is visible", async () => {
      await expect(catalogPage.filterButton).toBeVisible();
    });
  });

  // ── Navigation ─────────────────────────────────────────────────────────────

  test.describe("Navigation", () => {
    test("navigates to detail page of an available product", async ({
      page,
    }) => {
      await catalogPage.assertProductNavigation(
        "The Complete Snowboard",
        /\/products\/the-complete-snowboard/,
      );
      await expect(page).toHaveURL(/\/products\/the-complete-snowboard/);
    });

    test("navigates to detail page of a sold out product", async ({ page }) => {
      await catalogPage.assertProductNavigation(
        "Gift Card",
        /\/products\/gift-card/,
      );
      await expect(page).toHaveURL(/\/products\/gift-card/);
    });

    test("navigates to detail page of a sale product", async ({ page }) => {
      await catalogPage.assertProductNavigation(
        "The Compare at Price Snowboard",
        /\/products\/the-compare-at-price-snowboard/,
      );
      await expect(page).toHaveURL(
        /\/products\/the-compare-at-price-snowboard/,
      );
    });

    test("clicking brand logo navigates to homepage", async ({ page }) => {
      await catalogPage.clickBrandLogo();
      await expect(page).toHaveURL("/");
    });

    test("clicking Home nav link navigates to homepage", async ({ page }) => {
      await catalogPage.homeNavLink.click();
      await expect(page).toHaveURL("/");
    });

    test("clicking Contact nav link navigates to contact page", async ({
      page,
    }) => {
      await catalogPage.contactNavLink.click();
      await expect(page).toHaveURL(/\/pages\/contact/);
    });
  });

  // ── Availability ───────────────────────────────────────────────────────────

  test.describe("Availability", () => {
    test("Gift Card displays sold out badge", async () => {
      const isSoldOut = await catalogPage.isProductSoldOut("Gift Card");
      expect(isSoldOut).toBe(true);
    });

    test("The 3p Fulfilled Snowboard displays sold out badge", async () => {
      const isSoldOut = await catalogPage.isProductSoldOut(
        "The 3p Fulfilled Snowboard",
      );
      expect(isSoldOut).toBe(true);
    });

    test("The Out of Stock Snowboard displays sold out badge", async () => {
      const isSoldOut = await catalogPage.isProductSoldOut(
        "The Out of Stock Snowboard",
      );
      expect(isSoldOut).toBe(true);
    });

    test("returns exactly 3 sold out products", async () => {
      const soldOutLocator = catalogPage.productGrid
        .locator(".product-card-wrapper")
        .filter({
          has: catalogPage.page.locator(".badge", { hasText: "Sold out" }),
        });

      await expect(soldOutLocator).toHaveCount(3);
    });

    test("returns correct list of sold out product names", async () => {
      const soldOutNames = catalogPage.productGrid
        .locator(".product-card-wrapper")
        .filter({
          has: catalogPage.page.locator(".badge", { hasText: "Sold out" }),
        })
        .locator("h3.card__heading.h5 a");

      await expect(soldOutNames).toHaveText([
        "Gift Card",
        "The 3p Fulfilled Snowboard",
        "The Out of Stock Snowboard",
      ]);
    });

    test("The Compare at Price Snowboard displays sale badge", async () => {
      const productCard = catalogPage.productGrid
        .locator("li", {
          hasText: "The Compare at Price Snowboard",
        })
        .first();
      const saleBadge = productCard.getByText("Sale", { exact: true }).first();

      await expect(saleBadge).toBeVisible();
    });

    test("available product does not display sold out badge", async () => {
      const isSoldOut = await catalogPage.isProductSoldOut(
        "The Complete Snowboard",
      );
      expect(isSoldOut).toBe(false);
    });
  });

  // ── Sorting ────────────────────────────────────────────────────────────────

  test.describe("Sorting", () => {
    test("products are sorted alphabetically A-Z by default", async () => {
      const names = await catalogPage.getAllProductNames();
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sorted);
    });

    test("re-renders grid after sorting alphabetically Z-A", async () => {
      await catalogPage.sortBy("Alphabetically, Z-A");
      const expectedOrder = [
        "The Videographer Snowboard",
        "The Out of Stock Snowboard",
        "The Multi-managed Snowboard",
        "The Multi-location Snowboard",
        "The Inventory Not Tracked Snowboard",
        "The Complete Snowboard",
        "The Compare at Price Snowboard",
        "The Collection Snowboard: Oxygen",
        "The Collection Snowboard: Liquid",
        "The Collection Snowboard: Hydrogen",
        "The 3p Fulfilled Snowboard",
        "Selling Plans Ski Wax",
        "Gift Card",
      ];
      const productLinks = catalogPage.page
        .getByRole("listitem")
        .getByRole("heading", { level: 3 })
        .getByRole("link");
      await expect(productLinks).toHaveText(expectedOrder);
    });

    test("re-renders grid after sorting by price low to high", async () => {
      await catalogPage.sortBy("Price, low to high");
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });

    test("re-renders grid after sorting by price high to low", async () => {
      await catalogPage.sortBy("Price, high to low");
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });

    test("re-renders grid after sorting by date old to new", async () => {
      await catalogPage.sortBy("Date, old to new");
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });

    test("re-renders grid after sorting by date new to old", async () => {
      await catalogPage.sortBy("Date, new to old");
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });
  });

  // ── Filters ────────────────────────────────────────────────────────────────

  test.describe("Filters", () => {
    test("filter drawer opens when clicking Filter button", async () => {
      await catalogPage.openFilterDrawer();
      await expect(catalogPage.filterDrawer).toBeVisible();
    });

    test("filter drawer displays Availability and Price sections", async () => {
      await catalogPage.openFilterDrawer();
      await expect(catalogPage.availabilitySection).toHaveText(/Availability/);
      await expect(catalogPage.priceSection).toHaveText(/Price/);
    });

    test("filter drawer closes when clicking X button", async () => {
      await catalogPage.openFilterDrawer();
      await catalogPage.closeFilterDrawer();
      await expect(catalogPage.filterDrawer).not.toHaveAttribute("open");
    });

    test("Availability sub-panel shows In stock (10) and Out of stock (3)", async () => {
      await catalogPage.openFilterDrawer();
      await catalogPage.openAvailabilityFilter();
      await expect(catalogPage.inStockCheckbox).toBeVisible();
      await expect(catalogPage.outOfStockCheckbox).toBeVisible();
    });

    test("Price sub-panel shows highest price of $2,629.95", async () => {
      await catalogPage.openFilterDrawer();
      await catalogPage.openPriceFilter();
      await expect(catalogPage.priceMaxLabel).toContainText("$2,629.95");
    });

    test("filtering by In stock shows 10 products", async () => {
      await catalogPage.filterByInStock();
      const count = await catalogPage.getProductCount();
      expect(count).toContain("10");
    });

    test("filtering by Out of stock shows 3 products", async () => {
      await catalogPage.filterByOutOfStock();
      const count = await catalogPage.getProductCount();
      expect(count).toContain("3");
    });

    test("filtering by price range $0-$9.99 shows products including Selling Plans Ski Wax", async () => {
      await catalogPage.filterByPriceRange(0, 9.99);
      const count = await catalogPage.getProductCount();
      expect(count).toContain("1");
      const names = await catalogPage.getAllProductNames();
      expect(names).toContain("Selling Plans Ski Wax");
    });

    test("active filter pill appears after applying availability filter", async () => {
      await catalogPage.filterByInStock();
      const pills = await catalogPage.getActiveFilterLabels();
      expect(pills.some((p) => p.includes("In stock"))).toBe(true);
    });

    test("active filter pill appears after applying price filter", async () => {
      await catalogPage.filterByPriceRange(0, 10);
      const pills = await catalogPage.getActiveFilterLabels();
      expect(pills.some((p) => p.includes("$0") || p.includes("10"))).toBe(
        true,
      );
    });

    test("Remove all clears all active filters and restores 13 products", async () => {
      await catalogPage.filterByInStock();
      await catalogPage.removeAllFilters();
      const count = await catalogPage.getProductCount();
      expect(count).toBe("13 products");
    });
  });
});
