export interface Band {
  frequency: number;
  type: BiquadFilterType;
  gain: number;
  q: number;
}

export interface Preset {
  id: string | number;
  name: string;
  gains: number[];
}

export type EqualizerStatus = 'ACTIVE' | 'FAILED' | 'IDEAL';
