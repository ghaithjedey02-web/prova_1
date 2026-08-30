import { stations } from './stations';

/**
 * The Line with motion removed. Not a placeholder: the same six stations as a
 * flat schematic, which is how it would appear on a drawing sheet.
 */
export function LineStatic() {
  return (
    <ol className="stack-rules border border-rule bg-surface">
      {stations.map((s) => (
        <li key={s.k} className="grid gap-3 p-6 sm:grid-cols-[auto_9rem_1fr] sm:items-baseline sm:gap-6">
          <span className="font-mono text-[var(--text-label)] tnum text-accent">{s.k}</span>
          <span className={`subhead text-[1.15rem] ${s.kind === 'gate' ? 'text-amber' : 'text-ink'}`}>{s.t}</span>
          <span className="text-[var(--text-small)] leading-relaxed text-muted">{s.d}</span>
        </li>
      ))}
    </ol>
  );
}
