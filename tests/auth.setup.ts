// tests/auth.setup.ts
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Navega a la tienda (usara la baseURL del config)
  await page.goto("/");

  // Ingresa la contraseña en el campo correspondiente
  await page.getByLabel("Enter store password").fill("naicew");
  await page.getByRole("button", { name: "Enter" }).click();

  // Espera a que la autenticacion sea exitosa (ej. que aparezca el logo)
  await page.waitForURL("**/");

  // Guarda el estado de las cookies y storage en un archivo
  await page.context().storageState({ path: authFile });
});
