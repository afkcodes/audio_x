import { PLAYBACK_STATE } from 'constants/common';
import { diffChecker } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import type { ReadyState } from 'types';
import type { AudioState, MediaTrack } from 'types/audio.types';

export const READY_STATE: ReadyState = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
};

export const AUDIO_STATE: AudioState = {
  playbackState: PLAYBACK_STATE.IDLE,
  duration: 0,
  bufferedDuration: 0,
  progress: 0,
  volume: 50,
  playbackRate: 1,
  error: {
    code: null,
    message: '',
    readable: '',
  },
  currentTrack: {} as MediaTrack,
  currentTrackPlayTime: 0,
  previousTrackPlayTime: 0,
  castDevice: '',
};

/* Listen to state changes and update global audio state that is being exposed to outer world
  Do not subscribe to this event, this may cause unexpected behavior instead attach your own custom
  event listener, if you wish to have granular control on audio state. See: attachCustomEventListener 
*/
ChangeNotifier.listen(
  'AUDIO_STATE',
  (audioState: AudioState) => {
    const latestState = ChangeNotifier.getLatestState('AUDIO_X_STATE') as AudioState;
    if (!diffChecker(latestState, audioState)) {
      ChangeNotifier.notify('AUDIO_X_STATE', { ...AUDIO_STATE, ...audioState });
    }
  },
  AUDIO_STATE,
);
