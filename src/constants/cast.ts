import { CastMetaDataType, JoinPolicy } from 'types/cast.types';

declare global {
  interface Window {
    cast: any;
    chrome: any;
  }
}

// ORIGIN_SCOPED - Auto connect from same appId and page origin
// TAB_AND_ORIGIN_SCOPED - Auto connect from same appId, page origin, and tab
// PAGE_SCOPED - No auto connect

const CAST_JOIN_POLICY: JoinPolicy = {
  CUSTOM_CONTROLLER_SCOPED: 'custom_controller_scoped',
  TAB_AND_ORIGIN_SCOPED: 'tab_and_origin_scoped',
  ORIGIN_SCOPED: 'origin_scoped',
  PAGE_SCOPED: 'page_scoped'
};

const DEFAULT_CAST_CONFIG = {
  receiverId: 'CC1AD845',
  joinPolicy: CAST_JOIN_POLICY.ORIGIN_SCOPED as keyof JoinPolicy
};

const CAST_META_DATA: { [key in CastMetaDataType]: number } = {
  GENERIC: 0,
  MOVIE: 1,
  TV_SHOW: 2,
  MUSIC_TRACK: 3,
  PHOTO: 4,
  AUDIOBOOK_CHAPTER: 5
};

export { CAST_JOIN_POLICY, CAST_META_DATA, DEFAULT_CAST_CONFIG };
