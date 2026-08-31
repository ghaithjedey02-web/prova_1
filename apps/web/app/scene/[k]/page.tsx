import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SceneShell } from './SceneShell';

/**
 * /scene/[k] — capture stages for advertising and film.
 *
 * The site's own experiences ARE the footage: these routes render one
 * experience at a time with the chrome stripped (no nav, no footer, no
 * readout), so a screen recorder pointed at the viewport gets a clean master
 * for Reels, ads, or the intro film. Never linked from navigation, never
 * indexed. The recipes live in docs/brand/AD-SCENES.md.
 */

const SCENES = ['intelligenza', 'trasformazione', 'demo', 'materia'] as const;
type SceneKey = (typeof SCENES)[number];

export function generateStaticParams() {
  return SCENES.map((k) => ({ k }));
}

export const metadata: Metadata = {
  title: 'Scene',
  robots: { index: false, follow: false },
};

export default async function ScenePage({ params }: { params: Promise<{ k: string }> }) {
  const { k } = await params;
  if (!SCENES.includes(k as SceneKey)) notFound();
  return <SceneShell k={k as SceneKey} />;
}
