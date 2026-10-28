/** Viewfinder overlay: dimmed border, corner brackets, and the sweeping scan line.
 *  Camera chrome is fixed dark/white in both themes (it sits on a live video). */
export function ScanFrame() {
  const bracket = 'absolute size-12 border-white/90';
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 border-[28px] border-black/35 sm:border-[40px]" />
      <span className={`${bracket} top-12 left-12 rounded-tl-inner border-t-4 border-l-4 sm:top-16 sm:left-16`} />
      <span className={`${bracket} top-12 right-12 rounded-tr-inner border-t-4 border-r-4 sm:top-16 sm:right-16`} />
      <span className={`${bracket} bottom-12 left-12 rounded-bl-inner border-b-4 border-l-4 sm:bottom-16 sm:left-16`} />
      <span className={`${bracket} right-12 bottom-12 rounded-br-inner border-r-4 border-b-4 sm:right-16 sm:bottom-16`} />
      {/* Sweeping scan line (reduced-motion users get a still frame). */}
      <span className="absolute inset-x-0 top-0 h-[3px] bg-rq-secondary-container shadow-[0_0_15px_var(--rq-secondary-container)] motion-safe:animate-[rq-scan-sweep_3s_linear_infinite]" />
      <style>{`@keyframes rq-scan-sweep{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:calc(100% - 3px);opacity:0}}`}</style>
    </div>
  );
}
