import { AudioX } from 'audio';
import { AudioEvents, EventListenersList } from 'types/audioEvents.types';
import { AUDIO_EVENTS } from './audioEvents';

/**
 * this attaches event listeners, for audio
 */
const attachEventListeners = (eventListenersList: EventListenersList) => {
  const audioInstance = AudioX.getAudioInstance();
  eventListenersList.forEach((evt: keyof AudioEvents) => {
    audioInstance?.addEventListener(AUDIO_EVENTS[evt], (e: any) => {
      console.log(evt);
      // console.log(e);
    });
  });
};

export { attachEventListeners };
