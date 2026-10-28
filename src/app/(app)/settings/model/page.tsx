'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ModelOptionCard } from '@/components/settings/model-option-card';
import { Page, PageHeader } from '@/components/shell/page';
import { AI_MODELS } from '@/data/ai-models';
import { useSettingsStore } from '@/store/use-settings-store';

/** AI MODEL — pick which Groq model writes answers. Grounding is unaffected. */
export default function ModelPickerPage() {
  const router = useRouter();
  const chatModel = useSettingsStore((s) => s.chatModel);
  const setChatModel = useSettingsStore((s) => s.setChatModel);

  const pick = async (id: string, label: string) => {
    await setChatModel(id);
    toast.success(`${label} will answer from now on`);
    router.push('/settings');
  };

  return (
    <Page width="default">
      <PageHeader title="AI Model" back="/settings" />

      <p className="mb-5 max-w-2xl text-sm text-rq-on-surface-variant">
        Choose which AI model answers your questions. Every answer still comes only from your saved
        notes — this just changes who writes it.
      </p>

      <div role="radiogroup" aria-label="AI model" className="grid gap-3 md:grid-cols-2">
        {AI_MODELS.map((model) => (
          <ModelOptionCard
            key={model.id}
            model={model}
            selected={model.id === chatModel}
            onSelect={() => pick(model.id, model.label)}
          />
        ))}
      </div>
    </Page>
  );
}
