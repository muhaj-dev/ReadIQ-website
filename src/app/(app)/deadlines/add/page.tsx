'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ColorRow } from '@/components/deadlines/color-row';
import { DateTimeRow } from '@/components/deadlines/date-time-row';
import { FormField } from '@/components/form/form-field';
import { FormHeader } from '@/components/form/form-header';
import { FormInput } from '@/components/form/form-input';
import { OptionSheet } from '@/components/form/option-sheet';
import { SelectRow } from '@/components/form/select-row';
import { Page } from '@/components/shell/page';
import { createEmptyDraft, type DeadlineDraft } from '@/data/deadlines';
import { type DeadlineSheetKey, sheetFor } from '@/lib/deadline-form';
import { combineDue, toDateValue } from '@/lib/deadline-view';
import { useDeadlinesStore } from '@/store/use-deadlines-store';
import { useSubjectsStore } from '@/store/use-subjects-store';

type SelectKey = Exclude<DeadlineSheetKey, 'date' | 'time'>;

/** Default the due date to tomorrow, from the real clock. */
function tomorrowValue(): string {
  const now = new Date();
  return toDateValue(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
}

/** ADD DEADLINE — saving persists a real deadline; reminders are a saved preference. */
export default function AddDeadlinePage() {
  const router = useRouter();
  const addDeadline = useDeadlinesStore((s) => s.addDeadline);
  const subjects = useSubjectsStore((s) => s.subjects);
  const addSubject = useSubjectsStore((s) => s.addSubject);

  const [draft, setDraft] = useState<DeadlineDraft>(() => createEmptyDraft(tomorrowValue()));
  const [sheet, setSheet] = useState<SelectKey | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof DeadlineDraft>(key: K, value: DeadlineDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft.title.trim()) {
      setTitleError(true);
      document.getElementById('deadline-title')?.focus();
      return;
    }
    setSaving(true);
    await addDeadline({
      title: draft.title,
      subject: draft.subject,
      type: draft.type,
      dueDate: combineDue(draft.dateValue, draft.timeValue),
      reminderOn: draft.reminder !== 'No reminder',
      reminderLabel: draft.reminder,
      repeat: draft.repeat,
      notes: draft.notes,
      colorIndex: draft.colorIndex,
    });
    router.push('/deadlines');
  };

  // Subjects come from the student's own list (they can add one inline).
  const config =
    sheet === 'subject'
      ? { options: subjects.map((label) => ({ label })), selected: draft.subject, patchFor: (label: string) => ({ subject: label }) }
      : sheetFor(sheet, draft);
  const titleFor = (key: SelectKey) => key[0].toUpperCase() + key.slice(1);
  const selectField = (key: SelectKey) => (
    <FormField label={titleFor(key)}>
      <SelectRow label={titleFor(key)} value={draft[key]} dot={key === 'subject'} onPress={() => setSheet(key)} />
    </FormField>
  );

  return (
    <Page width="narrow">
      <FormHeader title="Add Deadline" backTo="/deadlines" onSave={save} saving={saving} />

      <div className="flex flex-col gap-4">
        <FormField label="Title" htmlFor="deadline-title">
          <FormInput
            id="deadline-title"
            value={draft.title}
            onChange={(v) => {
              set('title', v);
              if (v.trim()) setTitleError(false);
            }}
            placeholder="e.g. Biochemistry Exam"
            error={titleError}
            autoFocus
          />
          {titleError ? (
            <p role="alert" className="ml-1 text-xs font-medium text-rq-error">
              Give your deadline a name so you can recognise it.
            </p>
          ) : null}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          {selectField('subject')}
          {selectField('type')}
        </div>

        <FormField label="Due Date">
          <DateTimeRow
            dateValue={draft.dateValue}
            timeValue={draft.timeValue}
            onDateChange={(v) => set('dateValue', v)}
            onTimeChange={(v) => set('timeValue', v)}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          {selectField('reminder')}
          {selectField('repeat')}
        </div>

        <FormField label="Notes" htmlFor="deadline-notes">
          <FormInput id="deadline-notes" multiline value={draft.notes} onChange={(v) => set('notes', v)} placeholder="Anything to remember?" />
        </FormField>

        <div className="pt-2">
          <FormField label="Color">
            <ColorRow selectedIndex={draft.colorIndex} onSelect={(i) => set('colorIndex', i)} />
          </FormField>
        </div>
      </div>

      <OptionSheet
        visible={sheet !== null}
        title={sheet ? titleFor(sheet) : ''}
        options={config.options}
        selected={config.selected}
        onSelect={(label) => {
          setDraft((d) => ({ ...d, ...config.patchFor(label) }));
          setSheet(null);
        }}
        onCancel={() => setSheet(null)}
        onAddOption={sheet === 'subject' ? (name) => void addSubject(name).then((s) => s && set('subject', s)) : undefined}
        addLabel="Add subject or course"
      />
    </Page>
  );
}
