'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';

/** Props any element we render through Reveal must accept. */
type Renderable = ComponentType<
  HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
>;

/**
 * Reveals content once, when it enters the viewport.
 *
 * Deliberately an IntersectionObserver plus a class rather than a motion
 * library: it is a handful of bytes, it degrades to fully-visible content if JS
 * fails, and `prefers-reduced-motion` is handled in CSS where it belongs.
 */
export function Reveal({
  children,
  as = 'div',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const Tag = as as unknown as Renderable;

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
