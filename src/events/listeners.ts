import { AudioX } from 'audio';
import { isValidArray } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import {
  AudioEvents,
  EventListenerCallbackMap,
  EventListenersList,
} from 'types/audioEvents.types';
import { AUDIO_EVENTS } from './audioEvents';

/**
 * this attaches event listeners, for audio
 */
const attachDefaultEventListeners = (
  eventListenersCallbackMap: EventListenerCallbackMap
) => {
  const audioInstance = AudioX.getAudioInstance();
  isValidArray(Object.keys(eventListenersCallbackMap)) &&
    Object.keys(eventListenersCallbackMap).forEach((evt) => {
      let event = evt as keyof AudioEvents;
      audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
        if (evt && eventListenersCallbackMap[event]) {
          const listenerCallback = eventListenersCallbackMap[event];
          if (typeof listenerCallback === 'function') {
            listenerCallback(e, audioInstance);
          }
        }
      });
    });
};

const attachCustomEventListeners = (eventListenersList: EventListenersList) => {
  const audioInstance = AudioX.getAudioInstance();
  if (isValidArray(eventListenersList)) {
    eventListenersList.forEach((evt) => {
      let event = evt as keyof AudioEvents;
      if (Object.keys(AUDIO_EVENTS).includes(event)) {
        audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
          ChangeNotifier.notify(AUDIO_EVENTS[event], { e, audioInstance });
        });
      }
    });
  }
};

export { attachCustomEventListeners, attachDefaultEventListeners };
