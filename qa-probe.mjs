import { chromium } from 'playwright';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const B = process.env.QA_BASE ?? 'http://localhost:3940';
const b = await chromium.launch({ executablePath: exe });

for (const [w, needle] of [[1440, 'Parla con DOLMIR'], [390, 'INPUT RICEVUTO']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  for (let i = 0; i < 6; i++) { await p.evaluate(() => window.scrollBy(0, window.innerHeight)); await p.waitForTimeout(200); }
  const info = await p.evaluate((n) => {
    const out = [];
    for (const el of document.querySelectorAll('p,span,a,li,dt,dd,h1,h2,h3,h4,button,label,input')) {
      const t = (el.textContent || '').trim();
      if (!t.includes(n)) continue;
      const cs = getComputedStyle(el);
      let bgChain = [];
      let node = el;
      while (node && node !== document.documentElement && bgChain.length < 4) {
        bgChain.push(node.tagName + '.' + (node.className || '').toString().slice(0, 45) + ' => ' + getComputedStyle(node).backgroundColor);
        node = node.parentElement;
      }
      out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 70), color: cs.color, fs: cs.fontSize, op: cs.opacity, text: t.slice(0, 34), bgChain });
    }
    return out;
  }, needle);
  console.log(`\n=== ${w}px :: ${needle} ===`);
  console.log(JSON.stringify(info, null, 1).slice(0, 2600));
  await p.close();
}
await b.close();
