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
  private static _instance: CastAdapter;
  private castContext: any;
  private chromeCast: any;
  private remotePlayer: any;
  private remotePlayerController: any;
  private isInitialized = false;
  private castButtonId = 'cast-button-container';
  private sessionStateListener: any;
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
  async load(retryCount = 0, maxRetries = 10, retryDelay = 300): Promise<any> {
    try {
      // First check if the Cast API is already available in window
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

      // Load the Cast SDK script if it hasn't been loaded yet
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

      // Wait for a short time to allow the script to initialize
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Check if Cast API is available after loading
      if (typeof window !== 'undefined' && window.cast && window.cast.framework) {
        console.log('Cast framework detected after script load');
        return this.getCastContext();
      }

      // If we still don't have the framework, retry if needed
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
   * @param enablePlayLog - Whether to enable play logging
   * @returns Promise resolving to the cast context or undefined
   */
  async init(
    receiverId: string = DEFAULT_CAST_CONFIG.receiverId,
    joinPolicy: keyof JoinPolicy = DEFAULT_CAST_CONFIG.joinPolicy,
  ): Promise<any | undefined> {
    try {
      if (this.isInitialized) {
        console.warn('Cast framework is already initialized.');
        return this.castContext;
      }

      // Load the Cast SDK with more aggressive retry
      try {
        const context = await this.load(0, 15, 500);
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
  private getCastContext(): any {
    if (!this.castContext && typeof window !== 'undefined') {
      try {
        if (isValidWindow && window.cast?.framework) {
          this.castContext = window.cast.framework.CastContext.getInstance();
          this.chromeCast = window.chrome.cast;
          return this.castContext;
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          console.warn('Cast framework not loaded yet');
          return null;
        }
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
   * Create a cast button in the specified container.
   * @param containerId - The ID of the HTML element to contain the button
   */
  createCastButton(containerId: string = this.castButtonId): void {
    if (!this.castContext) {
      console.error('Cast framework not initialized');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Cast button container #${containerId} not found`);
      return;
    }

    try {
      // Clear any existing content
      container.innerHTML = '';

      // Create a cast button using the Google Cast framework
      const button = new window.cast.framework.CastButton();
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
      const audio = new AudioX();
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
      this.remotePlayerController.removeEventListener(eventType, callback as any);
    });

    this.remotePlayerListeners = {};
  }

  /**
   * Handler for remote player connected state changes.
   */
  private onConnectedChanged(): void {
    console.log('Cast connection state changed:', this.remotePlayer.isConnected);
  }

  /**
   * Handler for remote player media loaded state changes.
   */
  private onMediaLoaded(): void {
    console.log('Cast media loaded state changed:', this.remotePlayer.isMediaLoaded);
  }

  /**
   * Handler for remote player state changes.
   */
  private onPlayerStateChanged(): void {
    console.log('Cast player state changed:', this.remotePlayer.playerState);

    let playbackState: any;
    if (!isValidWindow) {
      console.log('no valid window context, returning :: CAST::onPlayerStateChanged');
      return;
    }
    // Map Cast player states to our playback states
    switch (this.remotePlayer.playerState) {
      case window.chrome.cast.media.PlayerState.PLAYING:
        playbackState = PLAYBACK_STATE.PLAYING;
        break;
      case window.chrome.cast.media.PlayerState.PAUSED:
        playbackState = PLAYBACK_STATE.PAUSED;
        break;
      case window.chrome.cast.media.PlayerState.BUFFERING:
        playbackState = PLAYBACK_STATE.BUFFERING;
        break;
      case window.chrome.cast.media.PlayerState.IDLE:
        if (this.remotePlayer.currentTime >= this.remotePlayer.duration - 0.5) {
          playbackState = PLAYBACK_STATE.ENDED;
        } else {
          playbackState = PLAYBACK_STATE.IDLE;
        }
        break;
    }

    if (playbackState) {
      ChangeNotifier.notify('AUDIO_STATE', {
        playbackState,
      });
    }
  }

  /**
   * Handler for remote player current time changes.
   */
  private onCurrentTimeChanged(): void {
    ChangeNotifier.notify('AUDIO_STATE', {
      progress: this.remotePlayer.currentTime,
    });
  }

  /**
   * Handler for remote player duration changes.
   */
  private onDurationChanged(): void {
    ChangeNotifier.notify('AUDIO_STATE', {
      duration: this.remotePlayer.duration,
    });
  }

  /**
   * Handler for remote player volume changes.
   */
  private onVolumeLevelChanged(): void {
    // Scale from 0-1 to 0-100
    const volume = Math.round(this.remotePlayer.volumeLevel * 100);

    ChangeNotifier.notify('AUDIO_STATE', {
      volume,
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
        // The session state listener will handle loading media
      })
      .catch((error: any) => {
        console.error('Error requesting cast session:', error);
      });
  }

  /**
   * Load the current media on the cast device.
   */
  private loadCurrentMedia(): void {
    const audio = new AudioX();
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
  private createCastMedia(mediaTrack: any): any {
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
  loadMedia(mediaTrack: any): void {
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
    const audio = new AudioX();
    const audioState = audio.getAudioState();
    const autoplay = audioState.playbackState === PLAYBACK_STATE.PLAYING;

    // Create load request
    const request = new this.chromeCast.media.LoadRequest(mediaInfo);
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
   * Play the current media on the cast device.
   */
  play(): void {
    if (this.remotePlayerController && this.remotePlayer.isMediaLoaded) {
      this.remotePlayerController.playOrPause();
    }
  }

  /**
   * Pause the current media on the cast device.
   */
  pause(): void {
    if (this.remotePlayerController && this.remotePlayer.isMediaLoaded) {
      this.remotePlayerController.playOrPause();
    }
  }

  /**
   * Play the next track on the cast device.
   * This should be called when the user wants to skip to the next track while casting.
   * @param {MediaTrack} nextTrack - The next track to play on the cast device
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
    const request = new this.chromeCast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    // Load the next track on the cast device
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
   * This should be called when the user wants to go back to the previous track while casting.
   * @param {MediaTrack} previousTrack - The previous track to play on the cast device
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
    const request = new this.chromeCast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    // Load the previous track on the cast device
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
   * Seek to a specific time in the media on the cast device.
   * @param time - The time to seek to (in seconds)
   */
  seek(time: number): void {
    if (this.remotePlayerController && this.remotePlayer.isMediaLoaded) {
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
      this.remotePlayer.volumeLevel = volume / 100;
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
   * Get the current cast session.
   * @returns The current cast session or null if none exists
   */
  getCastSession(): any {
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
  getRemotePlayer(): any {
    return this.remotePlayer;
  }

  /**
   * Get the remote player controller.
   * @returns The remote player controller
   */
  getRemotePlayerController(): any {
    return this.remotePlayerController;
  }
}

export default CastAdapter;
