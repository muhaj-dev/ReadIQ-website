/** The "readIQ is reading your notes…" indicator shown before the first token. */
export function TypingDots() {
  return (
    <div className="flex h-5 items-center gap-1.5" role="status" aria-label="readIQ is reading your notes">
      {[0, 160, 320].map((delay) => (
        <span
          key={delay}
          className="size-2 animate-pulse rounded-pill bg-rq-outline"
          style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
        />
      ))}
    </div>
  );
}
