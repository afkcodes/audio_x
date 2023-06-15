import { PLAYBACK_STATE } from 'constants/common';
import { ReadyState } from 'types';
import { AudioState, MediaTrack } from 'types/audio.types';

export const readyState: ReadyState = Object.freeze({
  0: 'HAVE_NOTHING',
  1: 'HAVE_METADATA',
  2: 'HAVE_CURRENT_DATA',
  3: 'HAVE_FUTURE_DATA',
  4: 'HAVE_ENOUGH_DATA',
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
    type: '',
  },
  currentTrack: {} as MediaTrack,
};
