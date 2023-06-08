import { EventListenersList, InitMode } from 'types';

const AUDIO_X_CONSTANTS = {
  REACT: 'REACT' as InitMode,
  VANILLA: 'VANILLA' as InitMode,
  DEVELOPMENT: 'development',
};

const DEFAULT_EVENT_LIST: EventListenersList = [
  'CAN_PLAY',
  'CAN_PLAY_THROUGH',
  'PLAY',
  'PAUSE',
  'ENDED',
  'LOAD_START',
  'LOADED_DATA',
  'TIME_UPDATE',
];

export { AUDIO_X_CONSTANTS, DEFAULT_EVENT_LIST };
