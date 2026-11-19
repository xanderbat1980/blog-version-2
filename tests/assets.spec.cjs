const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const pages = fs.readdirSync(path.join(__dirname, '..')).filter(name => name.endsWith('.html'));

test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('all live local image, font, stylesheet and script requests succeed on every page', async ({ page }) => {
  test.setTimeout(180000);
  const failures = [];
  const requestedPaths = new Set();
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.hostname !== '127.0.0.1') return;
    requestedPaths.add(decodeURIComponent(url.pathname));
    if (response.status() >= 400 && ['image', 'stylesheet', 'font', 'script'].includes(response.request().resourceType())) {
      failures.push({ url: response.url(), status: response.status() });
    }
  });
  for (const file of pages) {
    const response = await page.goto(encodeURIComponent(file), { waitUntil: 'domcontentloaded' });
    expect(response.status(), file).toBe(200);
    // Force lazy images to load, including those far below the viewport.
    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout: 10000 });
    const badImages = await page.locator('img').evaluateAll(images => images.filter(image => !image.getAttribute('src') || !image.naturalWidth).map(image => image.outerHTML));
    expect(badImages, file).toEqual([]);
  }
  expect(failures).toEqual([]);
  const unresolved = JSON.parse(fs.readFileSync('docs/missing-assets.json', 'utf8'));
  for (const originalPath of Object.keys(unresolved)) {
    expect(requestedPaths.has('/blog-version-2/' + originalPath), originalPath).toBe(false);
  }
  expect(requestedPaths.has('/blog-version-2/background.jpg')).toBe(false);
});

test('historical article10 is reachable, preserved as a draft and excluded from the sitemap', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.card-body a[href="article10.html"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Marvel VS DC Comics');
  await expect(page.locator('main > [data-restored-draft]')).toContainText('Révision de l’auteur nécessaire');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  const thumbnail = page.locator('img[src="./Assets/article12/marvelVsDccomics.jpg"]');
  expect(await thumbnail.evaluate(image => image.naturalWidth)).toBe(1920);
  expect(fs.readFileSync('sitemap.xml', 'utf8')).not.toContain('article10.html');
  await page.goto('search.html?q=marvel');
  await expect(page.locator('#search-results li:visible')).toHaveCount(1);
  await expect(page.locator('#search-results li:visible')).toContainText('brouillon historique');
  await page.goto('aVif.html');
  await expect(page.locator('[data-unavailable-unspecified]')).toHaveAccessibleName('Image non renseignée dans le document original');
  expect(await page.locator('img').evaluateAll(images => images.some(image => !image.getAttribute('src')))).toBe(false);
});
