import { AudioEvents } from 'types';

export const AUDIO_EVENTS: AudioEvents = Object.freeze({
  ABORT: 'abort',
  TIME_UPDATE: 'timeupdate',
  CAN_PLAY: 'canplay',
  CAN_PLAY_THROUGH: 'canplaythrough',
  DURATION_CHANGE: 'durationchange',
  ENDED: 'ended',
  EMPTIED: 'emptied',
  PLAYING: 'playing',
  WAITING: 'waiting',
  SEEKING: 'seeking',
  SEEKED: 'seeked',
  LOADED_META_DATA: 'loadedmetadata',
  LOADED_DATA: 'loadeddata',
  PLAY: 'play',
  PAUSE: 'pause',
  RATE_CHANGE: 'ratechange',
  VOLUME_CHANGE: 'volumechange',
  SUSPEND: 'suspend',
  STALLED: 'stalled',
  PROGRESS: 'progress',
  LOAD_START: 'loadstart',
  ERROR: 'error',
  TRACK_CHANGE: 'trackchange' // this is a custom event added to support track change
});

export const CUSTOM_AUDIO_EVENTS = Object.freeze({
  AUDIO_X_STATE: 'AUDIO_X_STATE'
});
