import { AudioX } from 'audio';
import { isValidArray } from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { HlsListeners } from 'hls.js';
import {
  AudioEvents,
  EventListenerCallbackMap,
  EventListenersList,
  HlsEvents,
  HlsEventsCallbackMap
} from 'types/audioEvents.types';
import { AUDIO_EVENTS, HLS_EVENTS } from './audioEvents';

/**
 * this attaches event listeners, for audio also sends a flag to calculate playLog
 * loops through the event listeners map and attaches it to the audio element
 */
const attachDefaultEventListeners = (
  eventListenersCallbackMap: EventListenerCallbackMap,
  playLogEnabled: boolean = false
) => {
  const audioInstance = AudioX.getAudioInstance();
  isValidArray(Object.keys(eventListenersCallbackMap)) &&
    Object.keys(eventListenersCallbackMap).forEach((evt) => {
      let event = evt as keyof AudioEvents;
      audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
        if (evt && eventListenersCallbackMap[event]) {
          const listenerCallback = eventListenersCallbackMap[event];
          if (typeof listenerCallback === 'function') {
            listenerCallback(e, audioInstance, playLogEnabled);
          }
        }
      });
    });
};

const attachCustomEventListeners = (
  eventListenersList: EventListenersList,
  enablePlayLog: boolean = false
) => {
  const audioInstance = AudioX.getAudioInstance();
  if (isValidArray(eventListenersList)) {
    eventListenersList.forEach((evt) => {
      let event = evt as keyof AudioEvents;
      if (Object.keys(AUDIO_EVENTS).includes(event)) {
        audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
          ChangeNotifier.notify(AUDIO_EVENTS[event], {
            e,
            audioInstance,
            enablePlayLog
          });
        });
      }
    });
  }
};

const attachHlsEventsListeners = (
  hlsEventlistenerCallbackMap: HlsEventsCallbackMap,
  playLogEnabled: boolean = false
) => {
  const hlsInstance = AudioX.getHlsInstance();
  isValidArray(Object.keys(hlsEventlistenerCallbackMap)) &&
    Object.keys(hlsEventlistenerCallbackMap).forEach((evt) => {
      let event = evt as keyof HlsEvents;
      hlsInstance.on(
        HLS_EVENTS[event] as keyof HlsListeners,
        (e: any, data: any) => {
          if (event && hlsEventlistenerCallbackMap[event]) {
            const listenerCallback = hlsEventlistenerCallbackMap[event];
            if (typeof listenerCallback === 'function') {
              listenerCallback(e, data, hlsInstance, playLogEnabled);
            }
          }
        }
      );
    });
};

export {
  attachCustomEventListeners,
  attachDefaultEventListeners,
  attachHlsEventsListeners
};
