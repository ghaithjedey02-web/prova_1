'use client';

import { useState } from 'react';
import { contatto } from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error';

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
      <div className="border border-rule bg-surface p-8" role="status">
        <p className="label text-good">Ricevuto</p>
        <p className="mt-4 font-display text-[length:var(--text-display-s)] leading-tight text-ink">
          Grazie. Rispondiamo entro un giorno lavorativo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-rule bg-surface p-7 md:p-9" noValidate={false}>
      <div className="flex flex-col gap-5">
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
            className="rounded-sm border border-rule bg-ground px-3.5 py-3 text-[var(--text-small)] text-ink outline-none transition-colors focus:border-accent"
          />
          <p className="text-[var(--text-micro)] text-muted">{contatto.formNote}</p>
        </div>

        <label className="flex items-start gap-3 text-[var(--text-micro)] leading-relaxed text-muted">
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
          <p role="alert" className="border-l-2 border-bad bg-bad-soft px-4 py-3 text-[var(--text-small)] text-bad">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'sending'}
          className="mt-1 rounded-sm bg-accent px-6 py-3.5 text-[var(--text-small)] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover disabled:opacity-60"
        >
          {state === 'sending' ? 'Invio…' : 'Invia'}
        </button>

        <p className="text-[var(--text-micro)] text-muted">{contatto.privacy}</p>
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
        className="rounded-sm border border-rule bg-ground px-3.5 py-3 text-[var(--text-small)] text-ink outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
