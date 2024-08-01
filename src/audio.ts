import { Equalizer } from 'adapters/equalizer';
import HlsAdapter from 'adapters/hls';
import { AUDIO_X_CONSTANTS, PLAYBACK_STATE } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseEvents';
import { attachEventListeners } from 'events/listeners';
import {
  calculateActualPlayedLength,
  handleQueuePlayback,
  isValidArray,
  isValidFunction,
  shuffle
} from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';

import {
  attachMediaSessionHandlers,
  updateMetaData
} from 'mediasession/mediasessionHandler';
import { READY_STATE } from 'states/audioState';
import {
  AudioInit,
  MediaTrack,
  PlaybackRate,
  QueuePlaybackType
} from 'types/audio.types';
import { EqualizerStatus, Preset } from 'types/equalizer.types';

let audioInstance: HTMLAudioElement;
const notifier = ChangeNotifier;

class AudioX {
  private _audio: HTMLAudioElement;
  private isPlayLogEnabled: Boolean;
  private static _instance: AudioX;
  private _queue: MediaTrack[];
  private _currentQueueIndex: number = 0;
  private _fetchFn: (mediaTrack: MediaTrack) => Promise<void>;
  private eqStatus: EqualizerStatus = 'IDEAL';
  private isEqEnabled: boolean = false;
  private eqInstance: Equalizer;
  private showNotificationsActions: boolean = false;

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
   *
   * @param initProps  initial config to initialize AudioX
   * @param initProps.mediaTrack mediaTrack Object containing metadata and source of the media
   * @param initProps.mediaTrack.title title of the Audio
   * @param initProps.mediaTrack.source URI of the Audio
   * @param initProps.mediaTrack.artwork artwork of the Audio
   * @param initProps.mediaTrack.duration  duration of the audio
   * @param initProps.mediaTrack.genre genre of the audio
   * @param initProps.mediaTrack.album album of the audio
   * @param initProps.mediaTrack.comment comment for the audio
   * @param initProps.mediaTrack.year release year of the audio
   * @param initProps.mediaTrack.artist artist of the audio
   * @param mode mode of operation for AudioX
   * @param autoplay flag for autoplay
   * @param preloadStrategy strategy for preloading audio
   * @param playbackRate default playbackRate of the audio
   * @param attachAudioEventListeners flag for registering audio events
   * @param attachMediaSessionHandlers flag for registering mediaSession handlers
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
      crossOrigin = 'anonymous',
      hlsConfig = {}
    } = initProps;

    this._audio?.setAttribute('id', 'audio_x_instance');
    this._audio.preload = preloadStrategy;
    this._audio.autoplay = autoPlay;
    this._audio.crossOrigin = crossOrigin;
    this.isPlayLogEnabled = enablePlayLog;
    this.isEqEnabled = enableEQ;

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

    if (showNotificationActions) {
      this.showNotificationsActions = true;
      attachMediaSessionHandlers();
    }

    if (enableHls) {
      const hls = new HlsAdapter();
      hls.init(hlsConfig, enablePlayLog);
    }
  }

  async addMedia(mediaTrack: MediaTrack) {
    if (!mediaTrack) {
      return;
    }

    const queue = this.getQueue();
    if (isValidArray(queue)) {
      const index = queue.findIndex((track) => mediaTrack.id === track.id);
      if (index > -1) {
        this._currentQueueIndex = index;
      }
    }

    const mediaType = mediaTrack.source.includes('.m3u8') ? 'HLS' : 'DEFAULT';

    if (this.isPlayLogEnabled) {
      calculateActualPlayedLength(audioInstance, 'TRACK_CHANGE');
    }

    if (mediaType === 'HLS') {
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
      audioInstance.src = mediaTrack.source;
    }

    notifier.notify('AUDIO_STATE', {
      playbackState: PLAYBACK_STATE.TRACK_CHANGE,
      currentTrackPlayTime: 0,
      currentTrack: mediaTrack
    });

    updateMetaData(mediaTrack);
    audioInstance.load();
  }

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
   *
   * @param mediaTrack MediaTrack to be added and played
   *
   * Note: Use this method when you want to add media and do playback or want continuous playback
   * You can also call addMedia and Play Separately to achieve playback.
   */

  async addMediaAndPlay(
    mediaTrack?: MediaTrack | null,
    fetchFn?: (mediaTrack: MediaTrack) => Promise<void>
    // this should be passed when there something needs to be done before the audio starts playing
  ) {
    const currentTrack =
      mediaTrack || (this._queue.length > 0 ? this._queue[0] : undefined);
    if (fetchFn && isValidFunction(fetchFn) && currentTrack) {
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

  pause() {
    if (audioInstance && !audioInstance?.paused) {
      audioInstance?.pause();
    }
  }

  stop() {
    if (audioInstance && !audioInstance.paused) {
      audioInstance?.pause();
      audioInstance.currentTime = 0;
    }
  }

  /**
   * @method reset :  This stops the playback and resets all the state of the audio
   */
  async reset() {
    if (audioInstance) {
      this.stop();
      audioInstance.src = '';
      audioInstance.srcObject = null;
    }
  }

  /**
   * @param volume : numeric value between 1-100 to be used.
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
   * @param playbackRate : a number denoting speed at which the playback should happen,
   */
  setPlaybackRate(playbackRate: PlaybackRate) {
    if (audioInstance) {
      audioInstance.playbackRate = playbackRate;
      notifier.notify('AUDIO_STATE', {
        playbackRate
      });
    }
  }

  mute() {
    if (audioInstance && !audioInstance.muted) {
      audioInstance.muted = true;
    }
  }

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

  async destroy() {
    if (audioInstance) {
      await this.reset();
      audioInstance.removeAttribute('src');
      audioInstance.load();
    }
  }

  subscribe(eventName: string, callback: (data: any) => void, state: any = {}) {
    const unsubscribe = notifier.listen(eventName, callback, state);
    return unsubscribe;
  }

  addEventListener(
    event: keyof HTMLMediaElementEventMap,
    callback: (data: any) => void
  ) {
    audioInstance.addEventListener(event, callback);
  }

  getPresets() {
    return Equalizer.getPresets();
  }

  setPreset(id: keyof Preset) {
    if (this.isEqEnabled) {
      this.eqInstance.setPreset(id);
    } else {
      console.error('Equalizer not initialized, please set enableEq at init');
    }
  }

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

  addQueue(queue: MediaTrack[], playbackType: QueuePlaybackType) {
    this.clearQueue();
    const playerQueue = isValidArray(queue) ? queue.slice() : [];
    switch (playbackType) {
      case 'DEFAULT':
        this._queue = playerQueue;
        break;
      case 'REVERSE':
        this._queue = playerQueue.reverse();
        break;
      case 'SHUFFLE':
        this._queue = shuffle(playerQueue);
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

  playNext() {
    const index = this._currentQueueIndex + 1;
    if (this._queue.length > index) {
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

  playPrevious() {
    const index = this._currentQueueIndex - 1;

    if (index >= 0) {
      const previousTrack = this._queue[index];
      this.addMediaAndPlay(previousTrack, this._fetchFn);
      this._currentQueueIndex = index;
    } else {
      console.log('At the beginning of the queue');
    }
  }

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

  removeFromQueue(mediaTrack: MediaTrack) {
    if (this._queue && isValidArray(this._queue)) {
      const queue = this._queue.filter(
        (track: MediaTrack) => track.id == mediaTrack.id
      );
      this._queue = queue;
    }
  }

  getQueue() {
    return this._queue && isValidArray(this._queue) ? this._queue : [];
  }

  get id() {
    return audioInstance?.getAttribute('id');
  }

  static getAudioInstance() {
    return audioInstance;
  }
}

export { AudioX };
