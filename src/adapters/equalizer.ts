import { AudioX } from 'audio';
import { bands, presets } from 'constants/equalizer';
import { isValidArray } from 'helpers/common';

import { EqualizerStatus, Preset } from 'types/equalizer.types';

class Equalizer {
  private static _instance: Equalizer;
  private audioCtx: AudioContext;
  private audioCtxStatus: EqualizerStatus;
  private eqFilterBands: BiquadFilterNode[];
  private bassBoostFilter: BiquadFilterNode;
  private compressor: DynamicsCompressorNode;

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
    const audioContextOptions = { latencyHint: 'playback' };
    if (typeof AudioContext !== 'undefined') {
      this.audioCtx = new AudioContext(
        audioContextOptions as AudioContextOptions
      );
    } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
      this.audioCtx = new (window as any).webkitAudioContext(
        audioContextOptions
      );
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
        filter.Q.value = band.q || 1; // Use a default Q of 1 if not specified
        return filter;
      });

      // Create a compressor for overall dynamic control
      this.compressor = this.audioCtx.createDynamicsCompressor();
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      // Create the bass boost filter
      this.bassBoostFilter = this.audioCtx.createBiquadFilter();
      this.bassBoostFilter.type = 'lowshelf';
      this.bassBoostFilter.frequency.value = 100;
      this.bassBoostFilter.gain.value = 0;

      // Connect the nodes
      audioSource.connect(equalizerBands[0]);
      for (let i = 0; i < equalizerBands.length - 1; i++) {
        equalizerBands[i].connect(equalizerBands[i + 1]);
      }
      equalizerBands[equalizerBands.length - 1].connect(this.bassBoostFilter);
      this.bassBoostFilter.connect(this.compressor);
      this.compressor.connect(this.audioCtx.destination);

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

    const currentTime = this.audioCtx.currentTime;
    this.eqFilterBands.forEach((band, index) => {
      const targetGain = preset.gains[index];
      band.gain.setTargetAtTime(targetGain, currentTime, 0.05);
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
    if (isValidArray(gains) && gains.length === this.eqFilterBands.length) {
      const currentTime = this.audioCtx.currentTime;
      this.eqFilterBands.forEach((band: BiquadFilterNode, index: number) => {
        band.gain.setTargetAtTime(gains[index], currentTime, 0.05);
      });
    } else {
      console.error('Invalid array of gains provided.');
    }
  }

  /**
   * Enables or disables bass boost.
   * @param {boolean} enable - Whether to enable or disable bass boost.
   * @param {number} gain - The gain value for bass boost.
   */
  setBassBoost(enable: boolean, gain: number = 6) {
    const currentTime = this.audioCtx.currentTime;
    if (enable) {
      this.bassBoostFilter.gain.setTargetAtTime(gain, currentTime, 0.05);
    } else {
      this.bassBoostFilter.gain.setTargetAtTime(0, currentTime, 0.05);
    }
  }

  /**
   * Adjusts the compressor settings.
   * @param {Partial<DynamicsCompressorOptions>} options - The compressor options to adjust.
   */
  setCompressorSettings(options: Partial<DynamicsCompressorOptions>) {
    if (this.compressor) {
      if (options.threshold !== undefined)
        this.compressor.threshold.setTargetAtTime(
          options.threshold,
          this.audioCtx.currentTime,
          0.01
        );
      if (options.knee !== undefined)
        this.compressor.knee.setTargetAtTime(
          options.knee,
          this.audioCtx.currentTime,
          0.01
        );
      if (options.ratio !== undefined)
        this.compressor.ratio.setTargetAtTime(
          options.ratio,
          this.audioCtx.currentTime,
          0.01
        );
      if (options.attack !== undefined)
        this.compressor.attack.setTargetAtTime(
          options.attack,
          this.audioCtx.currentTime,
          0.01
        );
      if (options.release !== undefined)
        this.compressor.release.setTargetAtTime(
          options.release,
          this.audioCtx.currentTime,
          0.01
        );
    }
  }

  /**
   * Resets the equalizer to flat response.
   */
  reset() {
    const currentTime = this.audioCtx.currentTime;
    this.eqFilterBands.forEach((band: BiquadFilterNode) => {
      band.gain.setTargetAtTime(0, currentTime, 0.05);
    });
    this.bassBoostFilter.gain.setTargetAtTime(0, currentTime, 0.05);
  }
}

export { Equalizer };
