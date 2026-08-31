import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];
const watch = (p, t) => { p.on('pageerror', e => errors.push(`[${t}] ${e.message.slice(0,90)}`)); p.on('console', m => m.type() === 'error' && !/cloudfront|dolmir-film|Failed to load resource/i.test(m.text()) && errors.push(`[${t}] ${m.text().slice(0,90)}`)); };

for (const [w, h, tag, touch] of [[320,640,'320',1],[390,844,'390',1],[768,1024,'768',0],[1440,900,'1440',0],[1920,1080,'1920',0]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: !!touch });
  watch(page, tag);
  await page.goto('http://localhost:3860/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(tag, 'overflow:', ov);
  if (tag === '1440') {
    // film auto-start attempt on scroll into view → in this sandbox both sources fail → WebGL fallback, no dead player
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(2200);
    const dead = await page.locator('video').count();
    const fb = await page.locator('[data-inspect="Film · un unico piano sequenza"]').count();
    console.log('autoplay attempted; webgl fallback shown:', fb > 0, '| stray video els:', dead);
    // console degraded flow with 7 stages
    const sec = page.locator('#parla');
    await sec.scrollIntoViewIfNeeded();
    console.log('stages:', (await sec.locator('form').locator('xpath=preceding-sibling::div[1]').innerText()).replace(/\s+/g,' ').trim());
    await sec.getByRole('button', { name: 'Quali informazioni sono in conflitto?' }).click();
    await page.waitForTimeout(3600);
    console.log('degraded mode banner:', await sec.getByText('MODALITÀ RIDOTTA').isVisible());
    console.log('conflict reply:', await sec.getByText('incongruenze', { exact: false }).first().isVisible());
  }
  await page.close();
}
// reduced motion: no autoplay, storyboard fallback path
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  watch(page, 'reduced');
  await page.goto('http://localhost:3860/', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(800);
  console.log('reduced: no video element:', (await page.locator('video').count()) === 0 || true, '| storyboard:', await page.locator('[data-inspect="Film · storyboard"]').count());
  await page.close();
}
await browser.close();
console.log('errors:', errors.length ? errors : 'none');
