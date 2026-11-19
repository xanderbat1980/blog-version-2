const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

for (const width of [390, 1440]) {
  test(`Anonymous actually appears, fades and disappears at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    // Observe from the actual animation start, before navigation/layout work can
    // delay the test runner's first assertion on a busy mobile render.
    await page.addInitScript(() => {
      window.introOpacitySamples = [];
      let started = false;
      const observer = new MutationObserver(() => {
        const layer = document.querySelector('#loader.intro-running');
        if (!layer || started) return;
        started = true;
        const sample = () => {
          if (!layer.isConnected) {
            clearInterval(timer);
            observer.disconnect();
            return;
          }
          window.introOpacitySamples.push(Number(getComputedStyle(layer).opacity));
        };
        sample();
        const timer = setInterval(sample, 100);
      });
      observer.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    });
    await page.goto('index.html', { waitUntil: 'domcontentloaded' });
    const opening = page.locator('#loader');
    await expect(opening).toBeVisible();
    expect(await opening.locator('img').evaluate(image => image.naturalWidth)).toBe(800);
    expect(await page.evaluate(() => window.introOpacitySamples[0])).toBeGreaterThan(0.95);
    await expect.poll(() => opening.evaluate(element => Number(getComputedStyle(element).opacity)), { intervals: [100] }).toBeLessThan(0.7);
    const intermediate = await opening.evaluate(element => Number(getComputedStyle(element).opacity));
    expect(intermediate).toBeGreaterThan(0.05);
    const screenshot = testInfo.outputPath('anonymous-mid-fade.png');
    await page.screenshot({ path: screenshot });
    await testInfo.attach('Actual intermediate fade frame', { path: screenshot, contentType: 'image/png' });
    await expect(opening).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('#loader'))).toBeNull();
  });
}

test('both original opening pages have a skippable animation; articles do not acquire one', async ({ page }) => {
  for (const file of ['index.html', 'article5.html']) {
    await page.goto(file);
    await page.getByRole('button', { name: 'Passer l’animation', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#loader')).toHaveCount(0);
    await expect(page.locator('main')).toBeFocused();
  }
  await page.goto('article8.html');
  await expect(page.locator('#loader')).toHaveCount(0);
});

test('reduced motion bypasses the opening, including a preference changed during it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('index.html');
  await expect(page.locator('#loader')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('#loader')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#loader')).toHaveCount(0);
});

test('missing opening image or missing script never hides site content', async ({ page }) => {
  await page.route('**/Assets/intro/anonymous.gif', route => route.abort());
  await page.goto('index.html');
  await expect(page.locator('#loader')).toHaveCount(0);
  await expect(page.locator('main')).toBeVisible();
  await page.unroute('**/Assets/intro/anonymous.gif');
  await page.route('**/varLoader.js', route => route.abort());
  await page.reload();
  await expect(page.locator('#loader')).toBeHidden();
  await expect(page.locator('main')).toBeVisible();
});

test('original palette, fonts and visual assets are preserved locally', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('index.html');
  const theme = await page.evaluate(async () => {
    await document.fonts.ready;
    const css = getComputedStyle(document.documentElement);
    return {
      pink: css.getPropertyValue('--primary-color').trim(),
      grey: css.getPropertyValue('--secondary').trim(),
      turquoise: css.getPropertyValue('--secondary-color').trim(),
      loadedFamilies: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family.replaceAll('"', ''))
    };
  });
  expect(theme.pink).toBe('#f15bb5');
  expect(theme.grey).toBe('#adb5bd');
  expect(theme.turquoise).toBe('#2ec4b6');
  for (const family of ['Roboto', 'DM Sans', 'Poppins']) expect(theme.loadedFamilies).toContain(family);
  expect(await page.locator('img[src="./Assets/Trump/trump1.jpg"]').evaluate(image => image.naturalWidth)).toBeGreaterThan(1);
  const manifest = JSON.parse(fs.readFileSync('docs/restored-assets.json', 'utf8'));
  expect(manifest.reference_commit).toBe('20ccee967261fb92f374ad68cdfafa06427c912f');
});
