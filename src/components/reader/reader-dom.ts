// Real-DOM annotation helpers for the Note Reader (the web port of the mobile
// app's WebView script in lib/reader-doc.ts): sanitize the note HTML, resolve
// `idb:` images, wrap the selection in highlight/comment <mark>s, and serialize
// the article back to storable HTML.

import { EditorHighlightInk } from '@/constants/theme';
import { getBlob } from '@/lib/blob-store';

const BLOCKED_TAGS = 'script,style,iframe,object,embed,link,meta,base,form,input,button,textarea,select';

/** Strip scripts, embeds and inline handlers. The HTML is the student's own note,
 *  but it must never execute anything when injected into the page. */
export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return '';
  root.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());
  root.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      else if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) el.removeAttribute(attr.name);
    }
  });
  root.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return root.innerHTML;
}

/** Swap stored `idb:` image uris for object URLs (kept in data-idb-src so
 *  serialize() can restore them). Returns the URLs to revoke later. */
export async function resolveStoredImages(root: HTMLElement): Promise<string[]> {
  const urls: string[] = [];
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('data-idb-src') ?? img.getAttribute('src') ?? '';
      if (!src.startsWith('idb:')) return;
      img.setAttribute('data-idb-src', src);
      img.removeAttribute('src');
      try {
        const url = URL.createObjectURL(await getBlob(src));
        urls.push(url);
        img.src = url;
      } catch {
        img.alt = img.alt || 'Image no longer stored on this device';
      }
    }),
  );
  return urls;
}

/** The article's HTML as it should be stored (idb: uris restored). */
export function serializeArticle(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('img[data-idb-src]').forEach((img) => {
    img.setAttribute('src', img.getAttribute('data-idb-src') ?? '');
    img.removeAttribute('data-idb-src');
  });
  return clone.innerHTML;
}

/** Wrap the live selection in `mark`, tolerating ranges that cross elements. */
export function wrapSelection(root: HTMLElement, mark: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
  const range = sel.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return false;
  try {
    range.surroundContents(mark);
  } catch {
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
  }
  sel.removeAllRanges();
  return true;
}

/** Replace an element with its children (removes a highlight / comment anchor). */
export function unwrap(el: Element): void {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
  parent.normalize();
}

export function makeHighlightMark(color: string): HTMLElement {
  const mark = document.createElement('mark');
  mark.className = 'hl';
  mark.setAttribute('data-hl', color);
  mark.style.background = color;
  mark.style.color = EditorHighlightInk;
  return mark;
}

export function makeCommentMark(cid: string): HTMLElement {
  const mark = document.createElement('mark');
  mark.className = 'cm';
  mark.setAttribute('data-cid', cid);
  return mark;
}

export function newCommentId(): string {
  return `c${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** The selected text inside `root`, or '' (a collapsed selection = a tap). */
export function selectedText(root: HTMLElement): string {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return '';
  if (!root.contains(sel.getRangeAt(0).commonAncestorContainer)) return '';
  return sel.toString().trim();
}
