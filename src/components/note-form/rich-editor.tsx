'use client';

import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import type { CSSProperties } from 'react';

import { EditorHighlightInk } from '@/constants/theme';
import { pickInlineImageDataUri } from '@/lib/files';
import { cn } from '@/lib/utils';

import { RichToolbar } from './rich-toolbar';

export type RichEditorProps = {
  /** HTML the editor opens with — read once on mount, never fed back. */
  initialHtml: string;
  /** Fires on every edit with the current HTML (the parent keeps it for Save). */
  onChangeHtml: (html: string) => void;
  placeholder?: string;
  className?: string;
};

// Prose styles for the editable area (no typography plugin — explicit, theme-aware).
const PROSE = cn(
  'min-h-80 px-4 py-3 text-base leading-relaxed text-rq-on-surface outline-none lg:min-h-105',
  '[&_p]:my-1.5 [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-extrabold',
  '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold',
  '[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold',
  '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-1',
  '[&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2',
  '[&_li[data-type=taskItem]>label]:mt-1 [&_li[data-type=taskItem]>div]:flex-1',
  '[&_li[data-checked=true]>div]:text-rq-outline [&_li[data-checked=true]>div]:line-through',
  '[&_input[type=checkbox]]:size-4 [&_input[type=checkbox]]:accent-rq-secondary',
  '[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-rq-secondary-container/50 [&_blockquote]:pl-4 [&_blockquote]:text-rq-on-surface-variant',
  '[&_code]:rounded [&_code]:bg-rq-surface-container [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
  '[&_pre]:my-2 [&_pre]:rounded-inner [&_pre]:bg-rq-surface-container [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_a]:text-rq-secondary [&_a]:underline [&_a]:underline-offset-2',
  '[&_mark]:rounded-sm [&_mark]:px-0.5 [&_mark]:text-(--rq-mark-ink)',
  '[&_img]:my-2 [&_img]:max-h-96 [&_img]:max-w-full [&_img]:rounded-inner [&_img.ProseMirror-selectednode]:ring-2 [&_img.ProseMirror-selectednode]:ring-rq-secondary',
  '[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0',
  '[&_p.is-editor-empty:first-child]:before:text-rq-outline [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
);

/** WYSIWYG note editor (Tiptap). Content stays HTML; the form derives plain text on save. */
export function RichEditor({ initialHtml, onChangeHtml, placeholder = 'Start typing or paste your notes…', className }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    content: initialHtml,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Image.configure({ allowBase64: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: { attributes: { class: PROSE, 'aria-label': 'Note content' } },
    onUpdate: ({ editor: e }) => onChangeHtml(e.getHTML()),
  });

  const insertImage = async () => {
    const src = await pickInlineImageDataUri();
    if (src && editor) editor.chain().focus().setImage({ src }).run();
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-inner border border-rq-outline-variant/60 bg-rq-surface-lowest focus-within:border-rq-secondary-container',
        className,
      )}
      // Highlighter ink is fixed dark in both themes (the marker is always yellow).
      style={{ '--rq-mark-ink': EditorHighlightInk } as CSSProperties}
    >
      {editor ? <RichToolbar editor={editor} onInsertImage={insertImage} /> : <div className="h-12 border-b border-rq-outline-variant/40" />}
      <div className="max-h-[70vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
