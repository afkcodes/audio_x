interface JoinPolicy {
  ORIGIN_SCOPED: string;
  TAB_AND_ORIGIN_SCOPED: string;
  PAGE_SCOPED: string;
  CUSTOM_CONTROLLER_SCOPED: string;
}

type CastMetaDataType =
  | 'GENERIC'
  | 'MOVIE'
  | 'TV_SHOW'
  | 'MUSIC_TRACK'
  | 'PHOTO'
  | 'AUDIOBOOK_CHAPTER';

interface CastMediaArtwork {
  url: string;
  width?: number;
  height?: number;
}

interface GenericMediaTrack {
  title?: string;
  subtitle?: string;
  images?: CastMediaArtwork[];
  releaseDate?: string;
  artist?: string;
  albumName?: string;
}

export { CastMetaDataType, GenericMediaTrack, JoinPolicy };
