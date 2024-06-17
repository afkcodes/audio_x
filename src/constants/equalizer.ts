import { Band } from 'types/equalizer.types';

const bands: Band[] = [
  { frequency: 31, type: 'lowshelf', gain: 0 },
  { frequency: 63, type: 'peaking', gain: 0 },
  { frequency: 125, type: 'peaking', gain: 0 },
  { frequency: 250, type: 'peaking', gain: 0 },
  { frequency: 500, type: 'peaking', gain: 0 },
  { frequency: 1000, type: 'peaking', gain: 0 },
  { frequency: 2000, type: 'peaking', gain: 0 },
  { frequency: 4000, type: 'peaking', gain: 0 },
  { frequency: 8000, type: 'peaking', gain: 0 },
  { frequency: 16000, type: 'highshelf', gain: 0 }
];

const presets = [
  {
    name: 'Default',
    id: 'default',
    default: true,
    gains: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
  },
  {
    name: 'Club',
    id: 'club',
    default: true,
    gains: [0.0, 0.0, 4.8, 3.36, 3.36, 3.36, 1.92, 0.0, 0.0, 0.0]
  },
  {
    name: 'Live',
    id: 'live',
    default: true,
    gains: [-2.88, 0.0, 2.4, 3.36, 3.36, 3.36, 2.4, 1.44, 1.44, 1.44]
  },
  {
    name: 'Party',
    id: 'Party',
    default: true,
    gains: [4.32, 4.32, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.32, 4.32]
  },
  {
    name: 'Pop',
    id: 'pop',
    default: true,
    gains: [0.96, 2.88, 4.32, 4.8, 3.36, 0.0, -1.44, -1.44, 0.96, 0.96]
  },
  {
    name: 'Soft',
    id: 'soft',
    default: true,
    gains: [2.88, 0.96, 0.0, -1.44, 0.0, 2.4, 4.8, 5.76, 6.72, 7.2]
  },
  {
    name: 'Ska',
    id: 'ska',
    default: true,
    gains: [-1.44, -2.88, -2.4, 0.0, 2.4, 3.36, 5.28, 5.76, 6.72, 5.76]
  },
  {
    name: 'Reggae',
    id: 'reggae',
    default: true,
    gains: [0.0, 0.0, 0.0, -3.36, 0.0, 3.84, 3.84, 0.0, 0.0, 0.0]
  },

  {
    name: 'Rock',
    id: 'rock',
    default: true,
    gains: [4.8, 2.88, -3.36, -4.8, -1.92, 2.4, 5.28, 6.72, 6.72, 6.72]
  },
  {
    name: 'Dance',
    id: 'dance',
    default: true,
    gains: [5.76, 4.32, 1.44, 0.0, 0.0, -3.36, -4.32, -4.32, 0.0, 0.0]
  },
  {
    name: 'Techno',
    id: 'techno',
    default: true,
    gains: [4.8, 3.36, 0.0, -3.36, -2.88, 0.0, 4.8, 5.76, 5.76, 5.28]
  },
  {
    name: 'Headphones',
    id: 'headphones',
    default: true,
    gains: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64]
  },
  {
    name: 'Soft rock',
    id: 'soft_rock',
    default: true,
    gains: [2.4, 2.4, 1.44, 0.0, -2.4, -3.36, -1.92, 0.0, 1.44, 5.28]
  },
  {
    name: 'Classical',
    id: 'classical',
    default: true,
    gains: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -4.32, -4.32, -4.32, -5.76]
  },
  {
    name: 'Large Hall',
    id: 'large_hall',
    default: true,
    gains: [6.24, 6.24, 3.36, 3.36, 0.0, -2.88, -2.88, -2.88, 0.0, 0.0]
  },
  {
    name: 'Full Bass',
    id: 'full_base',
    default: true,
    gains: [4.8, 5.76, 5.76, 3.36, 0.96, -2.4, -4.8, -6.24, -6.72, -6.72]
  },
  {
    name: 'Full Treble',
    id: 'full_treble',
    default: true,
    gains: [-5.76, -5.76, -5.76, -2.4, 1.44, 6.72, 9.6, 9.6, 9.6, 10.08]
  },
  {
    name: 'Laptop Speakers',
    id: 'laptop_speakers',
    default: true,
    gains: [2.88, 6.72, 3.36, -1.92, -1.44, 0.96, 2.88, 5.76, 7.68, 8.64]
  },
  {
    name: 'Full Bass & Treble',
    id: 'bass_treble',
    default: true,
    gains: [4.32, 3.36, 0.0, -4.32, -2.88, 0.96, 4.8, 6.72, 7.2, 7.2]
  }
];

export { bands, presets };
