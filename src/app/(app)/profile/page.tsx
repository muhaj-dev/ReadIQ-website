'use client';

import { useState } from 'react';

import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileMenu } from '@/components/profile/profile-menu';
import { ProfileStats } from '@/components/profile/profile-stats';
import { Page } from '@/components/shell/page';
import { useProfile } from '@/hooks/use-profile';
import { useProfileMenu } from '@/hooks/use-profile-menu';

/** PROFILE — identity, study stats, and the account menu on the indigo panel.
 *  Phones: one column. Desktop: identity + stats left, menu right. */
export default function ProfilePage() {
  const { user, stats, form, save } = useProfile();
  const menu = useProfileMenu();
  const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-dvh bg-linear-to-b from-rq-profile-top to-rq-profile-bottom">
      <Page width="wide" className="pt-8 lg:pt-14">
        <div className="mx-auto grid max-w-md gap-8 lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-8">
            <div className="mb-2">
              <ProfileHeader {...user} onEdit={() => setEditing(true)} />
            </div>
            {editing ? (
              <ProfileEditForm initial={form} onSave={save} onCancel={() => setEditing(false)} />
            ) : null}
            <ProfileStats stats={stats} />
          </div>

          <div className="lg:pt-4">
            <ProfileMenu items={menu} />
          </div>
        </div>
      </Page>
    </div>
  );
}
