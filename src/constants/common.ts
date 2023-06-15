import { InitMode } from 'types';

const AUDIO_X_CONSTANTS = Object.freeze({
  REACT: 'REACT' as InitMode,
  VANILLA: 'VANILLA' as InitMode,
  DEVELOPMENT: 'development',
});

const PLAYBACK_STATE = Object.freeze({
  BUFFERING: 'buffering',
  PLAYING: 'playing',
  PAUSED: 'paused',
  READY: 'ready',
  IDLE: 'idle',
  ENDED: 'ended',
  STALLED: 'stalled',
  ERROR: 'error',
});

export { AUDIO_X_CONSTANTS, PLAYBACK_STATE };
