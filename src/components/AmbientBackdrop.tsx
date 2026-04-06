import React from 'react';

export function AmbientBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-canvas" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -30%, oklch(0.32 0.12 295 / 0.35), transparent 55%),
            radial-gradient(ellipse 70% 50% at 100% 0%, oklch(0.28 0.08 200 / 0.12), transparent 50%),
            radial-gradient(ellipse 60% 40% at 0% 100%, oklch(0.25 0.06 25 / 0.1), transparent 45%)
          `,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.08_0.02_270/0.5)_100%)]"
        aria-hidden
      />
    </>
  );
}
