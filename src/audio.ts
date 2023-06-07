import { AUDIO_X_CONSTANTS } from 'constants/common';
import { InitMode, PlaybackRate } from 'types';

let audioInstance: HTMLAudioElement;
class AudioX {
  private _audio: HTMLAudioElement;

  init(source: string, initMode: InitMode = AUDIO_X_CONSTANTS.REACT) {
    if (
      process.env.NODE_ENV !== AUDIO_X_CONSTANTS.DEVELOPMENT &&
      audioInstance &&
      initMode === AUDIO_X_CONSTANTS.REACT
    ) {
      throw new Error('Cannot create multiple audio instance');
    }
    if (!source) {
      console.warn(
        'Initializing audio without source, this might cause initial playback failure'
      );
    }
    this._audio = new Audio(source);
    this._audio?.setAttribute('id', 'audio_x_instance');
    audioInstance = this._audio;
  }

  play() {
    const isSourceAvailable = audioInstance.src !== '';
    if (
      audioInstance &&
      audioInstance?.paused &&
      audioInstance.HAVE_FUTURE_DATA &&
      isSourceAvailable
    ) {
      audioInstance.play();
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

  get id() {
    return audioInstance?.getAttribute('id');
  }

  set media(media: any) {
    // TODO: implementation media and types
    console.log('unimplemented media setter', media);
  }
}

export { AudioX };
