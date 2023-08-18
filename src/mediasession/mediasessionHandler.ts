import { AudioX } from 'audio';
import { metaDataCreator } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { AudioState } from 'types';

export const updateMetaData = (data: any) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(metaDataCreator(data));
    updatePositionState();
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
  if ('setPositionState' in navigator.mediaSession) {
    const audioState = ChangeNotifier.getLatestState(
      'AUDIO_X_STATE'
    ) as AudioState;
    const { currentTime, duration } = AudioX.getAudioInstance();

    navigator.mediaSession.setPositionState({
      duration: duration,
      playbackRate: audioState.playbackRate,
      position: currentTime
    });
  }
};
