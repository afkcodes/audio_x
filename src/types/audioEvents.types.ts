export interface AudioEvents {
  ABORT: 'abort';
  TIME_UPDATE: 'timeupdate';
  CAN_PLAY: 'canplay';
  CAN_PLAY_THROUGH: 'canplaythrough';
  DURATION_CHANGE: 'durationchange';
  ENDED: 'ended';
  EMPTIED: 'emptied';
  PLAYING: 'playing';
  WAITING: 'waiting';
  SEEKING: 'seeking';
  SEEKED: 'seeked';
  LOADED_META_DATA: 'loadedmetadata';
  LOADED_DATA: 'loadeddata';
  PLAY: 'play';
  PAUSE: 'pause';
  RATE_CHANGE: 'ratechange';
  VOLUME_CHANGE: 'volumechange';
  SUSPEND: 'suspend';
  STALLED: 'stalled';
  PROGRESS: 'progress';
  LOAD_START: 'loadstart';
  ERROR: 'error';
}

export interface CustomAudioState {
  AUDIO_X_STATE: 'AUDIO_X_STATE';
}

export type EventListenersList =
  | Array<keyof AudioEvents>
  | Array<keyof CustomAudioState>;

export type EventListenerCallbackMap = {
  [key in keyof Partial<AudioEvents>]: (
    e: Event,
    audioInstance: HTMLAudioElement
  ) => void;
};
