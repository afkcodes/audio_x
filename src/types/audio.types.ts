export type InitMode = 'REACT' | 'VANILLA';
export type PlaybackRate = 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.5 | 3.0;
export type Preload = 'none' | 'metadata' | 'auto' | '';

export type MediaArtwork = { src: string; name?: string; sizes?: string };
export interface MediaTrack {
  title: string;
  source: string;
  artwork?: MediaArtwork[];
  duration?: number;
  genre?: string;
  album?: string;
  comment?: string;
  year?: number | string;
  artist?: string;
}

export interface AudioInit {
  mediaTrack: MediaTrack;
  mode: InitMode;
  preloadStrategy?: Preload;
  playbackRate?: PlaybackRate;
  attachMediaSessionHandlers?: boolean;
  attachAudioEventListeners?: boolean;
}
