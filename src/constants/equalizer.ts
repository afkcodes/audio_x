import { Band, Preset } from 'types/equalizer.types';

const bands: Band[] = [
  { frequency: 31, type: 'lowshelf', gain: 0 }, // Band 0: 31 Hz - Low Shelf Filter
  { frequency: 63, type: 'peaking', gain: 0 }, // Band 1: 63 Hz - Peaking Filter
  { frequency: 125, type: 'peaking', gain: 0 }, // Band 2: 125 Hz - Peaking Filter
  { frequency: 250, type: 'peaking', gain: 0 }, // Band 3: 250 Hz - Peaking Filter
  { frequency: 500, type: 'peaking', gain: 0 }, // Band 4: 500 Hz - Peaking Filter
  { frequency: 1000, type: 'peaking', gain: 0 }, // Band 5: 1 kHz - Peaking Filter
  { frequency: 2000, type: 'peaking', gain: 0 }, // Band 6: 2 kHz - Peaking Filter
  { frequency: 4000, type: 'peaking', gain: 0 }, // Band 7: 4 kHz - Peaking Filter
  { frequency: 8000, type: 'peaking', gain: 0 }, // Band 8: 8 kHz - Peaking Filter
  { frequency: 16000, type: 'highshelf', gain: 0 } // Band 9: 16 kHz - High Shelf Filter
];

const presets: Preset[] = [
  {
    id: 'preset_default',
    name: 'Default',
    gains: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  },
  {
    id: 'preset_live',
    name: 'Live',
    gains: [-2.9, 0.0, 2.4, 3.4, 3.4, 3.4, 2.4, 1.4, 1.4, 1.4]
  },
  {
    id: 'preset_acoustic',
    name: 'Acoustic',
    gains: [7.5, 7.5, 5.0, 2.0, 3.5, 3.5, 5.0, 6.0, 5.0, 2.5]
  },
  {
    id: 'preset_classical',
    name: 'Classical',
    gains: [7.5, 6.0, 5.0, 4.0, -2.5, -2.5, 0.0, 3.5, 5.0, 6.0]
  },
  {
    id: 'preset_piano',
    name: 'Piano',
    gains: [5.0, 3.0, 0.0, 4.5, 5.0, 2.5, 6.5, 7.5, 5.0, 5.5]
  },
  {
    id: 'preset_lounge',
    name: 'Lounge',
    gains: [-5.0, -2.5, -1.0, 2.0, 6.5, 2.0, 0.0, -2.5, 3.0, 1.5]
  },
  {
    id: 'preset_spoken_word',
    name: 'Spoken Word',
    gains: [-3.5, -0.5, 0.0, 1.0, 6.0, 7.5, 8.0, 7.0, 4.0, 0.0]
  },
  {
    id: 'preset_jazz',
    name: 'Jazz',
    gains: [6.5, 5.0, 2.0, 3.0, -2.5, -2.5, 0.0, 2.0, 5.0, 6.5]
  },
  {
    id: 'preset_pop',
    name: 'Pop',
    gains: [1.0, 2.9, 4.3, 4.8, 3.4, 0.0, -1.4, -1.4, 1.0, 1.0]
  },
  {
    id: 'preset_dance',
    name: 'Dance',
    gains: [6.0, 11.0, 7.5, 0.0, 2.5, 5.0, 8.0, 7.5, 6.0, 0.0]
  },
  {
    id: 'preset_latin',
    name: 'Latin',
    gains: [4.5, 2.5, 0.0, 0.0, -2.5, -2.5, -2.5, 0.0, 5.0, 7.5]
  },
  {
    id: 'preset_rnb',
    name: 'RnB',
    gains: [4.5, 11.5, 9.5, 2.0, -4.0, -2.5, 4.0, 4.5, 5.0, 6.0]
  },
  {
    id: 'preset_hiphop',
    name: 'HipHop',
    gains: [8.0, 7.0, 2.0, 5.0, -2.0, -1.5, 2.0, -1.0, 3.0, 5.0]
  },
  {
    id: 'preset_electronic',
    name: 'Electronic',
    gains: [7.0, 6.5, 2.0, 0.0, -3.0, 3.0, 1.5, 2.0, 6.5, 7.5]
  },
  {
    id: 'preset_techno',
    name: 'Techno',
    gains: [4.8, 3.4, 0.0, -3.4, -2.9, 0.0, 4.8, 5.8, 5.8, 5.3]
  },
  {
    id: 'preset_deep',
    name: 'Deep',
    gains: [7.5, 6.0, 2.5, 1.5, 5.0, 4.0, 2.5, -3.0, -6.0, -7.5]
  },
  {
    id: 'preset_club',
    name: 'Club',
    gains: [0.0, 0.0, 4.8, 3.4, 3.4, 3.4, 1.9, 0.0, 0.0, 0.0]
  },
  {
    id: 'preset_rock',
    name: 'Rock',
    gains: [8.0, 6.5, 5.0, 2.0, -0.5, -1.0, 0.5, 4.0, 5.5, 7.5]
  },
  {
    id: 'preset_rock_soft',
    name: 'Rock Soft',
    gains: [2.9, 1.0, 0.0, -1.4, 0.0, 2.4, 4.8, 5.8, 6.7, 7.2]
  },
  {
    id: 'preset_ska',
    name: 'Ska',
    gains: [-1.4, -2.9, -2.4, 0.0, 2.4, 3.4, 5.3, 5.8, 6.7, 5.8]
  },
  {
    id: 'preset_reggae',
    name: 'Reggae',
    gains: [0.0, 0.0, 0.0, -3.4, 0.0, 3.8, 3.8, 0.0, 0.0, 0.0]
  },

  {
    id: 'preset_headphones',
    name: 'Headphones',
    gains: [2.9, 6.7, 3.4, -1.9, -1.4, 1.0, 2.9, 5.8, 7.7, 8.6]
  },
  {
    id: 'preset_laptop_speakers',
    name: 'Laptop Speakers',
    gains: [5.6, 9.9, 6.0, 1.7, 2.1, 5.1, 5.6, 5.8, 7.7, 8.6]
  },
  {
    id: 'preset_small_speakers',
    name: 'Small Speakers',
    gains: [9.0, 7.0, 6.5, 4.0, 2.0, 0.0, -2.0, -4.5, -5.5, -7.0]
  },
  {
    id: 'preset_vocal_booster',
    name: 'Vocal Boost',
    gains: [-2.5, -5.0, -5.0, 2.0, 6.0, 6.0, 5.0, 2.5, 0.0, -2.5]
  },
  {
    id: 'preset_bass_booster',
    name: 'Bass Boost',
    gains: [7.5, 6.0, 5.0, 3.5, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0]
  },
  {
    id: 'preset_bass_reducer',
    name: 'Bass Reduce',
    gains: [-7.5, -6.0, -5.0, -4.0, -2.5, 0.0, 0.0, 3.5, 5.0, 6.0]
  },
  {
    id: 'preset_treble_booster',
    name: 'Treble Boost',
    gains: [0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 4.0, 6.0, 7.0, 8.5]
  },
  {
    id: 'preset_treble_reducer',
    name: 'Treble Reduce',
    gains: [0.0, 0.0, 0.0, 0.0, 0.0, -1.5, -4.0, -6.0, -7.0, -8.5]
  },
  {
    id: 'preset_bass_treble_booster',
    name: 'Bass Treble Boost',
    gains: [4.3, 3.4, 0.0, -4.3, -2.9, 1.0, 4.8, 6.7, 7.2, 7.2]
  }
];

export { bands, presets };
