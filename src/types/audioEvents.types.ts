import Hls from './hls.js.js';

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
  TRACK_CHANGE: 'trackchange'; // this is a custom event added to support track change
  QUEUE_ENDED: 'queueended'; // this is a custom event added to support end of queue
}

export interface HlsEvents {
  MEDIA_ATTACHING: 'hlsMediaAttaching';
  MEDIA_ATTACHED: 'hlsMediaAttached';
  MEDIA_DETACHING: 'hlsMediaDetaching';
  MEDIA_DETACHED: 'hlsMediaDetached';
  BUFFER_RESET: 'hlsBufferReset';
  BUFFER_CODECS: 'hlsBufferCodecs';
  BUFFER_CREATED: 'hlsBufferCreated';
  BUFFER_APPENDING: 'hlsBufferAppending';
  BUFFER_APPENDED: 'hlsBufferAppended';
  BUFFER_EOS: 'hlsBufferEos';
  BUFFER_FLUSHING: 'hlsBufferFlushing';
  BUFFER_FLUSHED: 'hlsBufferFlushed';
  MANIFEST_LOADING: 'hlsManifestLoading';
  MANIFEST_LOADED: 'hlsManifestLoaded';
  MANIFEST_PARSED: 'hlsManifestParsed';
  LEVEL_SWITCHING: 'hlsLevelSwitching';
  LEVEL_SWITCHED: 'hlsLevelSwitched';
  LEVEL_LOADING: 'hlsLevelLoading';
  LEVEL_LOADED: 'hlsLevelLoaded';
  LEVEL_UPDATED: 'hlsLevelUpdated';
  LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated';
  LEVELS_UPDATED: 'hlsLevelsUpdated';
  AUDIO_TRACKS_UPDATED: 'hlsAudioTracksUpdated';
  AUDIO_TRACK_SWITCHING: 'hlsAudioTrackSwitching';
  AUDIO_TRACK_SWITCHED: 'hlsAudioTrackSwitched';
  AUDIO_TRACK_LOADING: 'hlsAudioTrackLoading';
  AUDIO_TRACK_LOADED: 'hlsAudioTrackLoaded';
  SUBTITLE_TRACKS_UPDATED: 'hlsSubtitleTracksUpdated';
  SUBTITLE_TRACKS_CLEARED: 'hlsSubtitleTracksCleared';
  SUBTITLE_TRACK_SWITCH: 'hlsSubtitleTrackSwitch';
  SUBTITLE_TRACK_LOADING: 'hlsSubtitleTrackLoading';
  SUBTITLE_TRACK_LOADED: 'hlsSubtitleTrackLoaded';
  SUBTITLE_FRAG_PROCESSED: 'hlsSubtitleFragProcessed';
  CUES_PARSED: 'hlsCuesParsed';
  NON_NATIVE_TEXT_TRACKS_FOUND: 'hlsNonNativeTextTracksFound';
  INIT_PTS_FOUND: 'hlsInitPtsFound';
  FRAG_LOADING: 'hlsFragLoading';
  FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted';
  FRAG_LOADED: 'hlsFragLoaded';
  FRAG_DECRYPTED: 'hlsFragDecrypted';
  FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment';
  FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata';
  FRAG_PARSING_METADATA: 'hlsFragParsingMetadata';
  FRAG_PARSED: 'hlsFragParsed';
  FRAG_BUFFERED: 'hlsFragBuffered';
  FRAG_CHANGED: 'hlsFragChanged';
  FPS_DROP: 'hlsFpsDrop';
  FPS_DROP_LEVEL_CAPPING: 'hlsFpsDropLevelCapping';
  ERROR: 'hlsError';
  DESTROYING: 'hlsDestroying';
  KEY_LOADING: 'hlsKeyLoading';
  KEY_LOADED: 'hlsKeyLoaded';
  LIVE_BACK_BUFFER_REACHED: 'hlsLiveBackBufferReached';
  BACK_BUFFER_REACHED: 'hlsBackBufferReached';
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
    audioInstance: HTMLAudioElement,
    playLogEnabled: boolean
  ) => void;
};

export type HlsEventsCallbackMap = {
  [key in keyof Partial<HlsEvents>]: (
    e: Event,
    data: any,
    audioInstance: Hls,
    playLogEnabled: boolean
  ) => void;
};
