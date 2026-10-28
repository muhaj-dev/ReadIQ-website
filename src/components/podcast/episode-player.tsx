'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { useEpisodePlayer } from '@/hooks/use-episode-player';
import { HOSTS, type PodcastEpisode } from '@/types/podcast';

import { EpisodeIntro } from './episode-intro';
import { PodcastPlayerBar } from './podcast-player-bar';
import { PodcastTranscript } from './podcast-transcript';
import { VoicePickerSheet } from './voice-picker-sheet';

type Props = {
  episode: PodcastEpisode;
  noteTitle: string;
};

/** Ready state: the two-host transcript plus pinned player controls. */
export function EpisodePlayer({ episode, noteTitle }: Props) {
  const player = useEpisodePlayer(episode.turns);
  const activeSpeaker = episode.turns[player.activeIndex]?.speaker;
  const speakerName = activeSpeaker ? HOSTS[activeSpeaker] : '';
  const [voicesOpen, setVoicesOpen] = useState(false);

  const openVoices = () => {
    // Pause so the episode doesn't clash with voice previews.
    if (player.playing) player.toggle();
    setVoicesOpen(true);
  };

  return (
    <div>
      <PodcastTranscript
        turns={episode.turns}
        activeIndex={player.activeIndex}
        follow={player.playing}
        onSeek={player.seek}
        header={
          <EpisodeIntro
            title={episode.title}
            noteTitle={noteTitle}
            coverage={episode.coverage}
            onEditVoices={player.supported ? openVoices : undefined}
          />
        }
      />

      <div className="sticky bottom-0 z-10 pt-4 pb-6">
        {player.supported ? (
          <PodcastPlayerBar
            playing={player.playing}
            atEnd={player.atEnd}
            progress={player.progress}
            activeIndex={player.activeIndex}
            count={player.count}
            speakerName={speakerName}
            onToggle={player.toggle}
            onRestart={player.restart}
          />
        ) : (
          <div className="flex items-center gap-3 rounded-card border border-rq-outline-variant/40 bg-rq-surface-lowest p-4 text-sm text-rq-on-surface-variant shadow-soft">
            <AppIcon name="headphones" size={20} className="text-rq-secondary" />
            This browser can&apos;t read aloud — read along with the transcript, or open readIQ in Chrome, Edge, or
            Safari to listen.
          </div>
        )}
      </div>

      <VoicePickerSheet open={voicesOpen} onClose={() => setVoicesOpen(false)} />
    </div>
  );
}
