/**
 * The system as a schematic.
 *
 * Reduced motion, no JavaScript, or first paint. It is the same machine — core,
 * shell, orbital rings, eight connected modules, an information field — drawn
 * the way it would appear on a system diagram.
 */
export function SystemStatic({ className = '' }: { className?: string }) {
  const modules = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * 128, y: Math.sin(a) * 128, i };
  });

  return (
    <svg viewBox="-190 -190 380 380" className={className} role="img" aria-label="Schema del sistema DOLMIR: nucleo di elaborazione, moduli collegati e campo informativo.">
      <g fill="none" stroke="var(--c-rule-strong)" strokeWidth="0.7">
        <ellipse rx="150" ry="52" />
        <ellipse rx="118" ry="41" transform="rotate(30)" />
        <ellipse rx="92" ry="32" transform="rotate(-25)" />
      </g>

      {modules.map((m) => (
        <g key={m.i}>
          <line x1="0" y1="0" x2={m.x} y2={m.y} stroke="var(--c-accent)" strokeWidth="0.6" opacity="0.5" />
          <rect x={m.x - 7} y={m.y - 7} width="14" height="14" fill="none" stroke="var(--c-ink-2)" strokeWidth="1" />
        </g>
      ))}

      <g fill="none" stroke="var(--c-accent)" strokeWidth="1">
        <polygon points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" opacity="0.7" />
        <circle r="22" opacity="0.9" />
        <circle r="9" fill="var(--c-accent)" opacity="0.35" stroke="none" />
      </g>

      <g fontFamily="var(--font-mono)" fontSize="7" fill="var(--c-muted)" letterSpacing="0.14em">
        <text x="-186" y="-172">SYS.ID 00482</text>
        <text x="-186" y="182">DOLMIR · CORE</text>
      </g>
    </svg>
  );
}
