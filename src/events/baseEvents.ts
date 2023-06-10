import { AudioX } from 'audio';
import ChangeNotifier from 'helpers/notifier';
import { AUDIO_STATE } from 'states/audioState';
import { EventListenerCallbackMap } from 'types';
const notifier = ChangeNotifier;

let mutableAudioState = AUDIO_STATE;

const BASE_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  LOADED_META_DATA: (e: Event) => {
    console.log(e.type);
    const audioInstance = AudioX.getAudioInstance();
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: true,
      duration: audioInstance?.duration,
    };
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  CAN_PLAY: (e: Event) => {
    console.log(e.type);
    mutableAudioState = { ...mutableAudioState, isBuffering: true };
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  CAN_PLAY_THROUGH: (e: Event) => {
    console.log(e.type);
    mutableAudioState = { ...mutableAudioState, isBuffering: true };
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  PLAY: (e: Event) => {
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: true,
      isPaused: false,
      progress: e.timeStamp,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  PAUSE: (e: Event) => {
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: false,
      isPaused: true,
      progress: e.timeStamp,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  ENDED: (e: Event) => {
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: false,
      isPaused: true,
      hasEnded: true,
      progress: e.timeStamp,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  ERROR: (e: Event) => {
    console.log(e.type);
    notifier.notify('AUDIO_X_EVENTS', {}, `audiox_baseEvents_${e.type}`);
  },

  TIME_UPDATE: (e: Event) => {
    const audioInstance = AudioX.getAudioInstance();

    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: true,
      isPaused: false,
      hasEnded: false,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  WAITING: (e: Event) => {
    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: true,
    };
    notifier.notify(
      'AUDIO_X_EVENTS',
      mutableAudioState,
      `audiox_baseEvents_${e.type}`
    );
  },

  VOLUME_CHANGE: (e: Event) => {
    console.log(e.type);
    notifier.notify('AUDIO_X_EVENTS', {}, `audiox_baseEvents`);
  },
};

export { BASE_EVENT_CALLBACK_MAP };
