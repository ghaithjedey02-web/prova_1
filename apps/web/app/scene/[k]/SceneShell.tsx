'use client';

import { useEffect } from 'react';
import { Intelligence } from '@/components/live/Intelligence';
import { Twin } from '@/components/live/Twin';
import { Simulator } from '@/components/live/Simulator';
import { Materia } from '@/components/live/Materia';

/** Marks the document as a capture stage — the chrome hides itself via CSS. */
export function SceneShell({ k }: { k: 'intelligenza' | 'trasformazione' | 'demo' | 'materia' }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-scene', '');
    return () => document.documentElement.removeAttribute('data-scene');
  }, []);

  return (
    <div className="min-h-screen">
      {k === 'intelligenza' && <Intelligence />}
      {k === 'trasformazione' && <Twin />}
      {k === 'demo' && <Simulator />}
      {k === 'materia' && <Materia />}
    </div>
  );
}
