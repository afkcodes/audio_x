import { EventListenerCallbackMap, InitMode } from 'types';

const AUDIO_X_CONSTANTS = {
  REACT: 'REACT' as InitMode,
  VANILLA: 'VANILLA' as InitMode,
  DEVELOPMENT: 'development',
};

const DEFAULT_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  CAN_PLAY: (e: any) => {
    console.log(e);
  },
  CAN_PLAY_THROUGH: (e: any) => {
    console.log(e);
  },
};

export { AUDIO_X_CONSTANTS, DEFAULT_EVENT_CALLBACK_MAP };
