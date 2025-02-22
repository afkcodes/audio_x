import CastAdapter from 'adapters/cast';
import { Equalizer } from 'adapters/equalizer';
import HlsAdapter from 'adapters/hls';
import { DEFAULT_CAST_CONFIG } from 'constants/cast';
import { AUDIO_X_CONSTANTS, PLAYBACK_STATE } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseAudioListeners';
import { attachEventListeners } from 'events/listeners';
import {
  calculateActualPlayedLength,
  handleLoopPlayback,
  handleQueuePlayback,
  isValidArray,
  isValidFunction,
  isValidObject
} from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { shuffleQueue } from 'helpers/shuffleHelper';

import {
  attachMediaSessionHandlers,
  updateMetaData
} from 'mediasession/mediasessionHandler';
import { READY_STATE } from 'states/audioState';
import {
  AudioInit,
  AudioState,
  LoopMode,
  MediaTrack,
  PlaybackRate,
  QueuePlaybackType
} from 'types/audio.types';
import { EqualizerStatus, Preset } from 'types/equalizer.types';

// Holds the singleton instance of the HTMLAudioElement
let audioInstance: HTMLAudioElement;
const notifier = ChangeNotifier;

/**
 * AudioX class for managing audio playback with various features like queue, equalizer, and casting.
 */
class AudioX {
  private static _instance: AudioX;
  private _audio: HTMLAudioElement;
  private eqInstance: Equalizer;
  private showNotificationsActions: boolean = false;
  private originalQueue: MediaTrack[] = [];
  private isShuffled: boolean = false;
  private loopMode: LoopMode = 'OFF';
  private _queue: MediaTrack[];
  private isPlayLogEnabled: boolean = false;
  // private isCastingEnabled: boolean = false;
  private isEqEnabled: boolean = false;
  private _currentQueueIndex: number = 0;
  private eqStatus: EqualizerStatus = 'IDEAL';
  private _fetchFn: (mediaTrack: MediaTrack) => Promise<void>;

  /**
   * Constructor for the AudioX class.
   * Ensures a single instance of the class (singleton pattern).
   */
  constructor() {
    if (AudioX._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of AudioX returning existing instance'
      );
      return AudioX._instance;
    }
    if (
      process.env.NODE_ENV !== AUDIO_X_CONSTANTS?.DEVELOPMENT &&
      audioInstance
    ) {
      throw new Error('Cannot create multiple audio instance');
    }

    AudioX._instance = this;
    this._audio = new Audio();
    audioInstance = this._audio;
  }

  /**
   * Initializes the AudioX instance with the provided properties.
   * @param {AudioInit} initProps - The initialization properties.
   */
  async init(initProps: AudioInit) {
    const {
      preloadStrategy = 'auto',
      autoPlay = false,
      useDefaultEventListeners = true,
      customEventListeners = null,
      showNotificationActions = false,
      enablePlayLog = false,
      enableHls = false,
      enableEQ = false,
      crossOrigin = null,
      hlsConfig = {},
      enableCasting = false,
      castConfig
    } = initProps;

    // Set audio element attributes
    this._audio?.setAttribute('id', 'audio_x_instance');
    this._audio.preload = preloadStrategy;
    this._audio.autoplay = autoPlay;
    this._audio.crossOrigin = crossOrigin;
    this.isPlayLogEnabled = enablePlayLog;
    this.isEqEnabled = enableEQ;

    // Attach event listeners
    if (customEventListeners !== null) {
      if (useDefaultEventListeners) {
        console.warn(
          `useDefaultEventListeners is set to true at init, are you trying to use the default event listeners?
            set customEventListeners to null to use default event listeners`
        );
      }
      attachEventListeners(customEventListeners, false);
    } else {
      attachEventListeners(BASE_EVENT_CALLBACK_MAP, enablePlayLog);
    }

    // Attach media session handlers for notification actions
    if (showNotificationActions) {
      this.showNotificationsActions = true;
      attachMediaSessionHandlers();
    }

    // Enable equalizer if specified
    if (enableEQ) {
      this.isEqEnabled = enableEQ;
    }

    // Initialize HLS playback if enabled
    if (enableHls) {
      const hls = new HlsAdapter();
      hls.init(hlsConfig, enablePlayLog);
    }

    // Initialize casting if enabled
    if (enableCasting) {
      const cast = new CastAdapter();
      const castReceiverId =
        castConfig?.receiverId || DEFAULT_CAST_CONFIG.receiverId;
      const castJoinPolicy =
        castConfig?.joinPolicy || DEFAULT_CAST_CONFIG.joinPolicy;
      cast.init(castReceiverId, castJoinPolicy, enablePlayLog);

      if (!castConfig) {
        console.warn(
          'initializing cast framework with default cast config, please provide cast config'
        );
      }
    }
  }

  async addMedia(
    mediaTrack: MediaTrack,
    mediaFetchFn?: (mediaTrack: MediaTrack) => Promise<void>
  ) {
    if (!mediaTrack) {
      return;
    }

    if (mediaFetchFn && !mediaTrack.source.length) {
      this._fetchFn = mediaFetchFn;
    }

    const queue = this.getQueue();
    if (isValidArray(queue)) {
      const index = queue.findIndex((track) => mediaTrack.id === track.id);
      if (index > -1) {
        this._currentQueueIndex = index;
      }
    }

    const mediaType = mediaTrack.source.includes('.m3u8') ? 'HLS' : 'DEFAULT';

    // Log the play length if logging is enabled
    if (this.isPlayLogEnabled) {
      calculateActualPlayedLength(audioInstance, 'TRACK_CHANGE');
    }

    if (
      mediaType === 'HLS' &&
      !audioInstance.canPlayType('application/vnd.apple.mpegurl')
    ) {
      const hls = new HlsAdapter();
      const hlsInstance = hls.getHlsInstance();
      if (hlsInstance) {
        hlsInstance.detachMedia();
        hls.addHlsMedia(mediaTrack);
      } else {
        console.warn(
          'The source provided seems to be a HLS stream but, hls playback is not enabled. Please have a look at init method of AudioX'
        );
        await this.reset();
      }
    } else {
      // Set audio source for non-HLS media
      audioInstance.src = mediaTrack.source;
    }

    // Notify state change and update media metadata
    notifier.notify('AUDIO_STATE', {
      playbackState: PLAYBACK_STATE.TRACK_CHANGE,
      currentTrackPlayTime: 0,
      currentTrack: mediaTrack
    });

    updateMetaData(mediaTrack);
    audioInstance.load();
  }

  /**
   * Attaches the equalizer to the audio instance.
   */
  attachEq() {
    if (this.eqStatus === 'IDEAL') {
      try {
        const eq = new Equalizer();
        this.eqStatus = eq.status();
        this.eqInstance = eq;
      } catch (e) {
        console.log('failed to enable equalizer');
      }
    }
  }

  /**
   * Plays the audio.
   */
  async play() {
    const isSourceAvailable = audioInstance.src !== '';
    if (
      audioInstance?.paused &&
      audioInstance.HAVE_ENOUGH_DATA === READY_STATE.HAVE_ENOUGH_DATA &&
      isSourceAvailable
    ) {
      await audioInstance
        .play()
        .then(() => {
          console.log('PLAYING');
        })
        .catch(() => {
          console.warn('cancelling current audio playback, track changed');
        });
    }
    if (this.isEqEnabled) {
      this.attachEq();
    }
  }

  /**
   * Adds a media track and plays it.
   * @param {MediaTrack} [mediaTrack] - The media track to add and play.
   * @param {(mediaTrack: MediaTrack) => Promise<void>} [fetchFn] - The fetch function to call before playback.
   */
  async addMediaAndPlay(
    mediaTrack?: MediaTrack | null,
    fetchFn?: (mediaTrack: MediaTrack) => Promise<void>
    // this should be passed when there something needs to be done before the audio starts playing
  ) {
    const currentTrack =
      mediaTrack || (this._queue.length > 0 ? this._queue[0] : undefined);
    if (fetchFn && isValidFunction(fetchFn) && currentTrack?.source.length) {
      this._fetchFn = fetchFn;
      await fetchFn(currentTrack as MediaTrack);
    }
    try {
      if (currentTrack) {
        this.addMedia(currentTrack).then(() => {
          if (audioInstance.HAVE_ENOUGH_DATA === READY_STATE.HAVE_ENOUGH_DATA) {
            setTimeout(async () => {
              await this.play();
              if (this.isEqEnabled) {
                this.attachEq();
              }
            }, 950);
          }
        });
      } else {
        console.error('Playback Failed, No MediaTrack Provided');
      }
    } catch (error) {
      console.error('Playback Failed');
    }
  }

  /**
   * Pauses the audio playback.
   */
  pause() {
    if (audioInstance && !audioInstance?.paused) {
      audioInstance?.pause();
    }
  }

  /**
   * Stops the audio playback and resets the current time to 0.
   */
  stop() {
    if (audioInstance && !audioInstance.paused) {
      audioInstance?.pause();
      audioInstance.currentTime = 0;
    }
  }

  /**
   * Resets the audio instance, stopping playback and clearing the source.
   * @method reset
   */
  async reset() {
    if (audioInstance) {
      this.stop();
      audioInstance.src = '';
      audioInstance.srcObject = null;
    }
  }

  /**
   * Sets the volume of the audio instance.
   * @param {number} volume - The volume level (1-100).
   */
  setVolume(volume: number) {
    const actualVolume = volume / 100;
    if (audioInstance) {
      audioInstance.volume = actualVolume;
      notifier.notify('AUDIO_STATE', {
        volume: volume
      });
    }
  }

  /**
   * Sets the playback rate of the audio instance.
   * @param {PlaybackRate} playbackRate - The playback rate.
   */
  setPlaybackRate(playbackRate: PlaybackRate) {
    if (audioInstance) {
      audioInstance.playbackRate = playbackRate;
      notifier.notify('AUDIO_STATE', {
        playbackRate
      });
    }
  }

  /**
   * Mutes the audio instance.
   */
  mute() {
    if (audioInstance && !audioInstance.muted) {
      audioInstance.muted = true;
    }
  }

  /**
   * Seeks to a specific time in the audio playback.
   * @param {number} time - The time to seek to (in seconds).
   */
  seek(time: number) {
    if (audioInstance) {
      audioInstance.currentTime = time;
    }
  }

  seekBy(time: number) {
    if (audioInstance && audioInstance.currentTime) {
      const currentProgress = audioInstance.currentTime;
      audioInstance.currentTime = currentProgress + time;
    }
  }

  /**
   * Destroys the audio instance, resetting and clearing the source.
   */
  async destroy() {
    if (audioInstance) {
      await this.reset();
      audioInstance.removeAttribute('src');
      audioInstance.load();
    }
  }

  castAudio() {
    const casting = new CastAdapter();
    casting.castAudio();
  }

  /**
   * Subscribes to an event.
   * @param {string} eventName - The event name.
   * @param {(data: any) => void} callback - The callback function.
   * @param {any} [state] - The state to pass to the callback.
   * @returns {Function} The unsubscribe function.
   */
  subscribe(
    eventName: string,
    callback: (data: any) => void,
    state: any = {}
  ): Function {
    const unsubscribe = notifier.listen(eventName, callback, state);
    return unsubscribe;
  }

  /**
   * Adds an event listener to the audio instance.
   * @param {keyof HTMLMediaElementEventMap} event - The event name.
   * @param {(data: any) => void} callback - The callback function.
   */
  addEventListener(
    event: keyof HTMLMediaElementEventMap,
    callback: (data: any) => void
  ) {
    audioInstance.addEventListener(event, callback);
  }

  /**
   * Gets the available equalizer presets.
   * @returns {Preset[]} The available presets.
   */
  getPresets(): Preset[] {
    return Equalizer.getPresets();
  }

  /**
   * Sets the equalizer to a specific preset.
   * @param {keyof Preset} id - The preset ID.
   */
  setPreset(id: keyof Preset) {
    if (this.isEqEnabled) {
      this.eqInstance.setPreset(id);
    } else {
      console.error('Equalizer not initialized, please set enableEq at init');
    }
  }

  /**
   * Sets custom equalizer gains.
   * @param {number[]} gains - The custom gains.
   */
  setCustomEQ(gains: number[]) {
    if (this.isEqEnabled) {
      this.eqInstance.setCustomEQ(gains);
    } else {
      console.error('Equalizer not initialized, please set enableEq at init');
    }
  }

  setBassBoost(enabled: boolean, boost: number) {
    if (this.isEqEnabled) {
      this.eqInstance.setBassBoost(enabled, boost);
    } else {
      console.error('Equalizer not initialized, please set enableEq at init');
    }
  }

  /**
   * Adds tracks to the queue with a specific playback type.
   * @param {MediaTrack[]} queue - The tracks to add to the queue.
   * @param {QueuePlaybackType} playbackType - The playback type (DEFAULT, REVERSE, SHUFFLE).
   */
  addQueue(queue: MediaTrack[], playbackType: QueuePlaybackType) {
    this.clearQueue();
    const audioState = notifier.getLatestState('AUDIO_X_STATE') as AudioState;
    const playerQueue = isValidArray(queue) ? queue.slice() : [];
    const currentTrack = isValidObject(audioState.currentTrack)
      ? audioState.currentTrack
      : undefined;

    switch (playbackType) {
      case 'DEFAULT':
        this._queue = playerQueue;
        break;
      case 'REVERSE':
        this._queue = playerQueue.reverse();
        break;
      case 'SHUFFLE':
        const newQueue = shuffleQueue(playerQueue, currentTrack?.id);
        this.addQueue(newQueue, 'DEFAULT');
        this.isShuffled = true;
        break;
      default:
        this._queue = playerQueue;
        break;
    }
    handleQueuePlayback();
    /* Attaching MediaSession Handler again as this will make sure that
     the next and previous button show up in notification */
    if (this.showNotificationsActions) {
      attachMediaSessionHandlers();
    }
  }

  /**
   * Plays the next track in the queue.
   */
  playNext() {
    const index = this._currentQueueIndex + 1;
    if (this?._queue?.length > index) {
      const nextTrack = this._queue[index];
      this.addMediaAndPlay(nextTrack, this._fetchFn);
      this._currentQueueIndex = index;
    } else {
      // stop the audio and end trigger queue ended
      this.stop();
      notifier.notify('AUDIO_STATE', {
        playbackState: PLAYBACK_STATE.QUEUE_ENDED
      });
    }
  }

  /**
   * Plays the previous track in the queue.
   */
  playPrevious() {
    const index = this?._currentQueueIndex - 1;

    if (index >= 0) {
      const previousTrack = this?._queue[index];
      this.addMediaAndPlay(previousTrack, this._fetchFn);
      this._currentQueueIndex = index;
    } else {
      console.log('At the beginning of the queue');
    }
  }

  /**
   * Clears the queue.
   */
  clearQueue() {
    if (this._queue && isValidArray(this._queue)) {
      this._queue = [];
      this._currentQueueIndex = 0;
    }
  }

  addToQueue(mediaTracks: MediaTrack | MediaTrack[]) {
    if (this._queue && isValidArray(this._queue)) {
      if (Array.isArray(mediaTracks)) {
        this._queue = [...this._queue, ...mediaTracks];
      } else {
        this._queue.push(mediaTracks);
      }
    }
  }

  toggleShuffle() {
    // isShuffled is false initially
    const audioState = notifier.getLatestState('AUDIO_X_STATE') as AudioState;
    const currentQueue = this._queue ?? this.getQueue();
    this.clearQueue(); // clearing Queue to check if it still stays
    const currentTrack = isValidObject(audioState.currentTrack)
      ? audioState.currentTrack
      : undefined;
    if (!this.isShuffled) {
      this.originalQueue = [...currentQueue];
      const newQueue = shuffleQueue(currentQueue, currentTrack?.id);
      this.addQueue(newQueue, 'DEFAULT');
      this.isShuffled = true;
    } else {
      if (!this.isShuffled || !this.originalQueue.length) return;
      this.addQueue(this.originalQueue, 'DEFAULT');
      this.isShuffled = false;
    }
  }

  loop(loopMode: LoopMode) {
    this.loopMode = loopMode;
    switch (loopMode) {
      case 'SINGLE':
        handleLoopPlayback(loopMode);
        break;
      case 'QUEUE':
        handleLoopPlayback(loopMode);
        break;
      case 'OFF':
        handleLoopPlayback(loopMode);
        break;
      default:
        handleLoopPlayback('OFF');
        break;
    }
  }

  isShuffledEnabled() {
    return this.isShuffled;
  }

  getLoopMode() {
    return this.loopMode;
  }

  /**
   * Removes a specific track from the queue.
   * @param {MediaTrack} mediaTrack - The track to remove.
   */
  removeFromQueue(mediaTrack: MediaTrack) {
    if (this._queue && isValidArray(this._queue)) {
      const queue = this._queue.filter(
        (track: MediaTrack) => track.id == mediaTrack.id
      );
      this._queue = queue;
    }
  }

  /**
   * Gets the current queue.
   * @returns {MediaTrack[]} The current queue.
   */
  getQueue(): MediaTrack[] {
    return this._queue && isValidArray(this._queue) ? this._queue : [];
  }

  /**
   * Gets the current queue.
   * @returns {AudioState} The current queue.
   */
  getAudioState(): AudioState {
    return notifier.getLatestState('AUDIO_X_STATE') as AudioState;
  }

  /**
   * Gets the ID of the audio instance.
   * @returns {string | null} The ID of the audio instance.
   */
  get id(): string | null {
    return audioInstance?.getAttribute('id');
  }

  /**
   * Gets the current audio instance.
   * @returns {HTMLAudioElement} The current audio instance.
   */
  static getAudioInstance(): HTMLAudioElement {
    return audioInstance;
  }
}

export { AudioX };
