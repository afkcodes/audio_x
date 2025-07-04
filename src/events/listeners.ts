import HlsAdapter from 'adapters/hls';
import { AudioX } from 'audio';
import { isValidArray } from 'helpers/common';
import { notify } from 'helpers/notifier.js';
import type {
  AudioEvents,
  EventListenerCallbackMap,
  EventListenersList,
  HlsEvents,
  HlsEventsCallbackMap,
} from 'types/audioEvents.types';
import type { HlsListeners } from '../types/hls.js.js';
import { AUDIO_EVENTS, HLS_EVENTS } from './audioEvents';

/**
 * this attaches event listeners, for audio also sends a flag to calculate playLog
 * loops through the event listeners map and attaches it to the audio element
 */
const attachEventListeners = (
  eventListenersCallbackMap: EventListenerCallbackMap,
  playLogEnabled = false,
) => {
  const audioInstance = AudioX.getAudioInstance();
  if (isValidArray(Object.keys(eventListenersCallbackMap))) {
    for (const evt of Object.keys(eventListenersCallbackMap)) {
      const event = evt as keyof AudioEvents;
      audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
        if (evt && eventListenersCallbackMap[event]) {
          const listenerCallback = eventListenersCallbackMap[event];
          if (typeof listenerCallback === 'function') {
            listenerCallback(e, audioInstance, playLogEnabled);
          }
        }
      });
    }
  }
};

const attachCustomEventListeners = (
  eventListenersList: EventListenersList,
  enablePlayLog = false,
) => {
  const audioInstance = AudioX.getAudioInstance();
  if (isValidArray(eventListenersList)) {
    for (const evt of eventListenersList) {
      const event = evt as keyof AudioEvents;
      if (Object.keys(AUDIO_EVENTS).includes(event)) {
        audioInstance?.addEventListener(AUDIO_EVENTS[event], (e: Event) => {
          notify(AUDIO_EVENTS[event], {
            e,
            audioInstance,
            enablePlayLog,
          });
        });
      }
    }
  }
};

const attachHlsEventsListeners = (
  hlsEventlistenerCallbackMap: HlsEventsCallbackMap,
  playLogEnabled = false,
) => {
  const hls = new HlsAdapter();
  const hlsInstance = hls.getHlsInstance();
  if (isValidArray(Object.keys(hlsEventlistenerCallbackMap))) {
    for (const evt of Object.keys(hlsEventlistenerCallbackMap)) {
      const event = evt as keyof HlsEvents;
      hlsInstance.on(HLS_EVENTS[event] as keyof HlsListeners, (e: unknown, data: unknown) => {
        if (event && hlsEventlistenerCallbackMap[event]) {
          const listenerCallback = hlsEventlistenerCallbackMap[event];
          if (typeof listenerCallback === 'function') {
            listenerCallback(e as Event, data, hlsInstance, playLogEnabled);
          }
        }
      });
    }
  }
};

export { attachCustomEventListeners, attachEventListeners, attachHlsEventsListeners };
