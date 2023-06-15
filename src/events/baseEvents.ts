import { PLAYBACK_STATE } from 'constants/common';
import ChangeNotifier from 'helpers/notifier';
import { AUDIO_STATE } from 'states/audioState';
import { EventListenerCallbackMap } from 'types';
const notifier = ChangeNotifier;

let mutableAudioState = AUDIO_STATE;

const BASE_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  LOADED_META_DATA: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.BUFFERING,
      duration: audioInstance?.duration,
    };
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_state_${e.type}`
    );
  },

  CAN_PLAY: (e: Event) => {
    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.BUFFERING,
    };
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  CAN_PLAY_THROUGH: (e: Event) => {
    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.READY,
    };
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PLAY: (e: Event, audioInstance: HTMLAudioElement) => {
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.PLAYING,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PAUSE: (e: Event, audioInstance: HTMLAudioElement) => {
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.PAUSED,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  ENDED: (e: Event, audioInstance: HTMLAudioElement) => {
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.ENDED,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  ERROR: (e: Event) => {
    console.log(e.type);
    notifier.notify('AUDIO_X_STATE', {}, `audiox_baseEvents_state_${e.type}`);
  },

  TIME_UPDATE: (e: Event, audioInstance: HTMLAudioElement) => {
    mutableAudioState = {
      ...mutableAudioState,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  WAITING: (e: Event, audioInstance: HTMLAudioElement) => {
    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      playbackState: PLAYBACK_STATE.BUFFERING,
      progress: audioInstance?.currentTime,
    };
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  VOLUME_CHANGE: (e: Event) => {
    console.log(e.type);
    notifier.notify('AUDIO_X_STATE', {}, `audiox_baseEvents_state`);
  },
};

export { BASE_EVENT_CALLBACK_MAP };
