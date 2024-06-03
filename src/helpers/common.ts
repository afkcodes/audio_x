import { AudioX } from 'audio';
import { ERROR_MSG_MAP } from 'constants/common';
import { AudioEvents, AudioState, MediaTrack } from 'types';
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
  const queue = audio.getQueue();
  let hasEnded = false;

  const audioStateListener = (state: AudioState) => {
    if (state.playbackState === 'ended' && !hasEnded) {
      hasEnded = true;
      if (queue && isValidArray(queue)) {
        audio.playNext();
      }
    }
    if (state.playbackState !== 'ended') {
      hasEnded = false;
    }
  };

  ChangeNotifier.listen('AUDIO_STATE', audioStateListener);
};

const shuffle = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);

    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
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
  getReadableErrorMessage,
  handleQueuePlayback,
  isValidArray,
  isValidFunction,
  isValidObject,
  isValidWindow,
  loadScript,
  metaDataCreator,
  shuffle
};
