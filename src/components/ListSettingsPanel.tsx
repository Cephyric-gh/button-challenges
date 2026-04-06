import React from 'react';
import { MAX_LIST_ROWS } from '../constants';

interface Props {
  rowCount: number;
  onRowCountChange: (n: number) => void;
  focusStepRaw: string;
  onFocusStepChange: (v: string) => void;
  parsedFocusStep: number | null;
  onJumpToStep: (step: number) => void;
}

const inputField =
  'w-full min-h-12 rounded-xl border border-border bg-elevated px-4 text-[15px] text-ink shadow-inner shadow-black/20 outline-none transition ' +
  'placeholder:text-ink-faint focus:border-accent/40 focus:ring-2 focus:ring-accent/20';

const labelClass = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted';

export function ListSettingsPanel({
  rowCount,
  onRowCountChange,
  focusStepRaw,
  onFocusStepChange,
  parsedFocusStep,
  onJumpToStep,
}: Props) {
  const inputClass = `mt-1.5 ${inputField}`;

  return (
    <aside className="min-w-0 lg:sticky lg:top-[max(1rem,env(safe-area-inset-top))] lg:z-20 lg:max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top))-max(1rem,env(safe-area-inset-bottom)))] lg:overflow-y-auto lg:overscroll-contain lg:self-start lg:pr-1">
      <section
        className="rounded-2xl border border-border/80 bg-elevated/95 p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-6 lg:bg-elevated/90"
        style={{
          boxShadow: '0 0 0 1px oklch(1 0 0 / 0.04) inset, 0 24px 80px -24px rgba(0,0,0,0.65)',
        }}
      >
        <h2 className="mb-5 text-sm font-semibold text-ink">List settings</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="rowCount" className={labelClass}>
              Max rows
            </label>
            <input
              id="rowCount"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_LIST_ROWS}
              value={rowCount}
              onChange={(e) => {
                const v = Math.floor(Number(e.target.value));
                const next = Number.isFinite(v) ? v : 1;
                onRowCountChange(Math.min(MAX_LIST_ROWS, Math.max(1, next)));
              }}
              className={inputClass}
            />
            <p className="mt-1.5 text-right text-xs leading-relaxed text-ink-faint">
              Maximum {MAX_LIST_ROWS.toLocaleString('en-US')} rows.
            </p>
          </div>
          <div>
            <label htmlFor="focusStep" className={labelClass}>
              Current step
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="focusStep"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 42"
                value={focusStepRaw}
                onChange={(e) => {
                  onFocusStepChange(e.target.value);
                }}
                className={`${inputField} min-w-0 flex-1`}
              />
              <button
                type="button"
                disabled={parsedFocusStep == null}
                aria-label="Jump to this step"
                onClick={() => {
                  if (parsedFocusStep != null) onJumpToStep(parsedFocusStep);
                }}
                className="min-h-12 shrink-0 rounded-xl border border-border bg-canvas/60 px-4 text-sm font-semibold text-ink shadow-inner shadow-black/15 outline-none transition hover:border-accent/35 hover:bg-canvas/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Jump
              </button>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
