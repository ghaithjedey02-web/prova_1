import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('.qa', { recursive: true });
const errors = [];
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-fake-ui-for-media-stream'],
});
const watch = (p, t) => { p.on('console', m => m.type() === 'error' && errors.push(`[${t}] ${m.text()}`)); p.on('pageerror', e => errors.push(`[${t}] PAGEERR ${e.message}`)); };

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'desktop');
  await page.goto('http://localhost:3820/', { waitUntil: 'networkidle' });
  const sec = page.locator('#parla');
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: '.qa/50-parla-idle.png' });
  console.log('console header:', await sec.getByText('DOLMIR INTELLIGENCE').first().isVisible());
  console.log('online:', await sec.getByText('SYSTEM ONLINE').isVisible());
  console.log('mic visible:', await sec.getByRole('button', { name: /PARLA CON DOLMIR/ }).isVisible());

  // suggested question → amber conflicts
  await sec.getByRole('button', { name: 'Perché ti sei fermato?' }).click();
  await page.waitForTimeout(2600);
  await page.screenshot({ path: '.qa/51-parla-fermato.png' });
  console.log('reply present:', await sec.getByText('58,4%').first().isVisible());
  console.log('conflict chips:', await sec.locator('li.border-amber\\/40, li[class*="border-amber"]').count());

  // typed free text matching an intent
  await sec.getByLabel('Scrivi a DOLMIR').fill('chi decide alla fine?');
  await sec.getByRole('button', { name: 'INVIA' }).click();
  await page.waitForTimeout(2000);
  console.log('chi-decide reply:', await sec.getByText('cancello umano').isVisible());

  // typed off-set text → honest fallback
  await sec.getByLabel('Scrivi a DOLMIR').fill('quanto costa un abbonamento?');
  await sec.getByRole('button', { name: 'INVIA' }).click();
  await page.waitForTimeout(1400);
  console.log('fallback honest:', await sec.getByText('predefinite sul funzionamento').isVisible());
  await page.screenshot({ path: '.qa/52-parla-fallback.png' });

  // link intent
  await sec.getByRole('button', { name: 'Fammi vedere un caso difficile.' }).click();
  await page.waitForTimeout(2400);
  console.log('link chip:', await sec.getByRole('link', { name: 'APRI IL SIMULATORE →' }).isVisible());

  // chapter numbers after renumber
  for (const [n, label] of [['03','Parla con DOLMIR'],['04','Trasformazione'],['06','Il livello intelligente'],['08',''],['11','Controllo']]) {
    if (!label) continue;
    const found = await page.locator('p.chapter', { hasText: label }).first().innerText().catch(() => 'MISS');
    console.log('chapter', n, '→', found.replace(/\s+/g, ' ').slice(0, 40));
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('1440 overflow:', overflow);
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  watch(page, 'm390');
  await page.goto('http://localhost:3820/', { waitUntil: 'networkidle' });
  const sec = page.locator('#parla');
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.qa/53-parla-390.png' });
  const micBb = await sec.getByRole('button', { name: /PARLA CON DOLMIR|Interrompi/ }).boundingBox();
  console.log('390 mic size:', micBb && `${Math.round(micBb.width)}x${Math.round(micBb.height)}`);
  await sec.getByRole('button', { name: 'Fammi vedere come funziona.' }).tap();
  await page.waitForTimeout(4200);
  await page.screenshot({ path: '.qa/54-parla-390-reply.png' });
  console.log('390 reply:', await sec.getByText('fonte attaccata').first().isVisible());
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('390 overflow:', overflow);
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  watch(page, 'reduced');
  await page.goto('http://localhost:3820/', { waitUntil: 'networkidle' });
  const sec = page.locator('#parla');
  await sec.scrollIntoViewIfNeeded();
  await sec.getByRole('button', { name: 'Cosa non fai?' }).click();
  await page.waitForTimeout(900);
  console.log('reduced instant reply:', await sec.getByText('Non indovino').isVisible());
  await page.close();
}

await browser.close();
console.log('console errors:', errors.length ? errors : 'none');
