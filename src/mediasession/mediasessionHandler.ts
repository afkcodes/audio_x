import { AudioX } from 'audio';
import { isValidWindow, metaDataCreator } from 'helpers/common';
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

export const resetPositionState = () => {
  if (isValidWindow && 'setPositionState' in navigator.mediaSession) {
    // Reset position state when media is reset.
    const { duration } = AudioX.getAudioInstance();
    console.log('reseting position state');
    console.log({ duration });
    navigator.mediaSession.setPositionState({
      position: 0.0,
      duration: 0.0,
      playbackRate: 1
    });
  }
};
