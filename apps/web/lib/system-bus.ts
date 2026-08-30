'use client';

import { useEffect, useState } from 'react';

/**
 * The nervous system.
 *
 * The intelligence core in the background is not decoration that happens to sit
 * behind the content: when a visitor runs a demonstration halfway down the page,
 * the core changes state, accelerates and settles. That only works if the
 * demonstrations and the 3D scene share one channel, so this is it.
 *
 * Deliberately ~60 lines and no dependency. A store library would be a heavier
 * answer to a problem that is one variable and a Set of listeners.
 */

export type Activity =
  | 'idle'
  | 'listening'
  | 'analyzing'
  | 'understanding'
  | 'processing'
  | 'verifying'
  | 'holding'
  | 'ready';

/** Human-facing label and the intensity the 3D scene should run at. */
export const ACTIVITY: Record<Activity, { label: string; drive: number }> = {
  idle:          { label: 'IDLE',          drive: 0.0 },
  listening:     { label: 'LISTENING',     drive: 0.25 },
  analyzing:     { label: 'ANALYZING',     drive: 0.7 },
  understanding: { label: 'UNDERSTANDING', drive: 0.85 },
  processing:    { label: 'PROCESSING',    drive: 1.0 },
  verifying:     { label: 'VERIFYING',     drive: 0.6 },
  holding:       { label: 'HOLDING',       drive: 0.1 },
  ready:         { label: 'READY',         drive: 0.35 },
};

export interface SystemEvent {
  id: number;
  t: string;
  code: string;
  detail: string;
  tone?: 'accent' | 'amber' | 'good';
}

let activity: Activity = 'idle';
let events: SystemEvent[] = [];
let seq = 8420;

const activityListeners = new Set<(a: Activity) => void>();
const eventListeners = new Set<(e: SystemEvent[]) => void>();

export function setActivity(next: Activity) {
  if (activity === next) return;
  activity = next;
  activityListeners.forEach((fn) => fn(next));
}

export function getActivity() {
  return activity;
}

/** Push one line onto the system log. Kept to the last 24. */
export function emit(code: string, detail: string, tone?: SystemEvent['tone']) {
  seq += 1;
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds(),
  ).padStart(2, '0')}`;
  events = [{ id: seq, t, code, detail, tone }, ...events].slice(0, 24);
  eventListeners.forEach((fn) => fn(events));
}

export function useActivity() {
  const [a, setA] = useState<Activity>(activity);
  useEffect(() => {
    activityListeners.add(setA);
    setA(activity);
    return () => { activityListeners.delete(setA); };
  }, []);
  return a;
}

export function useEvents() {
  const [e, setE] = useState<SystemEvent[]>(events);
  useEffect(() => {
    eventListeners.add(setE);
    setE(events);
    return () => { eventListeners.delete(setE); };
  }, []);
  return e;
}

/** Read the current drive without subscribing — for the render loop. */
export function activityDrive() {
  return ACTIVITY[activity].drive;
}

/**
 * How strongly the fixed background machine should show through, 0..1.
 *
 * The backdrop normally recedes to atmosphere once the visitor scrolls past the
 * opening. A section whose whole point is the machine itself — the intelligence
 * core — raises this while it is on screen, and the backdrop's render loop
 * reads it every frame without a re-render.
 */
let boost = 0;
export function setBackdropBoost(v: number) { boost = Math.min(1, Math.max(0, v)); }
export function backdropBoost() { return boost; }
