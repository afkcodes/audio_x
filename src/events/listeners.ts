import { AudioX } from 'audio';
import { isValidArray } from 'helpers/common';
import { AudioEvents, EventListenerCallbackMap } from 'types/audioEvents.types';
import { AUDIO_EVENTS } from './audioEvents';

/**
 * this attaches event listeners, for audio
 */
const attachEventListeners = (
  eventListenersCallbackMap: EventListenerCallbackMap
) => {
  const audioInstance = AudioX.getAudioInstance();
  isValidArray(Object.keys(eventListenersCallbackMap)) &&
    Object.keys(eventListenersCallbackMap).forEach((evt) => {
      let event = evt as keyof AudioEvents;
      audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
        if (evt && eventListenersCallbackMap[event]) {
          const listenerCallback = eventListenersCallbackMap[event];
          if (typeof listenerCallback === 'function') listenerCallback(e);
        }
      });
    });
};

export { attachEventListeners };
