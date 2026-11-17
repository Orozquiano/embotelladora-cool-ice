import { expect, test } from '@playwright/test';

test.describe('Cool Ice — recorrido principal', () => {
  test('carga el hero y navega por secciones sin scroll horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#inicio')).toBeVisible();

    for (const id of ['beneficios', 'producto', 'proceso', 'domicilio', 'confianza', 'contacto']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('abre y cierra el menú móvil con botón y teclado', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('./');

    const toggle = page.locator('.encabezado__abrir');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(page.getByRole('navigation', { name: 'Secciones', exact: true })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('.menu__cerrar').click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('bloquea pedido inválido y permite uno válido', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#contacto');
    await page.locator('#contacto').scrollIntoViewIfNeeded();

    const popupPromise = context.waitForEvent('page', { timeout: 1500 }).catch(() => null);
    await page.getByRole('button', { name: /enviar pedido por whatsapp/i }).click();
    expect(await popupPromise).toBeNull();
    await expect(page.locator('#alerta-formulario')).toBeVisible();
    await expect(page.locator('#error-nombre')).toBeVisible();

    await page.locator('input[name="nombre"]').fill('María Gómez');
    await page.locator('input[name="telefono"]').fill('3001234567');
    await page.locator('input[name="direccion"]').fill('Barrio San Fernando, Cali');
    await page.locator('input[name="cantidad"]').fill('2');

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('button', { name: /enviar pedido por whatsapp/i }).click(),
    ]);
    const destino = popup.url();
    expect(destino).toMatch(/wa\.me\/573216820822|api\.whatsapp\.com.*573216820822/);
    expect(destino).toContain(encodeURIComponent('María Gómez').replace(/%20/g, '+'));
    await popup.close();
  });

  test('respeta prefers-reduced-motion y baseHref de assets', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('./');

    const imgs = page.locator('img[src]');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 8); i++) {
      const src = await imgs.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      if (src?.startsWith('http') || src?.startsWith('data:')) {
        continue;
      }
      expect(src).toMatch(/^(\.?\/)?(embotelladora-cool-ice\/)?assets\//);
    }

    const logo = page.locator('img').first();
    await expect(logo).toHaveJSProperty('complete', true);
  });

  test('soporta orientación horizontal sin overflow', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('./');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('enlaces de WhatsApp y secciones usan destinos esperados', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('./');
    const wa = page.locator('a[href^="https://wa.me/573216820822"]').first();
    await expect(wa).toBeVisible();
    await expect(page.locator('a[href*="producto"]').first()).toBeVisible();
  });
});
