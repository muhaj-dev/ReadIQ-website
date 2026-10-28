'use client';

import { useState } from 'react';

import { AppearancePicker } from '@/components/settings/appearance-picker';
import { SettingsRow } from '@/components/settings/settings-row';
import { SettingsSection } from '@/components/settings/settings-section';
import { Page, PageHeader } from '@/components/shell/page';
import { modelLabelFor } from '@/data/ai-models';
import { settingsSections, type SettingsRowItem } from '@/data/settings';
import { useSettingsStore } from '@/store/use-settings-store';
import { useUserStore } from '@/store/use-user-store';

/** Where navigating rows go. Rows not listed here are read-only preferences on the web. */
const ROW_LINKS: Record<string, string> = {
  model: '/settings/model',
  'data-privacy': '/settings/data-privacy',
};

/** SETTINGS — grouped preference rows. Appearance switches theme; AI Model + Data & Privacy navigate. */
export default function SettingsPage() {
  const chatModel = useSettingsStore((s) => s.chatModel);
  const studyingFor = useUserStore((s) => s.profile.studyingFor);
  const [focusMode, setFocusMode] = useState(true);

  // Live values instead of the mock's static labels.
  const withLiveValue = (row: SettingsRowItem): SettingsRowItem => {
    if (row.key === 'model') return { ...row, value: modelLabelFor(chatModel) };
    if (row.key === 'subject') return { ...row, value: studyingFor.trim() || 'General' };
    return row;
  };

  return (
    <Page width="wide">
      <PageHeader title="Settings" back="/profile" />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-8">
        {settingsSections.map((section) => (
          <SettingsSection key={section.key} label={section.label}>
            {section.rows.map((raw) => {
              const row = withLiveValue(raw);
              return (
                <SettingsRow
                  key={row.key}
                  item={row}
                  href={ROW_LINKS[row.key]}
                  trailing={row.key === 'appearance' ? <AppearancePicker /> : undefined}
                  toggled={row.key === 'focus' ? focusMode : undefined}
                  onToggle={row.key === 'focus' ? setFocusMode : undefined}
                />
              );
            })}
          </SettingsSection>
        ))}
      </div>
    </Page>
  );
}
