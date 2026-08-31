'use client';

import { useEffect } from 'react';
import { Intelligence } from '@/components/live/Intelligence';
import { Twin } from '@/components/live/Twin';
import { Simulator } from '@/components/live/Simulator';
import { Materia } from '@/components/live/Materia';
import { SystemFilm } from '@/components/live/SystemFilm';

/** Marks the document as a capture stage — the chrome hides itself via CSS. */
export function SceneShell({ k }: { k: 'intelligenza' | 'trasformazione' | 'demo' | 'materia' | 'film' }) {
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
      {k === 'film' && (
        <div className="mx-auto flex min-h-screen max-w-[70rem] items-center px-4">
          <div className="w-full"><SystemFilm autoStart /></div>
        </div>
      )}
    </div>
  );
}
