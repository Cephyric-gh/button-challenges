import React from 'react';
import { SECONDARY_BTN_CLASS } from '../constants';
import { ChallengeCard } from './ChallengeCard';
import type { PreviewRow } from '../button-logic';

interface ListEntry {
  row: PreviewRow;
  i: number;
  stepNum: number;
}

interface BoundsBannerProps {
  edge: 'earlier' | 'later';
  expanded: boolean;
  hiddenCount: number;
  onShow10: () => void;
  onShowAll: () => void;
  onHide: () => void;
}

function BoundsBanner({
  edge,
  expanded,
  hiddenCount,
  onShow10,
  onShowAll,
  onHide,
}: BoundsBannerProps) {
  const earlier = edge === 'earlier';
  const margin = earlier ? 'mb-4' : 'mt-4';
  const status = expanded
    ? earlier
      ? 'All earlier steps are shown'
      : 'All later steps are shown'
    : `${hiddenCount.toLocaleString('en-US')} ${earlier ? 'earlier' : 'later'} step${hiddenCount === 1 ? '' : 's'} hidden`;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-border/60 bg-elevated/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${margin}`}
    >
      <p className="m-0 text-xs text-ink-muted sm:text-sm">{status}</p>
      <div className="flex flex-wrap gap-2">
        {expanded ? (
          <button type="button" className={SECONDARY_BTN_CLASS} onClick={onHide}>
            Hide
          </button>
        ) : (
          <>
            <button type="button" className={SECONDARY_BTN_CLASS} onClick={onShow10}>
              {earlier ? 'Show previous 10' : 'Show next 10'}
            </button>
            <button type="button" className={SECONDARY_BTN_CLASS} onClick={onShowAll}>
              {earlier ? 'Show all previous' : 'Show all next'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface Props {
  parsedFocusStep: number | null;
  showAllCompleted: boolean;
  showAllAfter: boolean;
  hiddenEarlierCount: number;
  hiddenLaterCount: number;
  listEntries: ListEntry[];
  onShowPrevious10: () => void;
  onShowAllPrevious: () => void;
  onHidePrevious: () => void;
  onShowNext10: () => void;
  onShowAllNext: () => void;
  onHideNext: () => void;
}

export function ChallengeListSection(props: Props) {
  const {
    parsedFocusStep,
    showAllCompleted,
    showAllAfter,
    hiddenEarlierCount,
    hiddenLaterCount,
    listEntries,
    onShowPrevious10,
    onShowAllPrevious,
    onHidePrevious,
    onShowNext10,
    onShowAllNext,
    onHideNext,
  } = props;

  const showEarlier = parsedFocusStep != null && (showAllCompleted || hiddenEarlierCount > 0);
  const showLater = parsedFocusStep != null && (showAllAfter || hiddenLaterCount > 0);

  return (
    <div className="min-w-0">
      {showEarlier ? (
        <BoundsBanner
          edge="earlier"
          expanded={showAllCompleted}
          hiddenCount={hiddenEarlierCount}
          onShow10={onShowPrevious10}
          onShowAll={onShowAllPrevious}
          onHide={onHidePrevious}
        />
      ) : null}

      <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:gap-3.5">
        {listEntries.map(({ row, i, stepNum }) => (
          <ChallengeCard
            key={`${String(row.completions)}-${String(row.taskIndex)}-${String(i)}`}
            row={row}
            stepNum={stepNum}
            parsedFocusStep={parsedFocusStep}
          />
        ))}
      </ul>

      {showLater ? (
        <BoundsBanner
          edge="later"
          expanded={showAllAfter}
          hiddenCount={hiddenLaterCount}
          onShow10={onShowNext10}
          onShowAll={onShowAllNext}
          onHide={onHideNext}
        />
      ) : null}
    </div>
  );
}
