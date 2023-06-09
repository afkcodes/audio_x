import { ErrorEvents } from 'types/errorEvents.types';

export const ERROR_EVENTS: ErrorEvents = Object.freeze({
  1: 'MEDIA_ERR_ABORTED',
  3: 'MEDIA_ERR_DECODE',
  2: 'MEDIA_ERR_NETWORK',
  4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
});
