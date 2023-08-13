import { PLAYBACK_STATE } from 'constants/common';
import { getReadableErrorMessage } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { EventListenerCallbackMap } from 'types';
import { ERROR_EVENTS } from './errorEvents';
const notifier = ChangeNotifier;

const BASE_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  LOADED_META_DATA: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.BUFFERING,
        duration: audioInstance?.duration,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_state_${e.type}`
    );
  },

  CAN_PLAY: (e: Event) => {
    console.log(e.type);

    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.BUFFERING,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  CAN_PLAY_THROUGH: (e: Event) => {
    console.log(e.type);

    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.READY,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PLAY: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.PLAYING,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PAUSE: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.PAUSED,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  ENDED: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.ENDED,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  ERROR: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    const errorCode = audioInstance.error?.code as keyof typeof ERROR_EVENTS;
    const message = getReadableErrorMessage(audioInstance);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.PAUSED,
        error: {
          code: errorCode,
          message: ERROR_EVENTS[errorCode],
          readable: message
        }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  TIME_UPDATE: (e: Event, audioInstance: HTMLAudioElement) => {
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.PLAYING,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  WAITING: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.BUFFERING,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  VOLUME_CHANGE: (e: Event) => {
    console.log(e.type);
    notifier.notify('AUDIO_STATE', {}, `audiox_baseEvents_state`);
  }
};

export { BASE_EVENT_CALLBACK_MAP };
