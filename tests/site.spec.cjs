const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const pages = fs.readdirSync(path.join(__dirname, '..')).filter(file => file.endsWith('.html')).sort();

test.beforeEach(async ({ context }) => {
  // External content must not be necessary for local navigation, layout or scripts.
  await context.route('**/*', route => {
    if (new URL(route.request().url()).hostname === '127.0.0.1') return route.continue();
    return route.abort();
  });
});

for (const width of [390, 768, 1440]) {
  test(`all pages render at ${width}px without overflow or JS errors`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const file of pages) {
      await page.goto(encodeURIComponent(file));
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    expect(errors).toEqual([]);
  });
}

test('mobile menu uses keyboard, closes with Escape, and survives resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('index.html');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await expect(toggle).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeHidden();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
});

test('navigation and articles are usable with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await context.route('**/*', r => new URL(r.request().url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#loader')).toHaveCount(0);
  await page.goto(baseURL + 'search.html');
  await expect(page.locator('#search-results li')).toHaveCount(13);
  await context.close();
});

test('search handles accents, URL parameters, empty input and no results', async ({ page }) => {
  await page.goto('search.html?q=cafe');
  const input = page.getByRole('searchbox');
  await expect(page.locator('#search-results li:visible')).toHaveCount(1);
  await expect(page.locator('#search-results li:visible')).toContainText('Café VS Thé');
  await input.fill('CAFÉ');
  await expect(page.locator('#search-results li:visible')).toHaveCount(1);
  await input.press('Enter');
  await expect(page).toHaveURL(/q=CAF/);
  await input.fill('zzzznotfound');
  await expect(page.getByRole('status')).toContainText('Aucun article');
  await input.fill('');
  await expect(page.locator('#search-results li:visible')).toHaveCount(13);
});

test('missing content is explicit and restored images load without changing markup', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('.missing-article-note')).toContainText('article indisponible');
  await expect(page.locator('a[href="article10.html"]')).toHaveCount(0);
  await expect(page.locator('.missing-media').first()).toBeVisible();
  // Simulate a supplied real file to verify the fallback does not permanently hide restored assets.
  await page.route('**/Assets/Trump/trump1.jpg', route => route.fulfill({
    contentType: 'image/png',
    body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9ioAAAAASUVORK5CYII=', 'base64')
  }));
  await page.reload();
  await expect(page.locator('img[src="./Assets/Trump/trump1.jpg"]')).toBeVisible();
  expect(await page.locator('img[src="./Assets/Trump/trump1.jpg"]').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
});

test('carousel works locally, can pause, and respects reduced motion', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('.swiper-initialized')).toHaveCount(1);
  await page.getByRole('button', { name: 'Pause animation', exact: true }).click();
  expect(await page.locator('.swiper-container').evaluate(el => el.swiper.autoplay.running)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  expect(await page.locator('.swiper-container').evaluate(el => el.swiper.autoplay.running)).toBe(false);
});

test('nested missing URLs return the real 404 and keep project links and assets working', async ({ page }) => {
  const response = await page.goto('un-dossier/une-page-absente');
  expect(response.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('a.link_404').evaluate(a => new URL(a.href).pathname)).toBe('/blog-version-2/index.html');
  expect(await page.evaluate(() => [...document.styleSheets].some(s => s.href?.endsWith('/blog-version-2/style.css')))).toBe(true);
  await page.locator('a.link_404').click();
  await expect(page).toHaveURL(/\/blog-version-2\/index.html$/);
});

test('deadline animation can pause and is static with reduced motion', async ({ page }) => {
  await page.goto('deadline.html');
  await page.getByRole('button', { name: 'Pause animation', exact: true }).click();
  await expect(page.locator('#deadline')).toHaveAttribute('data-animation-paused', '');
  expect(await page.locator('#death-group').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.getByRole('button', { name: 'Resume animation', exact: true }).click();
  await expect(page.locator('#deadline')).not.toHaveAttribute('data-animation-paused', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.deadline-control')).toHaveCount(0);
  expect(await page.locator('#death-group').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});

test('all pages have no serious or critical axe accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const violations = [];
  for (const file of pages) {
    await page.goto(encodeURIComponent(file));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    for (const issue of results.violations.filter(v => ['critical', 'serious'].includes(v.impact))) {
      violations.push({ file, id: issue.id, nodes: issue.nodes.map(n => n.target) });
    }
  }
  expect(violations).toEqual([]);
});
