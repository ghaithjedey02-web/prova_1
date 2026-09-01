import { chromium } from 'playwright';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto((process.env.QA_BASE ?? 'http://localhost:3940') + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
const out = await p.evaluate(() => {
  const el = [...document.querySelectorAll('a')].find(
    (a) => a.className.includes('inline-flex') && a.className.includes('bg-accent'),
  );
  if (!el) return { error: 'primary button not found' };
  const res = { classes: el.className, computedColor: getComputedStyle(el).color, matched: [] };
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list, layer) => {
      for (const r of list) {
        if (r.cssRules) { walk(r.cssRules, r.name ?? layer); continue; }
        if (!r.selectorText || !r.style?.color) continue;
        try { if (el.matches(r.selectorText)) res.matched.push({ sel: r.selectorText, color: r.style.color, layer: layer ?? '(unlayered)' }); }
        catch { /* bad selector */ }
      }
    };
    walk(sheet.cssRules, null);
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await b.close();
