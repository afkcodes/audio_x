import { AUDIO_X_CONSTANTS } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseEvents';
import {
  attachCustomEventListeners,
  attachDefaultEventListeners
} from 'events/listeners';
import ChangeNotifier from 'helpers/notifier';
import { AUDIO_STATE } from 'states/audioState';
import { EventListenersList, MediaTrack, PlaybackRate } from 'types';
import { AudioInit, AudioState } from 'types/audio.types';

let audioInstance: HTMLAudioElement;
const notifier = ChangeNotifier;

class AudioX {
  private _audio: HTMLAudioElement;
  private static _instance: AudioX;

  constructor(initProps: AudioInit) {
    if (AudioX._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of AudioX returning existing instance'
      );
      return AudioX._instance;
    }

    const {
      mode,
      preloadStrategy = 'auto',
      autoplay = false,
      useDefaultEventListeners = true,
      customEventListeners = null
    } = initProps;
    if (
      process.env.NODE_ENV !== AUDIO_X_CONSTANTS?.DEVELOPMENT &&
      audioInstance &&
      mode === AUDIO_X_CONSTANTS?.REACT
    ) {
      throw new Error('Cannot create multiple audio instance');
    }

    AudioX._instance = this;
    this._audio = new Audio();
    this._audio?.setAttribute('id', 'audio_x_instance');
    this._audio.preload = preloadStrategy;
    this._audio.autoplay = autoplay;
    audioInstance = this._audio;
    if (useDefaultEventListeners || customEventListeners == null) {
      attachDefaultEventListeners(BASE_EVENT_CALLBACK_MAP);
    }
  }

  async addMedia(mediaTrack: MediaTrack) {
    if (mediaTrack) {
      audioInstance.src = mediaTrack.source;
      notifier.notify('AUDIO_STATE', {
        ...AUDIO_STATE,
        currentTrack: mediaTrack
      });
    }
  }

  async play() {
    const isSourceAvailable = audioInstance.src !== '';
    if (
      audioInstance?.paused &&
      audioInstance.HAVE_ENOUGH_DATA === 4 &&
      isSourceAvailable
    ) {
      await audioInstance.play();
    }
  }

  /**
   *
   * @param mediaTrack MediaTrack to be added and played
   *
   * Note: Use this method when you want to add media and do playback or want continuous playback
   * You can also call addMedia and Play Separately to achieve playback.
   */

  async addMediaAndPlay(mediaTrack: MediaTrack) {
    if (mediaTrack) {
      this.addMedia(mediaTrack).then(() => {
        /* check if can be handled in a better way without subscribing to audio state, 
          although this at use doesn't seems to be behaving weirdly
        */
        this.subscribe('AUDIO_STATE', (state: AudioState) => {
          if (state.playbackState === 'ready') {
            setTimeout(async () => {
              await this.play();
            }, 950);
          }
        });
      });
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
        ...AUDIO_STATE,
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
        ...AUDIO_STATE,
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

  async destroy() {
    if (audioInstance) {
      await this.reset();
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
    return audioInstance;
  }
}

export { AudioX };
