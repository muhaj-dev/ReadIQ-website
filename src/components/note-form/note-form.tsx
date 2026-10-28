'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { PageHeader } from '@/components/shell/page';
import { Button } from '@/components/ui/button';
import { htmlToPlainText, plainTextToHtml, splitHardBreaks } from '@/lib/rich-text';
import type { NoteAttachment } from '@/types/note';

import { AttachmentsField } from './attachments-field';
import { FormField, fieldInputClass } from './form-field';
import { RichEditor } from './rich-editor';
import { SubjectPicker } from './subject-picker';
import { TagChipRow } from './tag-chip-row';

/** The editable note draft shared by Add Note, Add Document, and Edit Note. */
export type NoteFormValues = {
  title: string;
  subject: string;
  tags: string[];
  /** Plain-text projection of the content — the grounding source of truth. */
  content: string;
  /** Rich HTML from the editor. */
  contentHtml: string;
  attachments: NoteAttachment[];
};

export type NoteFormProps = {
  /** Header title — "Add Note", "Add Document", or "Edit Note". */
  headerTitle: string;
  initial: NoteFormValues;
  /** Back button target: a path, or `true` (default) for browser history. */
  back?: string | true;
  /** Receives the edited draft so the caller can persist it (may be async). */
  onSave: (values: NoteFormValues) => void | Promise<void>;
  /** Optional footer slot (Edit Note uses it for Delete Note). */
  footer?: ReactNode;
  /** Show Attachments at the top (Add Document) instead of in the side column. */
  attachmentsFirst?: boolean;
  /** Hide the Content editor (Add Document); the initial text still flows to onSave. */
  hideContent?: boolean;
};

/** The note editor: title, subject, tags, WYSIWYG content, attachments. Two columns on desktop. */
export function NoteForm({ headerTitle, initial, back = true, onSave, footer, attachmentsFirst, hideContent }: NoteFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [subject, setSubject] = useState(initial.subject);
  const [tags, setTags] = useState(initial.tags);
  const [attachments, setAttachments] = useState(initial.attachments);
  const [titleError, setTitleError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Opening HTML captured once (wrap legacy text, split hard breaks); never fed back.
  const [initialHtml] = useState(() =>
    initial.contentHtml ? splitHardBreaks(initial.contentHtml) : plainTextToHtml(initial.content),
  );
  const [contentHtml, setContentHtml] = useState(initialHtml);

  const submit = async () => {
    if (saving) return;
    if (!title.trim()) {
      setTitleError(true);
      document.getElementById('note-title')?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: title.trim(), subject, tags, content: htmlToPlainText(contentHtml), contentHtml, attachments });
    } finally {
      setSaving(false);
    }
  };

  const attachmentsSection = (
    <FormField label="Attachments">
      <AttachmentsField
        attachments={attachments}
        onAdd={(added) => setAttachments((now) => [...now, ...added])}
        onRemove={(id) => setAttachments((now) => now.filter((a) => a.id !== id))}
      />
    </FormField>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <PageHeader
        title={headerTitle}
        back={back}
        actions={
          <Button type="submit" disabled={saving} className="h-10 rounded-btn px-5 text-sm font-semibold">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-5">
          {attachmentsFirst ? attachmentsSection : null}

          <FormField label="Title" htmlFor="note-title">
            <input
              id="note-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError && e.target.value.trim()) setTitleError(false);
              }}
              placeholder="Note title"
              aria-invalid={titleError}
              className={`${fieldInputClass} aria-invalid:border-rq-error`}
            />
            {titleError ? <p className="ml-1 text-sm text-rq-error">Give your note a title before saving.</p> : null}
          </FormField>

          {hideContent ? null : (
            <FormField label="Content">
              <RichEditor initialHtml={initialHtml} onChangeHtml={setContentHtml} />
            </FormField>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          <FormField label="Subject">
            <SubjectPicker value={subject} onChange={setSubject} />
          </FormField>

          <FormField label="Tags">
            <TagChipRow
              tags={tags}
              onAdd={(tag) => setTags((now) => (now.includes(tag) ? now : [...now, tag]))}
              onRemove={(tag) => setTags((now) => now.filter((t) => t !== tag))}
            />
          </FormField>

          {attachmentsFirst ? null : attachmentsSection}

          {footer ? <div className="pt-4">{footer}</div> : null}
        </aside>
      </div>
    </form>
  );
}
