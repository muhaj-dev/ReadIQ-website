/** Live mic waveform: one bar per level (0–1), mirrored around the centre, on a soft glow. */
export function RecordWaveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        aria-hidden
        className="absolute size-72 rounded-pill bg-rq-secondary-container/25 blur-3xl transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0.4 }}
      />
      <div aria-hidden className="relative flex h-40 items-center justify-center gap-1.5">
        {levels.map((level, i) => {
          // Keep a resting shape so a quiet room still reads as "listening".
          const resting = 0.12 + 0.18 * Math.abs(Math.sin(i * 1.7));
          const height = Math.max(resting, active ? level : resting * 0.6);
          return (
            <span
              key={i}
              className="w-1 rounded-pill bg-rq-secondary transition-[height] duration-100 ease-out"
              style={{ height: `${Math.round(height * 100)}%`, opacity: active ? 1 : 0.45 }}
            />
          );
        })}
      </div>
    </div>
  );
}
