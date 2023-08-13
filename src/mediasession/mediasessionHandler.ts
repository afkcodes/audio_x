import { AudioX } from 'audio';
import { metaDataCreator } from 'helpers/common';

export const updateMetaData = (data: any) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(metaDataCreator(data));
  }
};

export const attachMediaSessionHandlers = () => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      const audioInstance = AudioX.getAudioInstance();

      audioInstance.play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      const audioInstance = AudioX.getAudioInstance();

      audioInstance.pause();
    });
  }
};
