import { Equalizer } from 'adapters/equalizer';
import HlsAdapter from 'adapters/hls';
import { AUDIO_X_CONSTANTS, PLAYBACK_STATE } from 'constants/common';
import { BASE_EVENT_CALLBACK_MAP } from 'events/baseEvents';
import {
  attachCustomEventListeners,
  attachDefaultEventListeners
} from 'events/listeners';
import { calculateActualPlayedLength } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';

import {
  attachMediaSessionHandlers,
  updateMetaData
} from 'mediasession/mediasessionHandler';
import { READY_STATE } from 'states/audioState';
import { EventListenersList } from 'types';
import { AudioInit, MediaTrack, PlaybackRate } from 'types/audio.types';
import { EqualizerStatus, Preset } from 'types/equalizer.types';

let audioInstance: HTMLAudioElement;
const notifier = ChangeNotifier;

class AudioX {
  private _audio: HTMLAudioElement;
  private isPlayLogEnabled: Boolean;
  private static _instance: AudioX;
  private eqStatus: EqualizerStatus = 'IDEAL';
  private isEqEnabled: boolean = false;
  private eqInstance: Equalizer;

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

    if (useDefaultEventListeners || customEventListeners == null) {
      attachDefaultEventListeners(BASE_EVENT_CALLBACK_MAP, enablePlayLog);
    }

    if (showNotificationActions) {
      attachMediaSessionHandlers();
    }

    if (enableEQ) {
      this.isEqEnabled = enableEQ;
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
    if (this.isEqEnabled && this.eqStatus === 'IDEAL') {
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
  }

  /**
   *
   * @param mediaTrack MediaTrack to be added and played
   *
   * Note: Use this method when you want to add media and do playback or want continuous playback
   * You can also call addMedia and Play Separately to achieve playback.
   */

  async addMediaAndPlay(mediaTrack: MediaTrack) {
    try {
      if (mediaTrack) {
        this.addMedia(mediaTrack).then(() => {
          if (audioInstance.HAVE_ENOUGH_DATA === READY_STATE.HAVE_ENOUGH_DATA) {
            setTimeout(async () => {
              this.attachEq();
              await this.play();
            }, 950);
          }
        });
      }
    } catch (error) {
      console.log('PLAYBACK FAILED');
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

  getPresets() {
    return Equalizer.getPresets();
  }

  setPreset(id: keyof Preset) {
    this.eqInstance.setPreset(id);
  }

  setCustomEQ(gains: number[]) {
    this.eqInstance.setCustomEQ(gains);
  }

  get id() {
    return audioInstance?.getAttribute('id');
  }

  static getAudioInstance() {
    return audioInstance;
  }
}

export { AudioX };
