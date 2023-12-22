export interface Band {
  frequency: number;
  type: BiquadFilterType;
  gain: number;
}

export interface Preset {
  id: string | number;
  name: string;
  gains: number[];
}

export type PresetsMeta = Omit<Preset, 'gains'>;
export type EqualizerStatus = 'ACTIVE' | 'FAILED' | 'IDEAL';
