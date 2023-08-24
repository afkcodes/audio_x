import { AUDIO_X_CONSTANTS, PLAYBACK_STATE } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseEvents';
import { HLS_EVENTS_CALLBACK_MAP } from 'events/hlsEvents';
import {
  attachCustomEventListeners,
  attachDefaultEventListeners,
  attachHlsEventsListeners
} from 'events/listeners';
import { calculateActualPlayedLength } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import Hls from 'hls.js';

import {
  attachMediaSessionHandlers,
  updateMetaData
} from 'mediasession/mediasessionHandler';
import { READY_STATE } from 'states/audioState';
import { EventListenersList } from 'types';
import { AudioInit, MediaTrack, PlaybackRate } from 'types/audio.types';

let audioInstance: HTMLAudioElement;
let hlsInstance: Hls;
const notifier = ChangeNotifier;

class AudioX {
  private _audio: HTMLAudioElement;
  private isPlayLogEnabled: Boolean;
  private static _instance: AudioX;

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
      autoplay = false,
      useDefaultEventListeners = true,
      customEventListeners = null,
      showNotificationActions = false,
      enablePlayLog = false,
      enableHls = true
    } = initProps;

    this._audio?.setAttribute('id', 'audio_x_instance');
    this._audio.preload = preloadStrategy;
    this._audio.autoplay = autoplay;
    this.isPlayLogEnabled = enablePlayLog;
    audioInstance = this._audio;

    if (useDefaultEventListeners || customEventListeners == null) {
      attachDefaultEventListeners(BASE_EVENT_CALLBACK_MAP, enablePlayLog);
    }

    if (showNotificationActions) {
      attachMediaSessionHandlers();
    }

    if (enableHls && Hls.isSupported()) {
      let hls = new Hls();
      hlsInstance = hls;
      attachHlsEventsListeners(HLS_EVENTS_CALLBACK_MAP, enablePlayLog);
    }
  }

  addHlsMedia(mediaTrack: MediaTrack) {
    hlsInstance.attachMedia(audioInstance);
    hlsInstance.on(Hls.Events.MEDIA_ATTACHED, function () {
      hlsInstance.loadSource(mediaTrack.source);
      console.log('hls media attached');
    });
  }

  async addMedia(mediaTrack: MediaTrack) {
    const mediaType = mediaTrack.source.includes('.m3u8') ? 'HLS' : 'DEFAULT';
    if (this.isPlayLogEnabled) {
      calculateActualPlayedLength(audioInstance, 'TRACK_CHANGE');
    }
    if (mediaTrack) {
      if (mediaType === 'HLS' && hlsInstance) {
        this.addHlsMedia(mediaTrack);
      } else {
        if (mediaType === 'HLS') {
          console.error(
            'supplied source seems to be a hls, but hls playback is not enabled'
          );
        }
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
  }

  async play() {
    const isSourceAvailable = audioInstance.src !== '';
    if (
      audioInstance?.paused &&
      audioInstance.HAVE_ENOUGH_DATA === READY_STATE.HAVE_ENOUGH_DATA &&
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
        if (audioInstance.HAVE_ENOUGH_DATA === READY_STATE.HAVE_ENOUGH_DATA) {
          setTimeout(async () => {
            await this.play();
          }, 950);
        }
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

  attachEventListeners(eventListenersList: EventListenersList) {
    attachCustomEventListeners(eventListenersList);
  }

  get id() {
    return audioInstance?.getAttribute('id');
  }

  static getAudioInstance() {
    return audioInstance;
  }

  static getHlsInstance() {
    return hlsInstance;
  }
}

export { AudioX };
