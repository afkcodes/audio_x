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
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_state_${e.type}`
    );
  },

  CAN_PLAY: (e: Event) => {
    console.log(e.type);
    mutableAudioState = { ...mutableAudioState, isBuffering: true };
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
      isBuffering: true,
    };
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PLAY: (e: Event) => {
    const audioInstance = AudioX.getAudioInstance();

    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: true,
      isPaused: false,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  PAUSE: (e: Event) => {
    const audioInstance = AudioX.getAudioInstance();

    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: false,
      isPaused: true,
      progress: audioInstance?.currentTime,
    };
    console.log(e.type);
    notifier.notify(
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  ENDED: (e: Event) => {
    const audioInstance = AudioX.getAudioInstance();

    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: false,
      isPlaying: false,
      isPaused: true,
      hasEnded: true,
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
      'AUDIO_X_STATE',
      mutableAudioState,
      `audiox_baseEvents_state_${e.type}`
    );
  },

  WAITING: (e: Event) => {
    const audioInstance = AudioX.getAudioInstance();

    console.log(e.type);
    mutableAudioState = {
      ...mutableAudioState,
      isBuffering: true,
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
