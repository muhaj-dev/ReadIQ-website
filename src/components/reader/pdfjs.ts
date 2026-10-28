// Client-only pdf.js loader. pdfjs-dist is imported dynamically (it touches
// browser globals) and its worker is bundled from the package via
// `new URL(..., import.meta.url)`, which Turbopack/webpack emit as a static asset.

type PdfJs = typeof import('pdfjs-dist');

let pdfjsPromise: Promise<PdfJs> | null = null;

export function loadPdfjs(): Promise<PdfJs> {
  pdfjsPromise ??= import('pdfjs-dist').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    return pdfjs;
  });
  return pdfjsPromise;
}
