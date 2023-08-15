import { AudioX } from 'audio';
import { metaDataCreator } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { AudioState } from 'types';

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

export const updatePositionState = () => {
  ChangeNotifier.listen('AUDIO_X_STATE', (data: AudioState) => {
    if (data?.duration && data?.playbackRate && data?.progress) {
      navigator.mediaSession.setPositionState({
        duration: data.duration,
        playbackRate: data.playbackRate,
        position: data.progress
      });
    }
  });
};
