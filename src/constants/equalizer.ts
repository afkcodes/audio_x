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
    gains: [-1.0, 1.0, 3.0, 4.0, 4.0, 4.0, 3.0, 2.0, 2.0, 2.0]
  },
  {
    id: 'preset_acoustic',
    name: 'Acoustic',
    gains: [6.0, 6.0, 4.0, 1.0, 3.0, 3.0, 4.0, 5.0, 4.0, 1.5]
  },
  {
    id: 'preset_classical',
    name: 'Classical',
    gains: [6.0, 5.0, 4.0, 3.0, -1.0, -1.0, 0.0, 2.0, 4.0, 5.0]
  },
  {
    id: 'preset_piano',
    name: 'Piano',
    gains: [4.0, 2.0, 0.0, 3.5, 4.0, 1.5, 5.0, 6.0, 4.0, 4.5]
  },
  {
    id: 'preset_lounge',
    name: 'Lounge',
    gains: [-3.0, -1.5, 0.0, 1.0, 5.5, 1.0, 0.0, -1.5, 2.0, 0.5]
  },
  {
    id: 'preset_spoken_word',
    name: 'Spoken Word',
    gains: [-2.0, 0.0, 0.0, 1.0, 5.0, 6.5, 7.0, 6.0, 3.0, 0.0]
  },
  {
    id: 'preset_jazz',
    name: 'Jazz',
    gains: [5.5, 4.0, 1.0, 2.0, -1.5, -1.5, 0.0, 1.0, 4.0, 5.5]
  },
  {
    id: 'preset_pop',
    name: 'Pop',
    gains: [0.5, 2.4, 3.8, 4.3, 3.0, 0.0, -0.5, -0.5, 0.5, 0.5]
  },
  {
    id: 'preset_dance',
    name: 'Dance',
    gains: [5.0, 10.0, 6.5, 0.0, 2.0, 4.5, 7.5, 7.0, 5.5, 0.0]
  },
  {
    id: 'preset_latin',
    name: 'Latin',
    gains: [3.5, 1.5, 0.0, 0.0, -1.5, -1.5, -1.5, 0.0, 4.0, 6.5]
  },
  {
    id: 'preset_rnb',
    name: 'RnB',
    gains: [3.5, 10.5, 8.5, 1.0, -3.0, -1.5, 3.0, 3.5, 4.0, 5.0]
  },
  {
    id: 'preset_hiphop',
    name: 'HipHop',
    gains: [7.0, 6.0, 1.0, 4.0, -1.0, -0.5, 1.0, -0.5, 2.0, 4.0]
  },
  {
    id: 'preset_electronic',
    name: 'Electronic',
    gains: [6.0, 5.5, 1.0, 0.0, -2.0, 2.0, 1.0, 1.5, 5.5, 6.5]
  },
  {
    id: 'preset_techno',
    name: 'Techno',
    gains: [3.8, 2.4, 0.0, -2.4, -1.9, 0.0, 3.8, 4.8, 4.8, 4.3]
  },
  {
    id: 'preset_deep',
    name: 'Deep',
    gains: [6.0, 5.0, 1.5, 0.5, 4.0, 3.0, 1.5, -2.0, -5.0, -6.5]
  },
  {
    id: 'preset_club',
    name: 'Club',
    gains: [0.0, 0.0, 3.8, 2.4, 2.4, 2.4, 1.0, 0.0, 0.0, 0.0]
  },
  {
    id: 'preset_rock',
    name: 'Rock',
    gains: [7.0, 5.5, 4.0, 1.0, -0.5, 0.0, 0.5, 3.0, 4.5, 6.5]
  },
  {
    id: 'preset_rock_soft',
    name: 'Rock Soft',
    gains: [1.5, 0.0, 0.0, -0.5, 0.0, 1.0, 3.8, 4.8, 5.7, 6.2]
  },
  {
    id: 'preset_ska',
    name: 'Ska',
    gains: [-0.5, -1.5, -1.0, 0.0, 1.0, 2.0, 3.8, 4.3, 5.2, 4.3]
  },
  {
    id: 'preset_reggae',
    name: 'Reggae',
    gains: [0.0, 0.0, 0.0, -2.4, 0.0, 2.5, 2.5, 0.0, 0.0, 0.0]
  },
  {
    id: 'preset_country',
    name: 'Country',
    gains: [3.0, 2.0, 1.0, 0.0, -1.0, 0.0, 2.0, 3.0, 4.0, 4.0]
  },
  {
    id: 'preset_funk',
    name: 'Funk',
    gains: [4.0, 5.0, 3.0, 0.0, -1.0, 0.0, 2.0, 4.0, 5.0, 5.0]
  },
  {
    id: 'preset_blues',
    name: 'Blues',
    gains: [2.0, 1.0, 0.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0, 3.0]
  },
  {
    id: 'preset_metal',
    name: 'Metal',
    gains: [8.0, 7.0, 6.0, 4.0, 2.0, 1.0, 0.0, 2.0, 4.0, 6.0]
  },
  {
    id: 'preset_indie',
    name: 'Indie',
    gains: [2.0, 3.0, 2.0, 1.0, 0.0, -1.0, -2.0, 0.0, 3.0, 4.0]
  },
  {
    id: 'preset_chill',
    name: 'Chill',
    gains: [1.0, 1.0, 0.0, -1.0, -2.0, -1.0, 1.0, 2.0, 3.0, 2.0]
  },
  {
    id: 'preset_world',
    name: 'World',
    gains: [3.0, 2.0, 0.0, -2.0, -1.0, 1.0, 3.0, 4.0, 5.0, 3.0]
  },
  {
    id: 'preset_alternative',
    name: 'Alternative',
    gains: [3.0, 2.0, 1.0, 0.0, -1.0, -2.0, 1.0, 3.0, 4.0, 3.0]
  },
  {
    id: 'preset_ambient',
    name: 'Ambient',
    gains: [0.0, -1.0, -2.0, -3.0, -2.0, 0.0, 1.0, 2.0, 3.0, 2.0]
  },
  {
    id: 'preset_mellow',
    name: 'Mellow',
    gains: [1.0, 1.0, 0.0, -1.0, -2.0, -1.0, 1.0, 2.0, 3.0, 1.0]
  },
  {
    id: 'preset_grunge',
    name: 'Grunge',
    gains: [5.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0, 2.0, 4.0, 5.0]
  },
  {
    id: 'preset_soul',
    name: 'Soul',
    gains: [3.0, 3.0, 2.0, 1.0, 0.0, -1.0, 0.0, 2.0, 3.0, 3.0]
  },
  {
    id: 'preset_folk',
    name: 'Folk',
    gains: [2.0, 1.0, 0.0, -1.0, -2.0, -1.0, 1.0, 2.0, 3.0, 2.0]
  },
  {
    id: 'preset_trap',
    name: 'Trap',
    gains: [7.0, 6.0, 3.0, 1.0, -2.0, -1.0, 1.0, 3.0, 6.0, 7.0]
  },
  {
    id: 'preset_dubstep',
    name: 'Dubstep',
    gains: [6.0, 5.0, 4.0, 3.0, 2.0, 1.0, 1.0, 3.0, 5.0, 6.0]
  }
];

export { bands, presets };
