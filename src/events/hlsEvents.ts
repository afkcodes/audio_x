import { PLAYBACK_STATE } from 'constants/common';
import { notify } from 'helpers/notifier';
import type { HlsEventsCallbackMap } from 'types/audioEvents.types';

export const HLS_EVENTS_CALLBACK_MAP: HlsEventsCallbackMap = {
  ERROR: (e: Event, data: any) => {
    const type = data.type;
    const detail = data.details;
    const isFatal = data.fatal;
    console.log('STATUS', e.type);

    notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.ERROR,
        error: {
          type,
          isFatal,
          detail,
        },
      },
      `audiox_baseEvents_state_${e.type}`,
    );
  },

  FRAG_CHANGED: () => {
    console.log('FRAG_CHANGED');
  },
};
