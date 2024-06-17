import { AudioX } from 'audio';
import { bands, presets } from 'constants/equalizer';
import { isValidArray } from 'helpers/common';

import { EqualizerStatus, Preset } from 'types/equalizer.types';

class Equalizer {
  private static _instance: Equalizer;
  private audioCtx: AudioContext;
  private audioCtxStatus: EqualizerStatus;
  private eqFilterBands: BiquadFilterNode[];

  /**
   * Creates an instance of Equalizer or returns the existing instance.
   */
  constructor() {
    if (Equalizer._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instances of Equalizer. Returning existing instance.'
      );
      return Equalizer._instance;
    }

    this.initializeAudioContext();

    Equalizer._instance = this;
  }

  /**
   * Initializes the AudioContext, ensuring compatibility with older browsers.
   * @private
   */
  private initializeAudioContext() {
    if (typeof AudioContext !== 'undefined') {
      this.audioCtx = new AudioContext();
    } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
      this.audioCtx = new (window as any).webkitAudioContext();
    } else {
      console.error('Web Audio API is not supported in this browser.');
    }

    this.audioCtxStatus = 'ACTIVE';
    this.init();

    if (this.audioCtx.state === 'suspended') {
      this.addResumeListener();
    }
  }

  /**
   * Adds a listener to resume the AudioContext on user interaction.
   * @private
   */
  private addResumeListener() {
    const resume = () => {
      this.audioCtx.resume();
      setTimeout(() => {
        if (this.audioCtx.state === 'running') {
          document.body.removeEventListener('click', resume, false);
        }
      }, 0);
    };

    document.body.addEventListener('click', resume, false);
  }

  /**
   * Initializes the equalizer by setting up the audio source and filter bands.
   */
  init() {
    try {
      const audioInstance = AudioX.getAudioInstance();
      const audioSource = this.audioCtx.createMediaElementSource(audioInstance);

      const equalizerBands = bands.map((band) => {
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.value = band.frequency;
        filter.gain.value = band.gain;
        filter.Q.value = 1;
        return filter;
      });

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.value = 1; // TODO: Normalize sound output

      audioSource.connect(equalizerBands[0]);

      for (let i = 0; i < equalizerBands.length - 1; i++) {
        equalizerBands[i].connect(equalizerBands[i + 1]);
      }

      equalizerBands[equalizerBands.length - 1].connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      this.audioCtxStatus = 'ACTIVE';
      this.eqFilterBands = equalizerBands;
    } catch (error) {
      console.error('Equalizer initialization failed:', error);
      this.audioCtxStatus = 'FAILED';
    }
  }

  /**
   * Sets the equalizer to a predefined preset.
   * @param {keyof Preset} id - The ID of the preset to apply.
   */
  setPreset(id: keyof Preset) {
    const preset = presets.find((el) => el.id === id);
    if (!preset) {
      console.error('Preset not found:', id);
      return;
    }

    if (
      !this.eqFilterBands ||
      this.eqFilterBands.length !== preset.gains.length
    ) {
      console.error('Invalid data provided.');
      return;
    }

    this.eqFilterBands.forEach((band, index) => {
      band.gain.value = preset.gains[index];
    });
  }

  /**
   * Retrieves the list of available presets.
   * @returns {Preset[]} The list of available presets.
   */
  static getPresets() {
    return presets;
  }

  /**
   * Gets the current status of the AudioContext.
   * @returns {EqualizerStatus} The current status of the AudioContext.
   */
  status() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtxStatus;
  }

  /**
   * Sets a custom equalizer configuration.
   * @param {number[]} gains - The gain values for each band.
   */
  setCustomEQ(gains: number[]) {
    if (isValidArray(gains)) {
      this.eqFilterBands.forEach((band: BiquadFilterNode, index: number) => {
        band.gain.value = gains[index];
      });
    } else {
      console.error('Invalid array of gains provided.');
    }
  }
}

export { Equalizer };
