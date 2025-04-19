interface Window {
  cast?: typeof cast;
  chrome?: {
    cast: typeof chrome.cast;
  };
  __gCastApiAvailable?: (isAvailable: boolean) => void;
}

declare namespace chrome.cast {
  interface Error {
    code: number;
    description: string;
  }

  interface CastDevice {
    friendlyName: string;
    capabilities: string[];
    deviceId: string;
    ipAddress?: string;
    modelName?: string;
  }

  namespace media {
    enum PlayerState {
      IDLE = 'IDLE',
      PLAYING = 'PLAYING',
      PAUSED = 'PAUSED',
      BUFFERING = 'BUFFERING',
    }

    enum IdleReason {
      CANCELLED = 'CANCELLED',
      INTERRUPTED = 'INTERRUPTED',
      FINISHED = 'FINISHED',
      ERROR = 'ERROR',
    }

    enum StreamType {
      BUFFERED = 'BUFFERED',
      LIVE = 'LIVE',
    }

    interface MediaInfo {
      contentId: string;
      contentType: string;
      metadata?: any;
      streamType?: StreamType;
      duration?: number;
      customData?: any;
    }

    interface MusicTrackMediaMetadata {
      title?: string;
      artist?: string;
      albumName?: string;
      images?: Array<{ url: string }>;
    }

    interface LoadRequest {
      autoplay: boolean;
      currentTime?: number;
      customData?: any;
    }

    interface QueueItem {
      itemId: number;
      media: MediaInfo;
    }

    interface QueueLoadRequest {
      items: QueueItem[];
      startIndex: number;
      autoplay: boolean;
    }
  }
}
declare namespace cast {
  namespace framework {
    enum SessionState {
      NO_SESSION = 'NO_SESSION',
      SESSION_STARTING = 'SESSION_STARTING',
      SESSION_STARTED = 'SESSION_STARTED',
      SESSION_START_FAILED = 'SESSION_START_FAILED',
      SESSION_ENDING = 'SESSION_ENDING',
      SESSION_ENDED = 'SESSION_ENDED',
      SESSION_RESUMED = 'SESSION_RESUMED',
    }

    // Update CastContext to be a class
    class CastContext {
      static getInstance(): CastContext;
      addEventListener: (eventType: string, listener: (event: any) => void) => void;
      removeEventListener: (eventType: string, listener: (event: any) => void) => void;
      setOptions: (options: CastOptions) => void;
      getCurrentSession: () => CastSession | null;
      requestSession: () => Promise<void>;
    }

    interface CastOptions {
      receiverApplicationId: string;
      autoJoinPolicy: string;
      resumeSavedSession?: boolean;
    }

    interface CastSession {
      getMediaSession: () => chrome.cast.media.MediaSession | null;
      loadMedia: (request: chrome.cast.media.LoadRequest) => Promise<void>;
      queueLoad: (request: chrome.cast.media.QueueLoadRequest) => Promise<void>;
      endSession: (stopCasting: boolean) => void;
      getCastDevice: () => chrome.cast.CastDevice | null;
    }

    // Include RemotePlayer and RemotePlayerController (from previous response)
    class RemotePlayer {
      constructor();
      isConnected: boolean;
      isMediaLoaded: boolean;
      playerState: chrome.cast.media.PlayerState;
      currentTime: number;
      duration: number;
      volumeLevel: number;
      canControlVolume: boolean;
      canSeek: boolean;
      isMuted: boolean;
      isPaused: boolean;
    }

    class RemotePlayerController {
      constructor(remotePlayer: RemotePlayer);
      addEventListener: (eventType: string, listener: () => void) => void;
      removeEventListener: (eventType: string, listener: () => void) => void;
      playOrPause: () => void;
      seek: () => void;
      setVolumeLevel: () => void;
      muteOrUnmute: () => void;
    }
  }
}

declare namespace chrome.cast.media {
  interface MediaSession {
    media?: MediaInfo;
    currentQueueItemId?: number;
    status?: any;
    idleReason?: IdleReason;
    getQueueItems: () => QueueItem[];
  }

  class MediaInfo {
    constructor(contentId: string, contentType: string);
    contentId: string;
    contentType: string;
    metadata?: any; // Make this optional to match the interface
  }

  class MusicTrackMediaMetadata {
    constructor();
    title?: string;
    artist?: string;
    albumName?: string;
    images?: Array<{ url: string }>;
  }

  class LoadRequest {
    constructor(mediaInfo: MediaInfo);
    autoplay: boolean;
    currentTime?: number;
  }

  class QueueItem {
    constructor(mediaInfo: MediaInfo);
    itemId: number;
    media: MediaInfo;
  }

  class QueueLoadRequest {
    constructor(items: QueueItem[]);
    startIndex: number;
    autoplay: boolean;
  }
}
