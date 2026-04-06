import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ChallengeListSection } from './components/ChallengeListSection';
import { Footer } from './components/Footer';
import { ListSettingsPanel } from './components/ListSettingsPanel';
import { CURRENT_STEP_STORAGE_KEY, DEFAULT_STEP_WINDOW, MAX_LIST_ROWS } from './constants';
import { ButtonTasks, previewNext } from './button-logic';

export function App() {
  const [rowCount, setRowCount] = useState(500);
  const [aboveWindow, setAboveWindow] = useState(DEFAULT_STEP_WINDOW);
  const [belowWindow, setBelowWindow] = useState(DEFAULT_STEP_WINDOW);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllAfter, setShowAllAfter] = useState(false);
  const [focusStepRaw, setFocusStepRaw] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const v = localStorage.getItem(CURRENT_STEP_STORAGE_KEY);
      return typeof v === 'string' ? v : '';
    } catch {
      return '';
    }
  });

  const parsedFocusStep = useMemo(() => {
    const t = focusStepRaw.trim();
    if (t === '') return null;
    const n = Number(t);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : null;
  }, [focusStepRaw]);

  useEffect(() => {
    setAboveWindow(DEFAULT_STEP_WINDOW);
    setBelowWindow(DEFAULT_STEP_WINDOW);
    setShowAllCompleted(false);
    setShowAllAfter(false);
  }, [parsedFocusStep]);

  const scrollToChallengeStep = useCallback((step: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`challenge-step-${String(step)}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const rows = useMemo(() => {
    const tasks = ButtonTasks();
    const n = Math.min(MAX_LIST_ROWS, Math.max(1, Math.floor(rowCount) || 1));
    return previewNext(n, 0, tasks);
  }, [rowCount]);

  const lastStep = rows.length;

  const listEntries = useMemo(() => {
    const base = rows.map((row, i) => ({
      row,
      i,
      stepNum: i + 1,
    }));
    if (parsedFocusStep == null) return base;

    const startStep = showAllCompleted ? 1 : Math.max(1, parsedFocusStep - aboveWindow);
    const endStep = showAllAfter ? lastStep : Math.min(lastStep, parsedFocusStep + belowWindow);

    return base.filter((e) => e.stepNum >= startStep && e.stepNum <= endStep);
  }, [rows, lastStep, parsedFocusStep, aboveWindow, belowWindow, showAllCompleted, showAllAfter]);

  const hiddenEarlierCount =
    parsedFocusStep != null && !showAllCompleted
      ? Math.max(0, parsedFocusStep - 1 - aboveWindow)
      : 0;

  const hiddenLaterCount =
    parsedFocusStep != null && !showAllAfter
      ? Math.max(0, lastStep - parsedFocusStep - belowWindow)
      : 0;

  useEffect(() => {
    if (parsedFocusStep == null) return;
    const id = window.setTimeout(() => {
      scrollToChallengeStep(parsedFocusStep);
    }, 320);
    return () => {
      clearTimeout(id);
    };
  }, [parsedFocusStep, scrollToChallengeStep]);

  useEffect(() => {
    try {
      if (focusStepRaw.trim() === '') {
        localStorage.removeItem(CURRENT_STEP_STORAGE_KEY);
      } else {
        localStorage.setItem(CURRENT_STEP_STORAGE_KEY, focusStepRaw);
      }
    } catch {
      /* quota / private mode */
    }
  }, [focusStepRaw]);

  return (
    <div className="relative isolate min-h-dvh">
      <AmbientBackdrop />

      <div
        className="relative mx-auto max-w-xl px-4 pb-20 sm:max-w-2xl sm:px-6 lg:max-w-6xl xl:max-w-7xl"
        style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
      >
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Button challenges
          </h1>
        </header>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <ListSettingsPanel
            rowCount={rowCount}
            onRowCountChange={setRowCount}
            focusStepRaw={focusStepRaw}
            onFocusStepChange={setFocusStepRaw}
            parsedFocusStep={parsedFocusStep}
            onJumpToStep={scrollToChallengeStep}
          />

          <ChallengeListSection
            parsedFocusStep={parsedFocusStep}
            showAllCompleted={showAllCompleted}
            showAllAfter={showAllAfter}
            hiddenEarlierCount={hiddenEarlierCount}
            hiddenLaterCount={hiddenLaterCount}
            listEntries={listEntries}
            onShowPrevious10={() => {
              setAboveWindow((w) => w + 10);
            }}
            onShowAllPrevious={() => {
              setShowAllCompleted(true);
            }}
            onHidePrevious={() => {
              setShowAllCompleted(false);
              setAboveWindow(DEFAULT_STEP_WINDOW);
            }}
            onShowNext10={() => {
              setBelowWindow((w) => w + 10);
            }}
            onShowAllNext={() => {
              setShowAllAfter(true);
            }}
            onHideNext={() => {
              setShowAllAfter(false);
              setBelowWindow(DEFAULT_STEP_WINDOW);
            }}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
