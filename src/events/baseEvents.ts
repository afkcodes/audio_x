import { PLAYBACK_STATE } from 'constants/common';
import {
  calculateActualPlayedLength,
  getReadableErrorMessage
} from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { AudioState, EventListenerCallbackMap } from 'types';
import { ERROR_EVENTS } from './errorEvents';
const notifier = ChangeNotifier;

const BASE_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  LOADED_META_DATA: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log('STATUS', e.type);
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
    console.log('STATUS', e.type);

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
    console.log('STATUS', e.type);

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
    console.log('STATUS', e.type);
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

  PAUSE: (e: Event, audioInstance: HTMLAudioElement, playLogEnabled) => {
    console.log('STATUS', e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.PAUSED,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
    if (playLogEnabled) {
      calculateActualPlayedLength(audioInstance, 'PAUSE');
    }
  },

  ENDED: (e: Event, audioInstance: HTMLAudioElement, playLogEnabled) => {
    console.log('STATUS', e.type);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.ENDED,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
    if (playLogEnabled) {
      calculateActualPlayedLength(audioInstance, 'ENDED');
    }
  },

  ERROR: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log('STATUS', e.type);
    const errorCode = audioInstance.error?.code as keyof typeof ERROR_EVENTS;
    const message = getReadableErrorMessage(audioInstance);
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: PLAYBACK_STATE.ERROR,
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
    console.log('STATUS', e.type);
    const audioState = ChangeNotifier.getLatestState(
      'AUDIO_X_STATE'
    ) as AudioState;
    notifier.notify(
      'AUDIO_STATE',
      {
        playbackState: audioInstance.paused
          ? audioState.playbackState
          : PLAYBACK_STATE.PLAYING,
        progress: audioInstance?.currentTime,
        error: { code: null, message: '', readable: '' }
      },
      `audiox_baseEvents_state_${e.type}`
    );
  },

  WAITING: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log('STATUS', e.type);
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
    console.log('STATUS', e.type);
    notifier.notify('AUDIO_STATE', {}, `audiox_baseEvents_state`);
  }
};

export { BASE_EVENT_CALLBACK_MAP };
