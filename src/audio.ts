import { InitMode, PlaybackRate } from 'types';

let audioInstance: HTMLAudioElement;

class AudioX {
  private _audio: HTMLAudioElement;

  init(source: string, initMode: InitMode = 'REACT') {
    if (
      process.env.NODE_ENV !== 'development' &&
      audioInstance &&
      initMode === 'REACT'
    ) {
      throw new Error('Cannot create multiple audio instance');
    }
    if (!source) {
      console.warn(
        'Initializing audio without source, this might cause initial playback failure'
      );
    }
    this._audio = new Audio(source);
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
      throw new Error('Audio source must be set before playing an audio');
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
}

export { AudioX };
