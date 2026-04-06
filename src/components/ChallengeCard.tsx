import React from 'react';
import {
  challengeDescriptionParts,
  formatRequirementDisplay,
  type PreviewRow,
} from '../button-logic';
import { SCROLL_TOP_PAD } from '../constants';

function kindStyles(kind: string): { pill: string; bar: string } {
  if (kind === 'linear') {
    return {
      pill: 'bg-kind-lin/15 text-kind-lin ring-1 ring-kind-lin/25',
      bar: 'bg-kind-lin',
    };
  }
  if (kind === 'step') {
    return {
      pill: 'bg-kind-step/15 text-kind-step ring-1 ring-kind-step/25',
      bar: 'bg-kind-step',
    };
  }
  return {
    pill: 'bg-kind-exp/15 text-kind-exp ring-1 ring-kind-exp/25',
    bar: 'bg-kind-exp',
  };
}

function descriptionNodes(template: string, requirement: number, growthKind: string) {
  return challengeDescriptionParts(template, requirement, growthKind).map((p, i) =>
    p.kind === 'text' ? (
      <span key={i}>{p.text}</span>
    ) : (
      <span
        key={i}
        title={p.title}
        className="font-mono font-semibold tabular-nums underline decoration-dotted decoration-from-font underline-offset-[3px]"
      >
        {p.short}
      </span>
    )
  );
}

interface Props {
  row: PreviewRow;
  stepNum: number;
  parsedFocusStep: number | null;
}

export function ChallengeCard({ row, stepNum, parsedFocusStep }: Props) {
  const [, , kind] = row.task;
  const { pill, bar } = kindStyles(kind);
  const { short: reqShort, title: reqTitle } = formatRequirementDisplay(row.requirement, kind);
  const completed = parsedFocusStep != null && stepNum < parsedFocusStep;
  const current = parsedFocusStep != null && stepNum === parsedFocusStep;
  const desc = descriptionNodes(row.task[0], row.requirement, kind);

  return (
    <li id={`challenge-step-${String(stepNum)}`} style={{ scrollMarginTop: SCROLL_TOP_PAD }}>
      <article
        className={`group relative overflow-hidden rounded-2xl border transition duration-200 ${
          completed
            ? 'border-border/25 bg-elevated/20 opacity-[0.38]'
            : 'border-border/60 bg-elevated/50 hover:border-border hover:bg-elevated-hover/70'
        } ${current ? 'ring-2 ring-accent/45 ring-offset-2 ring-offset-canvas' : ''}`}
        style={{
          boxShadow: '0 0 0 1px oklch(1 0 0 / 0.03) inset',
        }}
      >
        <div
          className={`absolute bottom-0 left-0 top-0 w-1 ${bar} ${completed ? 'opacity-40' : 'opacity-90'}`}
          aria-hidden
        />
        <div
          className={`relative pr-4 sm:pr-5 ${completed ? 'py-2 pl-4 sm:py-2 sm:pl-4' : 'py-4 pl-5 sm:py-4 sm:pl-6'}`}
        >
          <div
            className={`flex flex-wrap items-center justify-between gap-2 ${completed ? 'mb-0' : 'mb-3 gap-3'}`}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2.5">
              <span
                className={`flex items-center justify-center rounded-lg bg-canvas/80 font-mono font-semibold tabular-nums text-accent ring-1 ring-border/50 ${
                  completed ? 'h-6 min-w-6 px-1.5 text-[11px]' : 'h-8 min-w-8 px-2 text-sm'
                }`}
              >
                {stepNum}
              </span>
              {completed ? (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                  Done
                </span>
              ) : null}
              <span
                className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wide ${pill} ${
                  completed ? 'px-2 py-px text-[9px]' : 'px-2.5 py-0.5 text-[11px]'
                }`}
              >
                {kind}
              </span>
            </div>
            <span
              className={`max-w-full break-all text-right font-mono font-semibold tracking-tight ${
                completed ? 'text-xs text-ink-muted' : 'text-lg sm:text-xl'
              }`}
            >
              <span
                title={reqTitle}
                className={
                  completed
                    ? 'text-ink-muted'
                    : 'inline-block bg-linear-to-br from-ink via-ink to-accent/85 bg-clip-text text-transparent'
                }
              >
                {reqShort}
              </span>
            </span>
          </div>
          <p
            className={
              completed
                ? 'm-0 line-clamp-1 text-xs leading-snug text-ink-faint'
                : 'm-0 text-[14px] leading-relaxed text-ink-muted sm:text-[15px]'
            }
          >
            {desc}
          </p>
        </div>
      </article>
    </li>
  );
}
