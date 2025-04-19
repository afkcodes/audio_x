import type { InitMode } from 'types';
import type { ErrorMessageMap } from 'types/errorEvents.types';

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
  TRACK_CHANGE: 'trackchanged',
  DURATION_CHANGE: 'durationchanged',
  QUEUE_ENDED: 'queueended',
  INTERRUPTED: 'interrupted',
});

const ERROR_MSG_MAP: ErrorMessageMap = Object.freeze({
  MEDIA_ERR_ABORTED: 'The user canceled the audio.',
  MEDIA_ERR_DECODE: 'An error occurred while decoding the audio.',
  MEDIA_ERR_NETWORK: 'A network error occurred while fetching the audio.',
  MEDIA_ERR_SRC_NOT_SUPPORTED:
    'The audio is missing or is in a format not supported by your browser.',
  DEFAULT: 'An unknown error occurred.',
});

const URLS = {
  HLS: 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.18/hls.min.js',
  CAST: 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
};

export { AUDIO_X_CONSTANTS, ERROR_MSG_MAP, PLAYBACK_STATE, URLS };
