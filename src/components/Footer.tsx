import React from 'react';

const linkClass =
  'font-medium text-accent underline decoration-border/60 underline-offset-[3px] transition hover:text-accent-dim hover:decoration-accent/50';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border/50 pb-6 pt-8 sm:mt-16 sm:pb-8 sm:pt-10">
      <div className="flex flex-col items-center gap-2 text-center text-sm text-ink-muted">
        <div>
          <a
            href="https://github.com/Cephyric-gh/number-challenges"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
        <p className="m-0">
          &copy; {year}{' '}
          <a
            href="https://github.com/Cephyric-gh"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            @Cephyric-gh
          </a>
        </p>
      </div>
    </footer>
  );
}
