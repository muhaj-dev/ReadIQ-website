'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { AiDataNotice } from '@/components/settings/ai-data-notice';
import { DeleteDataDialog } from '@/components/settings/delete-data-dialog';
import { PrivacyActionCard } from '@/components/settings/privacy-action-card';
import { Page, PageHeader } from '@/components/shell/page';
import { type PrivacyAction, privacyActionGroups } from '@/data/settings';
import { exportAllData } from '@/lib/db';
import { useUserStore } from '@/store/use-user-store';

// Web wording: there is no account — "Delete Account" erases this browser's data.
const WEB_ACTIONS: Record<string, Partial<PrivacyAction>> = {
  'delete-account': { title: 'Delete all my data', subtitle: 'Erase everything saved in this browser' },
  export: { subtitle: 'Download a JSON copy of everything' },
};
// Clear Cache showed a placeholder size on the phone — nothing to clear on the web, so it's hidden.
const HIDDEN = new Set(['cache']);

/** DATA & PRIVACY — AI data disclosure, export, legal, and delete-all-data. */
export default function DataPrivacyPage() {
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const exportData = async () => {
    setExporting(true);
    try {
      const data = { ...(await exportAllData()), profile: useUserStore.getState().profile };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `readiq-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Your data was downloaded');
    } catch {
      toast.error('Couldn’t export your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handlers: Record<string, (() => void) | undefined> = {
    export: exportData,
    'delete-account': () => setConfirmDelete(true),
  };

  return (
    <Page width="wide">
      <PageHeader title="Data & Privacy" back="/settings" />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-8">
        <AiDataNotice />

        <div className="flex flex-col gap-4">
          {privacyActionGroups.map((group) => (
            // The danger group sits apart from the rest.
            <div key={group.key} className={group.key === 'danger' ? 'flex flex-col gap-4 pt-8' : 'flex flex-col gap-4'}>
              {group.actions
                .filter((action) => !HIDDEN.has(action.key))
                .map((action) => (
                  <PrivacyActionCard
                    key={action.key}
                    action={{ ...action, ...WEB_ACTIONS[action.key] }}
                    onPress={handlers[action.key]}
                    busy={action.key === 'export' && exporting}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      <DeleteDataDialog open={confirmDelete} onOpenChange={setConfirmDelete} />
    </Page>
  );
}
