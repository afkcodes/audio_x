import { AUDIO_X_CONSTANTS } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseEvents';
import {
  attachCustomEventListeners,
  attachDefaultEventListeners,
} from 'events/listeners';
import ChangeNotifier from 'helpers/notifier';
import { EventListenersList, MediaTrack, PlaybackRate } from 'types';
import { AudioInit } from 'types/audio.types';

let audioInstance: HTMLAudioElement;
const notifier = ChangeNotifier;

class AudioX {
  private _audio: HTMLAudioElement;
  private static _instance: AudioX;

  constructor() {
    if (AudioX._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of AudioX returning existing instance'
      );
      return AudioX._instance;
    }
    AudioX._instance = this;
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
      mode,
      mediaTrack,
      preloadStrategy = 'auto',
      autoplay = false,
      useDefaultEventListeners = true,
    } = initProps;
    if (
      process.env.NODE_ENV !== AUDIO_X_CONSTANTS?.DEVELOPMENT &&
      audioInstance &&
      mode === AUDIO_X_CONSTANTS?.REACT
    ) {
      throw new Error('Cannot create multiple audio instance');
    }
    if (!mediaTrack.source) {
      console.warn(
        'Initializing audio without source, this might cause initial playback failure'
      );
    }

    this._audio = new Audio(mediaTrack.source);
    this._audio?.setAttribute('id', 'audio_x_instance');
    this._audio.preload = preloadStrategy;
    this._audio.autoplay = autoplay;
    audioInstance = this._audio;
    if (useDefaultEventListeners) {
      attachDefaultEventListeners(BASE_EVENT_CALLBACK_MAP);
    }
  }

  async play() {
    const isSourceAvailable = audioInstance.src !== '';
    if (
      audioInstance?.paused &&
      audioInstance.HAVE_ENOUGH_DATA &&
      isSourceAvailable
    ) {
      await audioInstance.play();
    } else {
      throw new Error(
        'Unable to play as the selected audio is already playing'
      );
    }
  }

  pause() {
    if (audioInstance && !audioInstance?.paused) {
      audioInstance?.pause();
    }
  }

  stop() {
    if (audioInstance) {
      audioInstance?.pause();
      audioInstance.currentTime = 0;
    }
  }

  /**
   * @method reset :  This stops the playback and resets all the state of the audio
   */
  reset() {
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
    }
  }
  /**
   * @param playbackRate : a number denoting speed at which the playback should happen,
   */
  setPlaybackRate(playbackRate: PlaybackRate) {
    if (audioInstance) {
      audioInstance.playbackRate = playbackRate;
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

  destroy() {
    if (audioInstance) {
      this.reset();
      audioInstance.removeAttribute('src');
      audioInstance.load();
    }
  }

  subscribe(eventName: string, callback: Function = () => {}, state: any = {}) {
    const unsubscribe = notifier.listen(eventName, callback, state);
    return unsubscribe;
  }

  attachEventListeners(eventListenersList: EventListenersList) {
    attachCustomEventListeners(eventListenersList);
  }

  get id() {
    return audioInstance?.getAttribute('id');
  }

  set media(media: MediaTrack) {
    if (audioInstance) {
      audioInstance.src = media?.source;
    }
    // TODO: implementation metadata
  }

  static getAudioInstance() {
    if (audioInstance) {
      return audioInstance;
    }
  }
}

export { AudioX };
