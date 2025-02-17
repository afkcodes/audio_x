import { HlsConfig } from 'types/hls.js';
import { EventListenerCallbackMap } from './audioEvents.types';

export type InitMode = 'REACT' | 'VANILLA';
export type PlaybackRate = 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.5 | 3.0;
export type Preload = 'none' | 'metadata' | 'auto' | '';
export type PlayBackState =
  | 'idle'
  | 'playing'
  | 'ended'
  | 'ready'
  | 'paused'
  | 'stalled'
  | 'error'
  | 'buffering'
  | 'trackchanged'
  | 'durationchanged'
  | 'queueended';

export type MediaArtwork = { src: string; name?: string; sizes?: string };
export interface MediaTrack {
  id: string;
  title: string;
  source: string;
  artwork: MediaArtwork[] | null;
  duration?: number;
  genre?: string;
  album?: string;
  comment?: string;
  year?: number | string;
  artist?: string;
}

export interface AudioInit {
  mode: InitMode;
  useDefaultEventListeners: boolean;
  showNotificationActions?: boolean;
  preloadStrategy?: Preload;
  playbackRate?: PlaybackRate;
  customEventListeners?: EventListenerCallbackMap | null;
  autoPlay?: boolean;
  enablePlayLog?: boolean;
  enableHls?: boolean;
  enableEQ?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials' | null;
  hlsConfig?: HlsConfig | {};
}

export interface AudioError {
  code: number | string | null;
  message: string;
  readable: string;
}

export interface AudioState {
  playbackState: PlayBackState;
  duration: number | undefined;
  bufferedDuration: number;
  progress: number | undefined;
  volume: number;
  playbackRate: PlaybackRate;
  error: AudioError;
  currentTrack: MediaTrack;
  currentTrackPlayTime: number;
  previousTrackPlayTime: number;
}

export type QueuePlaybackType = 'DEFAULT' | 'REVERSE' | 'SHUFFLE';
export type LoopMode = 'SINGLE' | 'QUEUE' | 'OFF';
