import { AudioX } from 'audio';
import { CAST_JOIN_POLICY, DEFAULT_CAST_CONFIG } from 'constants/cast';
import { PLAYBACK_STATE, URLS } from 'constants/common';
import { CAST_CONTEXT_STATE, CAST_REMOTE_PLAYER_EVENTS } from 'events/castEvents';
import { isValidWindow, loadScript } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import type { JoinPolicy, MediaTrack } from 'types';

/**
 * The CastAdapter class manages interactions with the Google Cast SDK,
 * allowing audio to be cast to devices like Chromecast.
 */
class CastAdapter {
  private static _instance: CastAdapter | null = null;
  private castContext: any | null = null;
  private chromeCast: any | null = null;
  private remotePlayer: any | null = null;
  private remotePlayerController: any | null = null;
  private isInitialized = false;
  private castButtonId = 'cast-button-container';
  private sessionStateListener: ((event: any) => void) | null = null;
  private remotePlayerListeners: { [key: string]: () => void } = {};

  /**
   * Create a CastAdapter instance (singleton pattern).
   */
  constructor() {
    if (CastAdapter._instance) {
      // biome-ignore lint/correctness/noConstructorReturn: <explanation>
      return CastAdapter._instance;
    }
    CastAdapter._instance = this;
  }

  /**
   * Load the Google Cast SDK.
   * @param retryCount - Current retry attempt count
   * @param maxRetries - Maximum number of retries
   * @param retryDelay - Delay between retries in milliseconds
   * @returns Promise resolving to the cast context if successful
   */
  async load(retryCount = 0, maxRetries = 15, retryDelay = 500): Promise<any | null> {
    try {
      // Check if Cast API is already available
      if (typeof window !== 'undefined' && window.cast && window.cast.framework) {
        console.log('Cast framework already available');
        return this.getCastContext();
      }

      // Define callback for when Cast API becomes available
      window.__gCastApiAvailable = (isAvailable: boolean) => {
        if (isAvailable) {
          console.log('Cast API is now available');
          this.initializeCastApi();
        } else {
          console.error('Cast API not available in browser');
        }
      };

      // Load the Cast SDK script if not already loaded
      const scriptElement = document.querySelector('script[src*="cast_sender"]');
      if (!scriptElement) {
        await loadScript(
          URLS.CAST,
          () => {
            console.log('Cast framework script loaded');
          },
          'cast',
          true,
        );
      } else {
        console.log('Cast script tag already exists in document');
      }

      // Wait for script to initialize
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Check if Cast API is available after loading
      if (typeof window !== 'undefined' && window.cast && window.cast.framework) {
        console.log('Cast framework detected after script load');
        return this.getCastContext();
      }

      // Retry if needed
      if (retryCount < maxRetries) {
        console.log(
          `Cast framework not ready. Retrying in ${retryDelay}ms... (${
            retryCount + 1
          }/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.load(retryCount + 1, maxRetries, retryDelay);
      }

      throw new Error(`Failed to initialize Cast framework after ${maxRetries} retries.`);
    } catch (error) {
      console.error('Error loading Cast framework:', error);
      throw error;
    }
  }

  /**
   * Initialize the Cast API with the specified configuration.
   * @param receiverId - The Cast receiver application ID
   * @param joinPolicy - The Cast session join policy
   * @returns Promise resolving to the cast context or undefined
   */
  async init(
    receiverId: string = DEFAULT_CAST_CONFIG.receiverId,
    joinPolicy: keyof JoinPolicy = DEFAULT_CAST_CONFIG.joinPolicy,
  ): Promise<any | undefined> {
    try {
      if (this.isInitialized) {
        console.warn('Cast framework is already initialized.');
        return this.castContext ?? undefined;
      }

      // Load the Cast SDK
      try {
        const context = await this.load();
        if (!context) {
          throw new Error('Failed to get Cast context');
        }
        this.castContext = context;
      } catch (e) {
        console.error('Failed to load Cast framework:', e);
        return undefined;
      }

      // Mark as initialized and set up options
      this.isInitialized = true;

      try {
        // Set up Cast options
        this.castContext.setOptions({
          receiverApplicationId: receiverId,
          autoJoinPolicy: CAST_JOIN_POLICY[joinPolicy],
          resumeSavedSession: true,
        });

        // Initialize the Remote player
        this.initializeRemotePlayer();

        // Set up session state listener
        this.setupSessionListener();

        console.log('Cast framework initialized successfully');
        return this.castContext;
      } catch (error) {
        console.error('Error configuring Cast framework:', error);
        this.isInitialized = false;
        return undefined;
      }
    } catch (error) {
      console.error('Error initializing Cast:', error);
      this.isInitialized = false;
      return undefined;
    }
  }

  /**
   * Get the Cast context, initializing it if necessary.
   * @returns The Cast context or null if not available
   */
  private getCastContext(): any | null {
    if (!this.castContext && typeof window !== 'undefined') {
      try {
        if (isValidWindow && window.cast?.framework) {
          this.castContext = window.cast.framework.CastContext.getInstance();
          this.chromeCast = window.chrome.cast;
          return this.castContext;
        }
        console.warn('Cast framework not loaded yet');
        return null;
      } catch (e) {
        console.error('Failed to get cast context:', e);
        return null;
      }
    }
    return this.castContext;
  }

  /**
   * Initialize the Cast API.
   */
  private initializeCastApi(): void {
    try {
      this.getCastContext();
      console.log('Cast API initialized successfully');
    } catch (e) {
      console.error('Failed to initialize Cast API:', e);
    }
  }

  /**
   * Create a cast button in the specified container using <google-cast-launcher>.
   * @param containerId - The ID of the HTML element to contain the button
   */
  createCastButton(containerId: string = this.castButtonId): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Cast button container #${containerId} not found`);
      return;
    }

    try {
      // Clear any existing content
      container.innerHTML = '';

      // Create google-cast-launcher element
      const button = document.createElement('google-cast-launcher');
      button.className = 'cast-button';
      container.appendChild(button);

      console.log('Cast button created successfully');
    } catch (e) {
      console.error('Failed to create cast button:', e);
    }
  }

  /**
   * Setup the Cast session state change listener.
   */
  private setupSessionListener(): void {
    if (!this.castContext) {
      console.error('Cast framework not initialized');
      return;
    }

    // Remove existing listener if any
    if (this.sessionStateListener) {
      this.castContext.removeEventListener(
        CAST_CONTEXT_STATE.SESSION_STATE_CHANGED,
        this.sessionStateListener,
      );
    }

    // Create and register new listener
    this.sessionStateListener = (event: any) => {
      console.log('Cast session state changed:', event.sessionState);
      if (!isValidWindow) {
        console.log(
          'no valid window context, returning :: CAST::setupSessionListener::sessionStateListener',
        );
        return;
      }

      switch (event.sessionState) {
        case window.cast.framework.SessionState.SESSION_STARTED:
          this.onCastSessionStarted();
          break;
        case window.cast.framework.SessionState.SESSION_RESUMED:
          this.onCastSessionResumed();
          break;
        case window.cast.framework.SessionState.SESSION_ENDED:
          this.onCastSessionEnded();
          break;
      }
    };

    this.castContext.addEventListener(
      CAST_CONTEXT_STATE.SESSION_STATE_CHANGED,
      this.sessionStateListener,
    );
  }

  /**
   * Handler for when a cast session starts.
   */
  private onCastSessionStarted(): void {
    console.log('Cast session started');

    const session = this.getCastSession();
    if (session) {
      this.setupRemotePlayer();

      // Notify state change
      ChangeNotifier.notify('CAST_STATE', {
        isCasting: true,
        castSession: session,
      });

      // Load current track if available
      const audio = AudioX.getInstance();
      const audioState = audio.getAudioState();
      if (audioState.currentTrack) {
        this.loadMedia(audioState.currentTrack);
      }
    }
  }

  /**
   * Handler for when a cast session is resumed.
   */
  private onCastSessionResumed(): void {
    console.log('Cast session resumed');

    const session = this.getCastSession();
    if (session) {
      this.setupRemotePlayer();

      // Notify state change
      ChangeNotifier.notify('CAST_STATE', {
        isCasting: true,
        castSession: session,
      });
    }
  }

  /**
   * Handler for when a cast session ends.
   */
  private onCastSessionEnded(): void {
    console.log('Cast session ended');

    // Cleanup remote player listeners
    this.cleanupRemotePlayerListeners();

    // Notify state change
    ChangeNotifier.notify('CAST_STATE', {
      isCasting: false,
      castSession: null,
    });
  }

  /**
   * Initialize the remote player and controller.
   */
  private initializeRemotePlayer(): void {
    if ((isValidWindow && !window.cast) || !window.cast.framework) {
      console.error('Cast framework not available');
      return;
    }

    this.remotePlayer = new window.cast.framework.RemotePlayer();
    this.remotePlayerController = new window.cast.framework.RemotePlayerController(
      this.remotePlayer,
    );
  }

  /**
   * Set up the remote player with event listeners.
   */
  private setupRemotePlayer(): void {
    if (!this.remotePlayerController) {
      this.initializeRemotePlayer();
    }

    // Clean up any existing listeners
    this.cleanupRemotePlayerListeners();

    // Add listeners for remote player events
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.IS_CONNECTED_CHANGED,
      this.onConnectedChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.IS_MEDIA_LOADED_CHANGED,
      this.onMediaLoaded.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.PLAYER_STATE_CHANGED,
      this.onPlayerStateChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.CURRENT_TIME_CHANGED,
      this.onCurrentTimeChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.DURATION_CHANGED,
      this.onDurationChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.VOLUME_LEVEL_CHANGED,
      this.onVolumeLevelChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.MEDIA_INFO_CHANGED,
      this.onMediaInfoChanged.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.QUEUE_ITEM_ENDED,
      this.onQueueItemEnded.bind(this),
    );
    this.addRemotePlayerListener(
      CAST_REMOTE_PLAYER_EVENTS.QUEUE_ENDED,
      this.onQueueEnded.bind(this),
    );
  }

  /**
   * Add a listener for a remote player event.
   * @param eventType - The type of event to listen for
   * @param callback - The callback function
   */
  private addRemotePlayerListener(eventType: string, callback: () => void): void {
    if (!this.remotePlayerController) {
      console.error('Remote player controller not initialized');
      return;
    }

    this.remotePlayerController.addEventListener(eventType, callback);
    this.remotePlayerListeners[eventType] = callback;
  }

  /**
   * Clean up all remote player listeners.
   */
  private cleanupRemotePlayerListeners(): void {
    if (!this.remotePlayerController) return;

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(this.remotePlayerListeners).forEach(([eventType, callback]) => {
      this.remotePlayerController!.removeEventListener(eventType, callback as any);
    });

    this.remotePlayerListeners = {};
  }

  /**
   * Handler for remote player connected state changes.
   */
  private onConnectedChanged(): void {
    console.log('Cast connection state changed:', this.remotePlayer?.isConnected);
  }

  /**
   * Handler for remote player media loaded state changes.
   */
  private onMediaLoaded(): void {
    console.log('Cast media loaded state changed:', this.remotePlayer?.isMediaLoaded);
  }

  /**
   * Handler for remote player state changes.
   */
  private onPlayerStateChanged(): void {
    console.log('Cast player state changed:', this.remotePlayer?.playerState);

    let playbackState: string | undefined;
    if (!isValidWindow) {
      console.log('no valid window context, returning :: CAST::onPlayerStateChanged');
      return;
    }

    // Map Cast player states to our playback states
    switch (this.remotePlayer?.playerState) {
      case window.chrome.cast.media.PlayerState.PLAYING:
        playbackState = PLAYBACK_STATE.PLAYING;
        break;
      case window.chrome.cast.media.PlayerState.PAUSED:
        playbackState = PLAYBACK_STATE.PAUSED;
        break;
      case window.chrome.cast.media.PlayerState.BUFFERING:
        playbackState = PLAYBACK_STATE.BUFFERING;
        break;
      case window.chrome.cast.media.PlayerState.IDLE: {
        const session = this.getCastSession();
        const mediaSession = session?.getMediaSession();
        const idleReason = mediaSession?.idleReason;

        switch (idleReason) {
          case window.chrome.cast.media.IdleReason.FINISHED:
            playbackState = PLAYBACK_STATE.ENDED;
            console.log(
              mediaSession?.media?.streamType === window.chrome.cast.media.StreamType.LIVE
                ? 'Live stream has ended'
                : 'Track has ended',
            );
            break;
          case window.chrome.cast.media.IdleReason.ERROR:
            playbackState = PLAYBACK_STATE.ERROR;
            console.error('Playback error occurred');
            break;
          case window.chrome.cast.media.IdleReason.INTERRUPTED:
            // Check if interruption is due to a new track
            if (mediaSession?.media && this.isMediaLoaded()) {
              playbackState = PLAYBACK_STATE.TRACK_CHANGE;
              console.log('Playback interrupted due to new track');
            } else {
              playbackState = PLAYBACK_STATE.INTERRUPTED;
              console.log('Playback interrupted (e.g., another sender)');
            }
            break;
          default:
            playbackState = PLAYBACK_STATE.IDLE;
            console.log('Player is idle with unknown reason');
        }
        break;
      }
    }

    if (playbackState) {
      console.log('CAST: Notifying state change to:', playbackState);
      ChangeNotifier.notify('AUDIO_STATE', {
        playbackState,
        error:
          playbackState === PLAYBACK_STATE.ERROR
            ? {
                message:
                  this.getCastSession()?.getMediaSession()?.status?.errorCode || 'Unknown error',
              }
            : undefined,
      });

      // // Handle track completion
      // if (playbackState === PLAYBACK_STATE.ENDED) {
      //   const audio = AudioX.getInstance();
      //   const nextTrack = audio.getNextTrack(); // Assume AudioX has this method
      //   if (nextTrack) {
      //     this.playNext(nextTrack);
      //   } else {
      //     console.log('No next track available');
      //   }
      // }
    }
  }

  /**
   * Handler for remote player current time changes.
   */
  private onCurrentTimeChanged(): void {
    ChangeNotifier.notify('AUDIO_STATE', {
      progress: this.remotePlayer?.currentTime,
    });
  }

  /**
   * Handler for remote player duration changes.
   */
  private onDurationChanged(): void {
    ChangeNotifier.notify('AUDIO_STATE', {
      duration: this.remotePlayer?.duration,
    });
  }

  /**
   * Handler for remote player volume changes.
   */
  private onVolumeLevelChanged(): void {
    // Scale from 0-1 to 0-100
    const volume = Math.round((this.remotePlayer?.volumeLevel ?? 0) * 100);

    ChangeNotifier.notify('AUDIO_STATE', {
      volume,
    });
  }

  /**
   * Handler for media info changes.
   */
  private onMediaInfoChanged(): void {
    const session = this.getCastSession();
    const mediaSession = session?.getMediaSession();
    if (mediaSession) {
      console.log('Media info changed:', mediaSession.media);
      ChangeNotifier.notify('AUDIO_STATE', {
        mediaInfo: mediaSession.media,
      });
    }
  }

  /**
   * Handler for queue item ended.
   */
  private onQueueItemEnded(): void {
    console.log('Queue item ended');
    const session = this.getCastSession();
    const mediaSession = session?.getMediaSession();
    const currentItemId = mediaSession?.currentQueueItemId;
    const queue = mediaSession?.getQueueItems();

    if (queue && currentItemId !== undefined) {
      const currentIndex = queue.findIndex((item: any) => item.itemId === currentItemId);
      const nextTrack = queue[currentIndex + 1]?.media;
      if (nextTrack) {
        console.log(`Moving to next track in queue: ${nextTrack.metadata.title}`);
        ChangeNotifier.notify('AUDIO_STATE', {
          playbackState: PLAYBACK_STATE.PLAYING,
          currentTrack: {
            title: nextTrack.metadata.title,
            artist: nextTrack.metadata.artist,
            album: nextTrack.metadata.albumName,
            source: nextTrack.contentId,
          },
        });
      }
    }
  }

  /**
   * Handler for queue ended.
   */
  private onQueueEnded(): void {
    console.log('Queue ended');
    ChangeNotifier.notify('AUDIO_STATE', {
      playbackState: PLAYBACK_STATE.ENDED,
      queue: [],
    });
  }

  /**
   * Start casting the current audio.
   */
  castAudio(): void {
    if (!this.isInitialized) {
      console.error('Cast framework not initialized');
      return;
    }

    const session = this.getCastSession();

    if (session) {
      // Session exists, load media directly
      this.loadCurrentMedia();
    } else {
      // Request a new session
      this.requestSession();
    }
  }

  /**
   * Request a new cast session.
   */
  private requestSession(): void {
    if (!this.castContext) {
      console.error('Cast context not available');
      return;
    }

    this.castContext
      .requestSession()
      .then(() => {
        console.log('Cast session requested successfully');
      })
      .catch((error: any) => {
        console.error('Error requesting cast session:', error);
      });
  }

  /**
   * Load the current media on the cast device.
   */
  private loadCurrentMedia(): void {
    const audio = AudioX.getInstance();
    const audioState = audio.getAudioState();

    if (audioState.currentTrack) {
      this.loadMedia(audioState.currentTrack);
    } else {
      console.warn('No current track to cast');
    }
  }

  /**
   * Create cast media info from a media track.
   * @param mediaTrack - The media track to cast
   * @returns The created media info object
   */
  private createCastMedia(mediaTrack: MediaTrack): any | null {
    try {
      if (!this.chromeCast) {
        console.error('Chrome Cast API not available');
        return null;
      }

      // Determine content type based on source URL
      let contentType = 'audio/mp3';
      if (mediaTrack.source.includes('.m3u8')) {
        contentType = 'application/x-mpegURL';
      } else if (mediaTrack.source.includes('.mp4')) {
        contentType = 'audio/mp4';
      } else if (mediaTrack.source.includes('.wav')) {
        contentType = 'audio/wav';
      } else if (mediaTrack.source.includes('.ogg')) {
        contentType = 'audio/ogg';
      }

      // Create media info
      const mediaInfo = new this.chromeCast.media.MediaInfo(mediaTrack.source, contentType);

      // Set metadata
      mediaInfo.metadata = new this.chromeCast.media.MusicTrackMediaMetadata();
      mediaInfo.metadata.title = mediaTrack.title || 'Unknown Title';
      mediaInfo.metadata.artist = mediaTrack.artist || 'Unknown Artist';
      mediaInfo.metadata.albumName = mediaTrack.album || 'Unknown Album';

      // Add artwork if available
      if (mediaTrack.artwork && mediaTrack.artwork.length > 0) {
        mediaInfo.metadata.images = [
          {
            url: mediaTrack.artwork[0].src,
          },
        ];
      }

      return mediaInfo;
    } catch (error) {
      console.error('Error creating cast media:', error);
      return null;
    }
  }

  /**
   * Load a media track on the cast device.
   * @param mediaTrack - The media track to load
   */
  loadMedia(mediaTrack: MediaTrack): void {
    const session = this.getCastSession();

    if (!session) {
      console.error('No active cast session');
      return;
    }

    const mediaInfo = this.createCastMedia(mediaTrack);

    if (!mediaInfo) {
      console.error('Failed to create media info');
      return;
    }

    // Get current state to determine if we should auto-play
    const audio = AudioX.getInstance();
    const audioState = audio.getAudioState();
    const autoplay = audioState.playbackState === PLAYBACK_STATE.PLAYING;

    // Create load request
    const request = new this.chromeCast!.media.LoadRequest(mediaInfo);
    request.autoplay = autoplay;

    // Set current playback position if needed
    if (audioState.progress && audioState.progress > 0) {
      request.currentTime = audioState.progress;
    }

    // Load the media
    session
      .loadMedia(request)
      .then(() => {
        console.log('Media loaded successfully on cast device');

        // Update audio state
        ChangeNotifier.notify('AUDIO_STATE', {
          currentTrack: mediaTrack,
        });
      })
      .catch((error: any) => {
        console.error('Error loading media on cast device:', error);
      });
  }

  /**
   * Load a queue of tracks on the cast device.
   * @param tracks - Array of media tracks to queue
   * @param startIndex - Index of the track to start with
   */
  loadQueue(tracks: MediaTrack[], startIndex = 0): void {
    const session = this.getCastSession();
    if (!session) {
      console.error('No active cast session');
      return;
    }

    const queueItems = tracks.map((track) => {
      const mediaInfo = this.createCastMedia(track);
      return new this.chromeCast!.media.QueueItem(mediaInfo);
    });

    const queueLoadRequest = new this.chromeCast!.media.QueueLoadRequest(queueItems);
    queueLoadRequest.startIndex = startIndex;
    queueLoadRequest.autoplay = true;

    session
      .queueLoad(queueLoadRequest)
      .then(() => {
        console.log('Queue loaded successfully on cast device');
        ChangeNotifier.notify('AUDIO_STATE', {
          currentTrack: tracks[startIndex],
          playbackState: PLAYBACK_STATE.PLAYING,
          queue: tracks,
        });
      })
      .catch((error: any) => {
        console.error('Error loading queue on cast device:', error);
      });
  }

  /**
   * Play the current media on the cast device.
   */
  play(): void {
    if (this.remotePlayerController && this.remotePlayer?.isMediaLoaded) {
      this.remotePlayerController.playOrPause();
    }
  }

  /**
   * Pause the current media on the cast device.
   */
  pause(): void {
    if (this.remotePlayerController && this.remotePlayer?.isMediaLoaded) {
      this.remotePlayerController.playOrPause();
    }
  }

  /**
   * Play the next track on the cast device.
   * @param nextTrack - The next track to play
   */
  playNext(nextTrack: MediaTrack): void {
    if (!this.isConnected() || !this.isMediaLoaded()) {
      console.warn('Not currently casting or no media loaded');
      return;
    }

    if (!nextTrack) {
      console.warn('No next track provided');
      return;
    }

    // Create media info for the next track
    const mediaInfo = this.createCastMedia(nextTrack);
    if (!mediaInfo) {
      console.error('Failed to create media info for next track');
      return;
    }

    // Create load request with autoplay
    const request = new this.chromeCast!.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    // Load the next track
    const session = this.getCastSession();
    if (session) {
      session
        .loadMedia(request)
        .then(() => {
          console.log(`Playing next track "${nextTrack.title}" on cast device`);

          // Update audio state
          ChangeNotifier.notify('AUDIO_STATE', {
            playbackState: PLAYBACK_STATE.PLAYING,
            currentTrack: nextTrack,
          });
        })
        .catch((error: any) => {
          console.error('Error loading next track on cast device:', error);
        });
    }
  }

  /**
   * Play the previous track on the cast device.
   * @param previousTrack - The previous track to play
   */
  playPrevious(previousTrack: MediaTrack): void {
    if (!this.isConnected() || !this.isMediaLoaded()) {
      console.warn('Not currently casting or no media loaded');
      return;
    }

    if (!previousTrack) {
      console.warn('No previous track provided');
      return;
    }

    // Create media info for the previous track
    const mediaInfo = this.createCastMedia(previousTrack);
    if (!mediaInfo) {
      console.error('Failed to create media info for previous track');
      return;
    }

    // Create load request with autoplay
    const request = new this.chromeCast!.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    // Load the previous track
    const session = this.getCastSession();
    if (session) {
      session
        .loadMedia(request)
        .then(() => {
          console.log(`Playing previous track "${previousTrack.title}" on cast device`);

          // Update audio state
          ChangeNotifier.notify('AUDIO_STATE', {
            playbackState: PLAYBACK_STATE.PLAYING,
            currentTrack: previousTrack,
          });
        })
        .catch((error: any) => {
          console.error('Error loading previous track on cast device:', error);
        });
    }
  }

  /**
   * Load and play a track on the cast device.
   * @param track - The track to play
   * @param autoPlay - Whether to auto-play the track
   */
  loadAndPlayTrack(track: MediaTrack, autoPlay = true): Promise<void> {
    console.log('CAST_TEST:: loadAndPlayTrack', track);
    ChangeNotifier.notify('AUDIO_STATE', {
      playbackState: PLAYBACK_STATE.TRACK_CHANGE,
      currentTrack: track,
    });
    return new Promise((resolve, reject) => {
      const session = this.getCastSession();
      if (!session) {
        reject(new Error('No active cast session'));
        return;
      }

      const mediaInfo = this.createCastMedia(track);
      if (!mediaInfo) {
        reject(new Error('Failed to create media info'));
        return;
      }

      const request = new this.chromeCast!.media.LoadRequest(mediaInfo);
      request.autoplay = autoPlay;

      session
        .loadMedia(request)
        .then(() => {
          console.log(`Successfully loaded track "${track.title}" on cast device`);

          // Update audio state
          ChangeNotifier.notify('AUDIO_STATE', {
            playbackState: autoPlay ? PLAYBACK_STATE.PLAYING : PLAYBACK_STATE.PAUSED,
            currentTrack: track,
          });

          resolve();
        })
        .catch((error: any) => {
          console.error('Error loading track on cast device:', error);
          reject(error);
        });
    });
  }

  /**
   * Seek to a specific time in the media on the cast device.
   * @param time - The time to seek to (in seconds)
   */
  seek(time: number): void {
    if (this.remotePlayerController && this.remotePlayer?.isMediaLoaded) {
      this.remotePlayer.currentTime = time;
      this.remotePlayerController.seek();
    }
  }

  /**
   * Set the volume on the cast device.
   * @param volume - The volume level (0-100)
   */
  setVolume(volume: number): void {
    if (this.remotePlayerController) {
      // Convert from 0-100 to 0-1
      this.remotePlayer!.volumeLevel = volume / 100;
      this.remotePlayerController.setVolumeLevel();
    }
  }

  /**
   * Stop casting and disconnect from the cast device.
   */
  stopCasting(): void {
    const session = this.getCastSession();

    if (session) {
      session.endSession(true);
    }
  }

  /**
   * Clean up CastAdapter resources.
   */
  destroy(): void {
    // Remove session state listener
    if (this.sessionStateListener && this.castContext) {
      this.castContext.removeEventListener(
        CAST_CONTEXT_STATE.SESSION_STATE_CHANGED,
        this.sessionStateListener,
      );
    }

    // Clean up remote player listeners
    this.cleanupRemotePlayerListeners();

    // Remove Cast script
    const scriptElement = document.querySelector('script[src*="cast_sender"]');
    if (scriptElement) {
      scriptElement.remove();
    }

    // Reset state
    this.castContext = null;
    this.chromeCast = null;
    this.remotePlayer = null;
    this.remotePlayerController = null;
    this.isInitialized = false;
    this.sessionStateListener = null;
    CastAdapter._instance = null;

    console.log('CastAdapter destroyed');
  }

  /**
   * Get the current cast session.
   * @returns The current cast session or null if none exists
   */
  getCastSession(): any | null {
    if (!this.castContext) {
      return null;
    }

    try {
      return this.castContext.getCurrentSession();
    } catch (error) {
      console.error('Error getting cast session:', error);
      return null;
    }
  }

  /**
   * Check if currently connected to a cast device.
   * @returns True if connected, false otherwise
   */
  isConnected(): boolean {
    return this.remotePlayer ? this.remotePlayer.isConnected : false;
  }

  /**
   * Check if media is currently loaded on the cast device.
   * @returns True if media is loaded, false otherwise
   */
  isMediaLoaded(): boolean {
    return this.remotePlayer ? this.remotePlayer.isMediaLoaded : false;
  }

  /**
   * Get the current playback state on the cast device.
   * @returns The current playback state
   */
  getPlayerState(): string {
    return this.remotePlayer ? this.remotePlayer.playerState : '';
  }

  /**
   * Get the remote player instance.
   * @returns The remote player instance
   */
  getRemotePlayer(): any | null {
    return this.remotePlayer;
  }

  /**
   * Get the remote player controller.
   * @returns The remote player controller
   */
  getRemotePlayerController(): any | null {
    return this.remotePlayerController;
  }
}

export default CastAdapter;
