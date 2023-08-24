import { PLAYBACK_STATE } from 'constants/common';
import ChangeNotifier from 'helpers/notifier';
import { HlsEventsCallbackMap } from 'types/audioEvents.types';

export const HLS_EVENTS_CALLBACK_MAP: HlsEventsCallbackMap = {
  ERROR: (e: Event, data: any) => {
    const type = data.type;
    const detail = data.details;
    const isFatal = data.fatal;
    console.log('STATUS', e.type);

    ChangeNotifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.ERROR,
        error: {
          type,
          isFatal,
          detail
        }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },
  FRAG_CHANGED: () => {
    console.log('FRAG_CHANGED');
  }
};
