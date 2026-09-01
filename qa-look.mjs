import { chromium } from 'playwright';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const B = process.env.QA_BASE ?? 'http://localhost:3930';
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.screenshot({ path: '.qa/home-1.png' });
for (let i = 1; i <= 6; i++) {
  await p.evaluate(() => window.scrollBy(0, window.innerHeight * 0.92));
  await p.waitForTimeout(700);
  await p.screenshot({ path: `.qa/home-${i + 1}.png` });
}
const h = await p.evaluate(() => document.body.scrollHeight / window.innerHeight);
console.log('page height in viewports:', h.toFixed(1));
await b.close();
