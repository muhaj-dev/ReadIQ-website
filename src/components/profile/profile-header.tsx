import Image from 'next/image';

import { GlassCard } from '@/components/profile/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { images } from '@/constants/images';

type Props = {
  name: string;
  /** Contact email under the name. Hidden if empty. */
  email: string;
  /** The student's study goal. Hidden if empty. */
  goal: string;
  role: string;
  /** Opens the inline edit form (avatar badge + name pencil). */
  onEdit: () => void;
};

/** Identity block: avatar with edit badge, name, email, goal, and the course chip. */
export function ProfileHeader({ name, email, goal, role, onEdit }: Props) {
  return (
    <div className="flex flex-col items-center text-center text-rq-on-primary">
      {/* Avatar — the readIQ mark in a soft double ring. */}
      <div className="relative mb-6">
        <div className="size-32 rounded-pill border-4 border-rq-on-primary/20 p-1">
          <div className="flex size-full items-center justify-center rounded-pill border-2 border-rq-on-primary-soft bg-rq-on-primary/5 p-5">
            <Image src={images.readiqMark} alt="Profile photo" className="h-auto w-full" />
          </div>
        </div>
        <button
          type="button"
          aria-label="Edit profile"
          onClick={onEdit}
          className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-pill border-2 border-rq-profile-top bg-rq-on-primary text-rq-profile-top shadow-lg transition hover:scale-105"
        >
          <AppIcon name="edit" size={16} />
        </button>
      </div>

      <button
        type="button"
        aria-label="Edit name"
        onClick={onEdit}
        className="group mb-1 flex items-center gap-2"
      >
        {/* Spacer mirrors the pencil so the name stays truly centred. */}
        <span className="w-5" />
        <span className="font-heading text-[26px] leading-8 font-bold">{name}</span>
        <AppIcon name="edit" size={20} className="text-rq-on-primary-soft/60 transition group-hover:text-rq-on-primary-soft" />
      </button>

      {email ? <p className="text-base text-rq-on-primary-soft">{email}</p> : null}
      {goal ? <p className="mt-1 text-sm text-rq-on-primary-soft/80">Goal: {goal}</p> : null}

      <GlassCard className="mt-4 rounded-pill px-4 py-1.5">
        <span className="text-sm font-semibold tracking-[0.01em]">{role}</span>
      </GlassCard>
    </div>
  );
}
