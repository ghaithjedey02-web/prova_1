import { chromium } from 'playwright';

const B = process.env.QA_BASE ?? 'http://localhost:3940';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const IGNORE = /cloudfront|dolmir-film|Failed to load resource|status of 503|Unexpected token/;
const ROUTES = ['/', '/soluzioni', '/metodo', '/dimostrazione', '/studio', '/affidabilita', '/contatto',
  '/legale/privacy', '/legale/cookie', '/legale/termini'];
const SIZES = [320, 390, 768, 1024, 1440, 1920, 2560, 3440];

let fails = 0;
const ok = (c, m) => { if (!c) fails++; console.log((c ? 'PASS' : 'FAIL') + ' ' + m); };

const browser = await chromium.launch({ executablePath: exe });

/* ---------------- contrast: measure every text node against its ground ---- */
const CONTRAST = `(() => {
  const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  const lum = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
  const parse = s => (s.match(/[\\d.]+/g) || []).slice(0,3).map(Number);
  const bgOf = el => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const p = parse(bg);
      const a = (bg.match(/[\\d.]+/g) || [])[3];
      if (p.length === 3 && (a === undefined || Number(a) > 0.85)) return p;
      n = n.parentElement;
    }
    return [8,9,11];
  };
  const bad = [];
  for (const el of document.querySelectorAll('p,span,a,li,dt,dd,h1,h2,h3,h4,button,label,input')) {
    const txt = (el.textContent || '').trim();
    if (!txt || txt.length < 3) continue;
    if (el.children.length && ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.35) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fg = parse(cs.color);
    if (fg.length !== 3) continue;
    const L1 = lum(fg), L2 = lum(bgOf(el));
    const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const px = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const need = (px >= 24 || (px >= 18.66 && bold)) ? 3.0 : 4.5;
    if (ratio < need) bad.push({ t: txt.slice(0,40), ratio: +ratio.toFixed(2), need, px: +px.toFixed(1) });
  }
  return bad.slice(0, 8);
})()`;

/* ---------------------------------------- every route at desktop + phone -- */
for (const route of ROUTES) {
  for (const w of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.test(m.text())) errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(B + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    for (let i = 0; i < 6; i++) { await page.evaluate(() => window.scrollBy(0, window.innerHeight)); await page.waitForTimeout(180); }

    const overX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(overX === 0, `${route} @${w}: no horizontal overflow (${overX})`);

    const bad = await page.evaluate(CONTRAST);
    ok(bad.length === 0, `${route} @${w}: contrast${bad.length ? ' -> ' + JSON.stringify(bad[0]) : ''}`);

    ok(errs.length === 0, `${route} @${w}: console clean${errs.length ? ' -> ' + errs[0].slice(0, 80) : ''}`);
    await page.close();
  }
}

/* --------------------------------------------- homepage at every width ---- */
for (const w of SIZES) {
  const page = await browser.newPage({ viewport: { width: w, height: Math.max(720, Math.round(w * 0.5)) } });
  await page.goto(B + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, window.innerHeight)); await page.waitForTimeout(160); }
  const overX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(overX === 0, `home @${w}: no horizontal overflow (${overX})`);
  await page.screenshot({ path: `.qa/w-${w}.png` });
  await page.close();
}

/* ------------------------------------------------------- accessibility ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(B + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const a11y = await page.evaluate(() => {
    const out = {};
    out.h1 = document.querySelectorAll('h1').length;
    out.imgNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
    out.btnNoName = [...document.querySelectorAll('button')].filter(
      (b) => !(b.textContent || '').trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'),
    ).length;
    out.linkNoName = [...document.querySelectorAll('a')].filter(
      (a) => !(a.textContent || '').trim() && !a.getAttribute('aria-label'),
    ).length;
    out.inputNoLabel = [...document.querySelectorAll('input,textarea,select')].filter(
      (i) => !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') &&
             !(i.id && document.querySelector(`label[for="${i.id}"]`)),
    ).length;
    // heading order
    const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]));
    let jump = 0;
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jump++;
    out.headingJumps = jump;
    return out;
  });
  ok(a11y.h1 === 1, `a11y: exactly one h1 (${a11y.h1})`);
  ok(a11y.imgNoAlt === 0, `a11y: every img has alt (${a11y.imgNoAlt} missing)`);
  ok(a11y.btnNoName === 0, `a11y: every button has an accessible name (${a11y.btnNoName} missing)`);
  ok(a11y.linkNoName === 0, `a11y: every link has an accessible name (${a11y.linkNoName} missing)`);
  ok(a11y.inputNoLabel === 0, `a11y: every field is labelled (${a11y.inputNoLabel} missing)`);
  ok(a11y.headingJumps === 0, `a11y: no heading-level jumps (${a11y.headingJumps})`);

  // keyboard: tab reaches the console field, focus is visible
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 30));
  ok(Boolean(firstFocus), `a11y: first Tab lands somewhere (${firstFocus})`);
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = el ? getComputedStyle(el) : null;
    return cs ? cs.outlineWidth : '0px';
  });
  ok(outline !== '0px', `a11y: focus ring is visible (${outline})`);
  await page.close();
}

/* --------------------------------------------------- no legacy artifacts -- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ROUTES) {
    await page.goto(B + route, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    ok(!/wordpress|kadence|wp-content|wp-includes/i.test(html), `${route}: no WordPress/Kadence artifacts`);
  }
  await page.close();
}

await browser.close();
console.log(fails === 0 ? '\nSPRINT QA: ALL PASS' : `\nSPRINT QA: ${fails} FAILURES`);
