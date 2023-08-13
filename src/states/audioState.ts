import { PLAYBACK_STATE } from 'constants/common';
import ChangeNotifier from 'helpers/notifier';
import { ReadyState } from 'types';
import { AudioState, MediaTrack } from 'types/audio.types';

export const readyState: ReadyState = Object.freeze({
  0: 'HAVE_NOTHING',
  1: 'HAVE_METADATA',
  2: 'HAVE_CURRENT_DATA',
  3: 'HAVE_FUTURE_DATA',
  4: 'HAVE_ENOUGH_DATA'
});

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
    readable: ''
  },
  currentTrack: {} as MediaTrack
};

/* Listen to state changes and update global audio state that is being exposed to outer world
  Do not subscribe to this event, this may cause unexpected behavior instead attach your own custom
  event listener, if you wish to have granular control on audio state. See: attachCustomEventListener 
*/
ChangeNotifier.listen(
  'AUDIO_STATE',
  (data: AudioState) => {
    ChangeNotifier.notify('AUDIO_X_STATE', { ...AUDIO_STATE, ...data });
  },
  AUDIO_STATE
);
