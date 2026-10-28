// Note → shareable/exportable formats (plain text, Markdown, printable HTML).
// Pure helpers plus a tiny browser download; no AI calls.

import { blobToBase64, getBlob } from '@/lib/blob-store';
import type { Note } from '@/types/note';

import { sanitizeHtml } from '@/components/reader/reader-dom';

function safeFileName(title: string): string {
  return title.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'note';
}

/** "Title\n\nSubject · tags\n\ncontent" — for Share and .txt export. */
export function noteToText(note: Note): string {
  const meta = [note.subject ?? 'General', ...note.tags.map((t) => `#${t}`)].join(' · ');
  return `${note.title}\n${meta}\n\n${note.content.trim()}\n`;
}

/** A readable Markdown document of the note. */
export function noteToMarkdown(note: Note): string {
  const lines = [`# ${note.title}`, '', `**Subject:** ${note.subject ?? 'General'}`];
  if (note.tags.length) lines.push(`**Topics:** ${note.tags.join(', ')}`);
  if (note.aiSummary) lines.push('', `> ${note.aiSummary.trim().replace(/\n+/g, ' ')}`);
  lines.push('', note.content.trim(), '');
  const files = note.attachments.map((a) => `- ${a.name} (${a.meta})`);
  if (files.length) lines.push('## Attachments', '', ...files, '');
  return lines.join('\n');
}

/** Trigger a browser download of a text file. */
export function downloadText(note: Note, ext: 'txt' | 'md', text: string): void {
  const type = ext === 'md' ? 'text/markdown' : 'text/plain';
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeFileName(note.title)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline `idb:` images as data URIs so the print window can show them. */
async function inlineImages(html: string): Promise<string> {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild as HTMLElement;
  await Promise.all(
    Array.from(root.querySelectorAll('img')).map(async (img) => {
      const src = img.getAttribute('src') ?? '';
      if (!src.startsWith('idb:')) return;
      try {
        const blob = await getBlob(src);
        img.setAttribute('src', `data:${blob.type};base64,${await blobToBase64(blob)}`);
      } catch {
        img.remove();
      }
    }),
  );
  return root.innerHTML;
}

/** "Export as PDF": open a clean printable copy and the browser's print dialog
 *  (Save as PDF). The window opens synchronously so popup blockers allow it. */
export async function printNote(note: Note): Promise<boolean> {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write('<p style="font-family:sans-serif">Preparing your note…</p>');
  const body = await inlineImages(sanitizeHtml(note.contentHtml?.trim() || `<p>${escapeHtml(note.content)}</p>`));
  win.document.open();
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(note.title)}</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.65}
h1{margin:0 0 4px}.meta{color:gray;margin:0 0 24px}img{max-width:100%;border-radius:8px}
p{white-space:pre-wrap}</style></head><body>
<h1>${escapeHtml(note.title)}</h1><p class="meta">${escapeHtml(note.subject ?? 'General')}</p>${body}</body></html>`);
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 300);
  return true;
}
