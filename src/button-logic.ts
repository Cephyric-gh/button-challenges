/**
 * Pure button challenge math (browser; imported by the Vite UI).
 */

import { ButtonTasks, type ButtonTaskRow } from './challenges';

export type { ButtonTaskRow };
export { ButtonTasks };

/** CustomLists.h.Research[39] — 100-entry cycle order (raw.js Ua.Research). */
export const BUTTON_TASK_CYCLE: readonly number[] =
  '42 89 15 63 28 91 3 76 54 11 68 24 95 37 80 1 59 22 73 14 66 9 83 31 47 70 5 98 26 61 18 85 34 72 0 56 13 92 40 77 21 64 8 99 30 52 17 69 2 88 45 12 79 33 94 6 57 25 81 39 67 4 90 53 19 74 29 87 10 62 36 96 23 58 41 78 16 65 32 84 27 7 71 44 93 20 60 35 82 48 97 38 75 50 86 43 55 49 46 51'
    .split(' ')
    .map((s) => Number(s));

export function buttonTaskIndex(completions: number, numTasks: number): number {
  const slot = Math.round(completions - 100 * Math.floor(completions / 100));
  const raw = BUTTON_TASK_CYCLE[slot];
  return Math.round(raw - numTasks * Math.floor(raw / numTasks));
}

export function buttonRequirement(completions: number, task: ButtonTaskRow): number {
  const base = Number(task[1]);
  const kind = task[2];
  const factor = Number(task[3]);
  const n = completions;

  if (kind === 'linear') {
    return Math.ceil(base + n * factor);
  }
  if (kind === 'step') {
    return Math.ceil(base + n / factor);
  }
  return base * Math.pow(factor, n);
}

export function buttonState(completions: number, tasks: ButtonTaskRow[] = ButtonTasks()) {
  const taskIndex = buttonTaskIndex(completions, tasks.length);
  const task = tasks[taskIndex];
  return {
    completions,
    cycleSlot: completions % 100,
    taskIndex,
    task,
    requirement: buttonRequirement(completions, task),
  };
}

export function previewNext(
  count: number,
  startCompletions = 0,
  tasks: ButtonTaskRow[] = ButtonTasks()
) {
  const rows: ReturnType<typeof buttonState>[] = [];
  for (let i = 0; i < count; i++) {
    rows.push(buttonState(startCompletions + i, tasks));
  }
  return rows;
}

export type PreviewRow = ReturnType<typeof previewNext>[number];

/** Smallest integer ≥ n (for display; exponent tasks can be fractional in raw math). */
export function ceilRequirement(n: number): number {
  if (!Number.isFinite(n)) return n;
  return Math.ceil(n);
}

/**
 * Suffix at index i covers mantissa × 10^(3(i+1)) … next tier (K…T…Q…QQ…QQQ).
 * Past QQQ (≥10²⁴) short format uses scientific notation.
 */
const NUMBER_SUFFIXES = ['K', 'M', 'B', 'T', 'Q', 'QQ', 'QQQ'] as const;

/** Ceil then full grouped integer (commas). Very large → scientific. */
export function formatRequirementFull(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const c = ceilRequirement(n);
  if (!Number.isFinite(c)) return String(c);
  const abs = Math.abs(c);
  if (abs >= 1e18) return c.toExponential(4);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(c);
}

/** Ceil then short form: 123K … 1QQQ, then scientific (e.g. 1.2345e+87). */
export function formatRequirementShort(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const c = ceilRequirement(n);
  if (!Number.isFinite(c)) return String(c);
  const sign = c < 0 ? '-' : '';
  const v = Math.abs(c);
  if (v < 1000) return sign + String(v);

  const log3 = Math.floor(Math.log10(v) / 3);
  const suffixIdx = log3 - 1;

  if (suffixIdx >= NUMBER_SUFFIXES.length) {
    return sign + v.toExponential(4);
  }

  const divisor = 10 ** (log3 * 3);
  const coef = v / divisor;
  const coefStr = Math.max(1, Math.min(999, Math.floor(coef))).toString();
  return sign + coefStr + NUMBER_SUFFIXES[suffixIdx];
}

export type RequirementGrowthKind = 'linear' | 'step' | 'exponent';

/** Short string for UI; `title` is full formatted value when it differs from short (all growth kinds). */
export function formatRequirementDisplay(
  n: number,
  _growthKind: string
): { short: string; title: string | undefined } {
  const short = formatRequirementShort(n);
  const full = formatRequirementFull(n);
  return { short, title: full !== short ? full : undefined };
}

/** @deprecated Use formatRequirementFull or formatRequirementShort */
export function formatRequirement(n: number): string {
  return formatRequirementFull(n);
}

function normalizeChallengeTemplate(template: string): string {
  return template.replaceAll('_', ' ');
}

/** Underscores → spaces; each `{` → short formatted requirement (K…QQQ / scientific). */
export function formatChallengeDescription(template: string, requirement: number): string {
  const req = formatRequirementShort(requirement);
  return normalizeChallengeTemplate(template).replaceAll('{', req);
}

export type ChallengeDescriptionPart =
  | { kind: 'text'; text: string }
  | { kind: 'requirement'; short: string; title: string | undefined };

/**
 * Template with `{` placeholders split into text + requirement segments for rich UI
 * (short display, full value on hover when it differs).
 */
export function challengeDescriptionParts(
  template: string,
  requirement: number,
  growthKind: string
): ChallengeDescriptionPart[] {
  const normalized = normalizeChallengeTemplate(template);
  const segments = normalized.split('{');
  const { short, title } = formatRequirementDisplay(requirement, growthKind);
  const parts: ChallengeDescriptionPart[] = [];
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].length > 0) {
      parts.push({ kind: 'text', text: segments[i] });
    }
    if (i < segments.length - 1) {
      parts.push({ kind: 'requirement', short, title });
    }
  }
  return parts;
}
