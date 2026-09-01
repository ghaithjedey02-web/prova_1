'use client';

import { useState } from 'react';
import { contatto } from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error';
type Area = (typeof contatto.areas)[number];

/**
 * Contact form.
 *
 * The frontend is complete and validated. The submit handler posts to
 * `/api/contatto`, which currently returns 501 and logs nothing — see the route
 * for what needs wiring before launch. It is deliberately a real endpoint
 * returning an honest status rather than a form that silently pretends to
 * succeed: a dead form that looks alive is how an outbound campaign fails
 * without anyone noticing for weeks.
 */
export function ContactForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  /* The intake. The form opens by asking what should work better — the way a
     system asks for its input before its parameters — and the rest of the
     fields appear once the visitor has answered. Real radio inputs underneath,
     so keyboard and screen readers get a standard control. */
  const [area, setArea] = useState<Area | null>(null);
  const [settore, setSettore] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/contatto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setMessage(body.message ?? 'Invio non riuscito.');
        setState('error');
        return;
      }
      setState('sent');
    } catch {
      setMessage('Invio non riuscito. Riprovate o scriveteci per email.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="panel p-10" role="status">
        <p className="label text-good">Ricevuto</p>
        <p className="mt-4 font-display text-[length:var(--text-display-s)] leading-tight text-ink">
          Grazie. Rispondiamo entro un giorno lavorativo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel p-7 md:p-10" noValidate={false}>
      <fieldset>
        <legend className="label">Cosa volete far funzionare meglio?</legend>
        <div role="presentation" className="mt-5 grid gap-2 sm:grid-cols-2">
          {contatto.areas.map((a) => {
            const on = area?.k === a.k;
            return (
              <label
                key={a.k}
                className={`cursor-pointer border px-4 py-3 transition-colors duration-[var(--duration-fast)] ${
                  on
                    ? 'border-accent bg-accent-soft'
                    : 'border-rule bg-void hover:border-rule-strong'
                } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent`}
              >
                <input
                  type="radio"
                  name="area"
                  value={a.k}
                  required
                  checked={on}
                  onChange={() => setArea(a)}
                  className="sr-only"
                />
                <span className={`telemetry block ${on ? 'text-accent' : 'text-ink-2'}`}>
                  {on ? '■ ' : ''}{a.label}
                </span>
              </label>
            );
          })}
        </div>
        {area && (
          <p key={area.k} className="settle mt-4 border-l-2 border-accent pl-4 text-[length:var(--text-micro)] leading-relaxed text-muted">
            <span className="telemetry mr-2 text-accent">CANALE APERTO</span>
            {area.d}
          </p>
        )}
      </fieldset>

      {/* Step 2 — the sector, so the guided analysis speaks their language.
          Optional: skipping it never blocks anything. */}
      {area && (
        <fieldset className="settle mt-7">
          <legend className="label">In che settore lavorate? <span className="text-faint">(facoltativo)</span></legend>
          <div role="presentation" className="mt-4 flex flex-wrap gap-2">
            {contatto.settori.map((sc) => (
              <label
                key={sc}
                className={`cursor-pointer border px-3.5 py-2 telemetry transition-colors duration-[var(--duration-fast)] ${
                  settore === sc ? 'border-accent bg-accent-soft text-accent' : 'border-rule bg-void text-muted hover:border-rule-strong'
                } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent`}
              >
                <input
                  type="radio"
                  name="settore"
                  value={sc}
                  checked={settore === sc}
                  onChange={() => setSettore(sc)}
                  className="sr-only"
                />
                {sc}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* The guided analysis: the honest version of an "AI analysis" — a
          rule-based starting map, declared as such. The system that does not
          guess does not pretend to analyse a company it has never seen. */}
      {area && (
        <div key={`an-${area.k}`} className="settle mt-6 border border-rule bg-void/60 p-5">
          <p className="telemetry text-accent">{contatto.analisiLabel}</p>
          <ol className="mt-3 space-y-2">
            {(contatto.opportunita[area.k] ?? []).map((o, i) => (
              <li key={o} className="flex items-baseline gap-3">
                <span className="telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[length:var(--text-small)] leading-snug text-ink-2">{o}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-rule pt-3 text-[length:var(--text-micro)] leading-relaxed text-muted">
            {contatto.analisiNote}
          </p>
        </div>
      )}

      <div
        className={`flex flex-col gap-5 transition-all duration-[var(--duration-slow)] ease-[var(--ease-mech)] ${
          area
            ? 'visible mt-8 max-h-[80rem] opacity-100'
            : 'invisible pointer-events-none mt-0 max-h-0 overflow-hidden opacity-0'
        }`}
        aria-hidden={!area}
        inert={!area}
      >
        <Field name="azienda" label="Azienda" required autoComplete="organization" />
        <Field name="nome" label="Nome e cognome" required autoComplete="name" />
        <Field name="email" label="Email" type="email" required autoComplete="email" />
        <Field name="telefono" label="Telefono (facoltativo)" type="tel" autoComplete="tel" />

        <div className="flex flex-col gap-2">
          <label htmlFor="processo" className="label">Il processo di cui parlare</label>
          <textarea
            id="processo"
            name="processo"
            rows={5}
            required
            className="border border-border-ui bg-void px-4 py-3.5 text-[length:var(--text-small)] text-ink outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-faint hover:border-rule-strong focus:border-accent"
          />
          <p className="text-[length:var(--text-micro)] text-muted">{contatto.formNote}</p>
        </div>

        <label className="flex items-start gap-3 text-[length:var(--text-micro)] leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consenso"
            required
            className="mt-0.5 size-4 shrink-0 accent-[var(--c-accent)]"
          />
          <span>
            Acconsento al trattamento dei dati per ricevere una risposta, secondo la{' '}
            <a href="/legale/privacy" className="text-accent underline underline-offset-2">privacy policy</a>.
          </span>
        </label>

        {state === 'error' && (
          <p role="alert" className="border-l-2 border-bad bg-bad-soft px-4 py-3.5 text-[length:var(--text-small)] text-bad">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'sending'}
          className="mt-2 bg-accent px-7 py-4 text-[length:var(--text-small)] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover disabled:opacity-60"
        >
          {state === 'sending' ? 'Invio…' : 'Invia'}
        </button>

        <p className="text-[length:var(--text-micro)] text-muted">{contatto.privacy}</p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="border border-border-ui bg-void px-4 py-3.5 text-[length:var(--text-small)] text-ink outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-faint hover:border-rule-strong focus:border-accent"
      />
    </div>
  );
}
