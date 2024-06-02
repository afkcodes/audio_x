const CAST_REMOTE_PLAYER_EVENTS = {
  ANY_CHANGE: 'anyChanged',
  IS_CONNECTED_CHANGED: 'isConnectedChanged',
  IS_MEDIA_LOADED_CHANGED: 'isMediaLoadedChanged',
  QUEUE_DATA_CHANGED: 'queueDataChanged',
  VIDEO_INFO_CHANGED: 'videoInfoChanged',
  DURATION_CHANGED: 'durationChanged',
  CURRENT_TIME_CHANGED: 'currentTimeChanged',
  IS_PAUSED_CHANGED: 'isPausedChanged',
  VOLUME_LEVEL_CHANGED: 'volumeLevelChanged',
  CAN_CONTROL_VOLUME_CHANGED: 'canControlVolumeChanged',
  IS_MUTED_CHANGED: 'isMutedChanged',
  CAN_PAUSE_CHANGED: 'canPauseChanged',
  CAN_SEEK_CHANGED: 'canSeekChanged',
  DISPLAY_NAME_CHANGED: 'displayNameChanged',
  STATUS_TEXT_CHANGED: 'statusTextChanged',
  TITLE_CHANGED: 'titleChanged',
  DISPLAY_STATUS_CHANGED: 'displayStatusChanged',
  MEDIA_INFO_CHANGED: 'mediaInfoChanged',
  IMAGE_URL_CHANGED: 'imageUrlChanged',
  PLAYER_STATE_CHANGED: 'playerStateChanged',
  IS_PLAYING_BREAK_CHANGED: 'isPlayingBreakChanged',
  NUMBER_BREAK_CLIPS_CHANGED: 'numberBreakClipsChanged',
  CURRENT_BREAK_CLIP_NUMBER_CHANGED: 'currentBreakClipNumberChanged',
  CURRENT_BREAK_TIME_CHANGED: 'currentBreakTimeChanged',
  CURRENT_BREAK_CLIP_TIME_CHANGED: 'currentBreakClipTimeChanged',
  BREAK_ID_CHANGED: 'breakIdChanged',
  BREAK_CLIP_ID_CHANGED: 'breakClipIdChanged',
  WHEN_SKIPPABLE_CHANGED: 'whenSkippableChanged',
  LIVE_SEEKABLE_RANGE_CHANGED: 'liveSeekableRangeChanged'
};

const CAST_SESSION_EVENTS = {
  APPLICATION_STATUS_CHANGED: 'applicationstatuschanged',
  APPLICATION_METADATA_CHANGED: 'applicationmetadatachanged',
  ACTIVE_INPUT_STATE_CHANGED: 'activeinputstatechanged',
  VOLUME_CHANGED: 'volumechanged',
  MEDIA_SESSION: 'mediasession'
};

const CAST_CONTEXT_STATE = {
  CAST_STATE_CHANGED: 'caststatechanged',
  SESSION_STATE_CHANGED: 'sessionstatechanged'
};

export { CAST_CONTEXT_STATE, CAST_REMOTE_PLAYER_EVENTS, CAST_SESSION_EVENTS };
