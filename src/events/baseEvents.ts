import { EventListenerCallbackMap } from 'types';

const BASE_EVENT_CALLBACK_MAP: EventListenerCallbackMap = {
  LOADED_META_DATA: (e: Event) => {
    console.log(e.type);
  },
  CAN_PLAY: (e: Event) => {
    console.log(e.type);
  },
  CAN_PLAY_THROUGH: (e: Event) => {
    console.log(e.type);
  },
  PLAY: (e: Event) => {
    console.log(e.type);
  },
  PAUSE: (e: Event) => {
    console.log(e.type);
  },
  ENDED: (e: Event) => {
    console.log(e.type);
  },
  ERROR: (e: Event) => {
    console.log(e.type);
  },
  TIME_UPDATE: (e: Event) => {
    console.log(e.type);
  },
  WAITING: (e: Event) => {
    console.log(e.type);
  },
  VOLUME_CHANGE: (e: Event) => {
    console.log(e.type);
  },
};

export { BASE_EVENT_CALLBACK_MAP };
