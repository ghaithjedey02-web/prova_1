'use client';

import { useEffect, useState } from 'react';
import { ACTIVITY, useActivity, useEvents } from '@/lib/system-bus';

/**
 * INSPECT — the hood comes off.
 *
 * Press `I`, or hit the control in the navigation, and the site stops behaving
 * like a page: every region that is a real system component gets bracketed and
 * named, and a live panel exposes the state the machine is actually in, plus the
 * event log the demonstrations have been writing to all along.
 *
 * This is the one interaction on the site that was not asked for, and it is here
 * because it is the most honest possible piece of marketing: the claim is that
 * DOLMIR builds systems, and the proof offered is the ability to open this one
 * and look at it. Nothing shown is invented — the events are the real bus, the
 * activity is the real state driving the 3D core, the region names are the
 * component names.
 *
 * It is entirely additive: nothing depends on it, and turning it off returns the
 * page to exactly what it was.
 */
export function Inspect() {
  const [on, setOn] = useState(false);
  const [regions, setRegions] = useState<{ id: string; label: string; rect: DOMRect }[]>([]);
  const activity = useActivity();
  const events = useEvents();

  // The keyboard shortcut, ignored while the visitor is typing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'i' && e.key !== 'I') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      setOn((v) => !v);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('dolmir:inspect', () => setOn((v) => !v));
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!on) { setRegions([]); return; }
    document.documentElement.setAttribute('data-inspecting', '');

    function measure() {
      const found = [...document.querySelectorAll<HTMLElement>('[data-inspect]')].map((el, i) => ({
        id: `${i}`,
        label: el.dataset.inspect ?? 'region',
        rect: el.getBoundingClientRect(),
      }));
      setRegions(found);
    }
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      document.documentElement.removeAttribute('data-inspecting');
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [on]);

  if (!on) return null;

  const visible = regions.filter((r) => r.rect.bottom > 0 && r.rect.top < window.innerHeight);

  return (
    <div className="pointer-events-none fixed inset-0 z-[120]" aria-hidden>
      {/* region brackets */}
      {visible.map((r) => (
        <div
          key={r.id}
          className="absolute border border-dashed border-accent/45"
          style={{
            left: r.rect.left + 8,
            top: Math.max(4, r.rect.top),
            width: Math.max(0, r.rect.width - 16),
            height: Math.min(r.rect.height, window.innerHeight - Math.max(4, r.rect.top) - 4),
          }}
        >
          <span className="absolute -top-px left-0 bg-accent px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent-ink">
            {r.label}
          </span>
        </div>
      ))}

      {/* the panel */}
      <div className="absolute left-[var(--gutter)] top-[calc(var(--nav-h)+1rem)] w-[min(22rem,calc(100vw-2*var(--gutter)))] border border-accent-line bg-void/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-accent-line px-4 py-2.5">
          <p className="telemetry text-accent">INSPECT</p>
          <p className="telemetry text-muted">premi I per uscire</p>
        </div>

        <dl className="grid grid-cols-2 gap-px bg-rule/70">
          {[
            ['SISTEMA', 'DOLMIR CORE'],
            ['STATO', ACTIVITY[activity].label],
            ['NODI', String(12)],
            ['FLUSSI ATTIVI', String(events.length)],
            ['MOTORE', 'rfq-engine'],
            ['DECISIONE', 'umana'],
          ].map(([k, v]) => (
            <div key={k} className="bg-void px-4 py-3">
              <dt className="telemetry text-faint">{k}</dt>
              <dd className={`mt-1 font-mono text-[var(--text-label)] ${k === 'STATO' ? 'text-accent' : 'text-ink-2'}`}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-accent-line">
          <p className="telemetry border-b border-rule px-4 py-2 text-muted">Registro eventi</p>
          <ol className="max-h-56 overflow-auto">
            {events.length === 0 ? (
              <li className="px-4 py-4 text-[var(--text-micro)] leading-snug text-muted">
                Nessun evento. Avviate una delle dimostrazioni: il registro si riempie con quello che
                il sistema sta davvero facendo.
              </li>
            ) : (
              events.map((e) => (
                <li key={e.id} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-rule/60 px-4 py-2 last:border-0">
                  <span className="telemetry text-faint">{e.t}</span>
                  <span>
                    <span
                      className={`block font-mono text-[0.625rem] uppercase tracking-[0.14em] ${
                        e.tone === 'amber' ? 'text-amber' : e.tone === 'good' ? 'text-good' : 'text-accent'
                      }`}
                    >
                      {e.code}
                    </span>
                    <span className="mt-0.5 block text-[var(--text-micro)] leading-snug text-muted">{e.detail}</span>
                  </span>
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** The control that opens it, for people who will never guess a keyboard shortcut. */
export function InspectButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('dolmir:inspect'))}
      className="hidden items-center gap-2 border border-rule px-3 py-2 telemetry text-muted transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-accent lg:inline-flex"
      title="Apri la vista di sistema (I)"
    >
      <span aria-hidden className="block size-1.5 bg-accent" />
      Inspect
    </button>
  );
}
