import { AudioX } from 'audio';
import { bands, presets } from 'constants/equalizer';
import { isValidArray } from 'helpers/common';

import { EqualizerStatus, Preset } from 'types/equalizer.types';

class Equalizer {
  private static _instance: Equalizer;
  private audioCtx: AudioContext;
  private audioCtxStatus: EqualizerStatus;
  private eqFilterBands: BiquadFilterNode[];

  constructor() {
    if (Equalizer._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of Equalizer returning existing instance'
      );
      return Equalizer._instance;
    }

    if (this.audioCtx === undefined && typeof AudioContext !== 'undefined') {
      if (typeof AudioContext !== 'undefined') {
        this.audioCtx = new AudioContext();
        this.audioCtxStatus = 'ACTIVE';
        this.init();
      } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
        this.audioCtx = new (window as any).webkitAudioContext();
        this.audioCtxStatus = 'ACTIVE';
        this.init();
      } else {
        throw new Error('Web Audio API is not supported in this browser.');
      }
    } else {
      console.log('Equalizer not initialized, AudioContext failed');
      this.audioCtxStatus = 'FAILED';
    }

    // context state at this time is `undefined` in iOS8 Safari
    if (
      this.audioCtxStatus === 'ACTIVE' &&
      this.audioCtx.state === 'suspended'
    ) {
      var resume = () => {
        this.audioCtx.resume();
        setTimeout(() => {
          if (this.audioCtx.state === 'running') {
            document.body.removeEventListener('click', resume, false);
          }
        }, 0);
      };

      document.body.addEventListener('click', resume, false);
    }

    Equalizer._instance = this;
  }

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
      gainNode.gain.value = 1; //Normalize sound output

      audioSource.connect(equalizerBands[0]);

      for (let i = 0; i < equalizerBands.length - 1; i++) {
        equalizerBands[i].connect(equalizerBands[i + 1]);
      }

      equalizerBands[equalizerBands.length - 1].connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      this.audioCtxStatus = 'ACTIVE';
      this.eqFilterBands = equalizerBands;
    } catch (error) {
      this.audioCtxStatus = 'FAILED';
    }
  }

  setPreset(id: keyof Preset) {
    const preset = presets.find((el) => el.id === id);
    console.log({ preset });
    if (
      !this.eqFilterBands ||
      this.eqFilterBands.length !== preset?.gains.length
    ) {
      console.error('Invalid data provided.');
      return;
    }
    for (let i = 0; i < this.eqFilterBands.length; i++) {
      this.eqFilterBands[i].gain.value = preset?.gains[i];
    }
  }

  static getPreset() {
    return presets;
  }

  status() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtxStatus;
  }

  getEqFilterBands() {
    return {
      dbUpperLimit: 10,
      dbLowerLimit: -10,
      bands: this.eqFilterBands
    };
  }

  setCustomEQ(gains: number[]) {
    if (isValidArray(gains)) {
      this.eqFilterBands.forEach((band: BiquadFilterNode, index: number) => {
        band.gain.value = gains[index];
      });
    }
  }
}

export { Equalizer };
