import { AudioX } from 'audio';
import { ERROR_MSG_MAP } from 'constants/common';
import { AudioEvents, AudioState, MediaTrack } from 'types';
import { LoopMode } from 'types/audio.types';
import { GenericMediaTrack } from 'types/cast.types';
import ChangeNotifier from './notifier';

const isValidArray = (arr: any[]) => arr && Array.isArray(arr) && arr.length;
const isValidFunction = (fn: any) =>
  fn instanceof Function && typeof fn === 'function';

const isValidObject = (obj: any) =>
  typeof obj === 'object' &&
  obj !== null &&
  obj instanceof Object &&
  Object.keys(obj).length;

const isValidWindow = typeof window !== undefined && window instanceof Window;

const getReadableErrorMessage = (audioInstance: HTMLAudioElement) => {
  let message = '';
  const err = audioInstance.error;

  switch (err?.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      message += ERROR_MSG_MAP['MEDIA_ERR_ABORTED'];
      break;
    case MediaError.MEDIA_ERR_NETWORK:
      message += ERROR_MSG_MAP['MEDIA_ERR_NETWORK'];
      break;
    case MediaError.MEDIA_ERR_DECODE:
      message += ERROR_MSG_MAP['MEDIA_ERR_DECODE'];
      break;
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      message += ERROR_MSG_MAP['MEDIA_ERR_SRC_NOT_SUPPORTED'];
      break;
    default:
      message += ERROR_MSG_MAP['DEFAULT'];
      break;
  }

  return message;
};

const metaDataCreator = (mediaTrack: MediaTrack) => {
  const { title, album, artist, artwork } = mediaTrack;
  const artworkUrl = artwork ? artwork[0]?.src : '';
  const sizes = [
    '96x96',
    '128x128',
    '192x192',
    '256x256',
    '384x384',
    '512x512'
  ];
  const artworkMap = sizes.map((el) => {
    return { src: artworkUrl, sizes: el, type: 'image/png' };
  });
  const metaData = {
    title,
    album,
    artist,
    artwork: artworkMap
  };
  return metaData;
};

let previousTrackPlayTime = 0;
export const calculateActualPlayedLength = (
  audioInstance: HTMLAudioElement,
  event?: keyof AudioEvents
) => {
  const lengthSet = new Set();
  for (let i = 0; i < audioInstance.played.length; i++) {
    const startX = audioInstance.played.start(i);
    const endX = audioInstance.played.end(i);
    const width = endX - startX;
    lengthSet.add(width);
  }
  const lengthArr = [...lengthSet] as number[];
  const currentTrackPlayTime = lengthArr.reduce((acc, val) => acc + val, 0);

  previousTrackPlayTime = ['ENDED', 'TRACK_CHANGE', 'PAUSE'].includes(
    event as keyof AudioEvents
  )
    ? currentTrackPlayTime
    : previousTrackPlayTime;
  ChangeNotifier.notify('AUDIO_STATE', {
    currentTrackPlayTime,
    previousTrackPlayTime
  });
};

const loadedScripts: { [key: string]: boolean } = {};

const loadScript = (
  url: string,
  onLoad: () => void,
  name: string,
  async: boolean = true
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window instanceof Window && window.document) {
      if (!loadedScripts[name]) {
        loadedScripts[name] = true;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = async;
        script.onload = () => {
          console.log(`Script ${name} loaded successfully`);
          onLoad();
          resolve();
        };
        script.onerror = (error) => {
          console.error(`Error loading script ${name}:`, error);
          reject(error);
        };
        document.head.appendChild(script);
      } else {
        console.log(`Script ${name} already loaded`);
        onLoad();
        resolve();
      }
    } else {
      const errorMessage = `Window not ready, unable to initialize ${name}`;
      console.error(errorMessage);
      reject(errorMessage);
    }
  });
};

const handleQueuePlayback = () => {
  const audio = new AudioX();
  let hasEnded = false;

  const audioStateListener = (state: AudioState) => {
    if (state.playbackState === 'ended' && !hasEnded) {
      const queue = audio.getQueue();
      hasEnded = true;
      if (queue && isValidArray(queue) && hasEnded) {
        audio.playNext();
      }
    }
    if (state.playbackState !== 'ended') {
      hasEnded = false;
    }
  };

  ChangeNotifier.listen('AUDIO_STATE', audioStateListener);
};

const getBufferedDuration = (audioInstance: HTMLAudioElement) => {
  const { buffered } = audioInstance;
  let bufferedDuration = 0;

  for (let i = 0; i < buffered.length; i++) {
    bufferedDuration += buffered.end(i) - buffered.start(i);
  }

  return bufferedDuration;
};

const shuffle = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const handleLoopPlayback = (loopMode: LoopMode) => {
  const audio = new AudioX();
  const audioInstance = AudioX.getAudioInstance();

  if (loopMode === 'OFF') {
    audioInstance.loop = false;
  }
  if (loopMode === 'SINGLE') {
    audioInstance.loop = true;
  }
  if (loopMode === 'QUEUE') {
    const queue = audio.getQueue();
    // switching off single
    handleLoopPlayback('OFF');
    console.log('LOOP_MODE', loopMode);
    ChangeNotifier.listen('AUDIO_STATE', (audioState: AudioState) => {
      if (audioState.playbackState === 'queueended' && isValidArray(queue)) {
        audio.addMediaAndPlay(queue[0]);
      }
    });
  }
};

const diffChecker = (d1: any, d2: any): boolean => {
  if (d1 === null && d2 === null) {
    return true;
  }

  if (d1 === null || d2 === null) {
    return false;
  }

  if (typeof d1 !== typeof d2) {
    return false;
  }

  if (typeof d1 !== 'object') {
    return d1 === d2;
  }

  if (Array.isArray(d1) && Array.isArray(d2)) {
    if (d1.length !== d2.length) {
      return false;
    }

    return d1.every((item, index) => diffChecker(item, d2[index]));
  }

  const keys1 = Object.keys(d1);
  const keys2 = Object.keys(d2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    if (!keys2.includes(key)) {
      return false;
    }

    return diffChecker(d1[key], d2[key]);
  });
};

const createCastMediaTrack = (currentTrack: MediaTrack) => {
  const castMediaTrack: GenericMediaTrack = {
    images: currentTrack.artwork?.map((artwork) => ({ url: artwork.src })),
    title: currentTrack.title,
    artist: currentTrack.artist,
    albumName: currentTrack.album,
    subtitle: currentTrack.comment,
    releaseDate: currentTrack.year as string
  };

  return castMediaTrack;
};

export {
  createCastMediaTrack,
  diffChecker,
  getBufferedDuration,
  getReadableErrorMessage,
  handleLoopPlayback,
  handleQueuePlayback,
  isValidArray,
  isValidFunction,
  isValidObject,
  isValidWindow,
  loadScript,
  metaDataCreator,
  shuffle
};
