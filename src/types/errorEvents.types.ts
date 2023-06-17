export interface ErrorEvents {
  1: 'MEDIA_ERR_ABORTED';
  3: 'MEDIA_ERR_DECODE';
  2: 'MEDIA_ERR_NETWORK';
  4: 'MEDIA_ERR_SRC_NOT_SUPPORTED';
}

type ErrorKey = keyof ErrorEvents;
type ErrorValue = ErrorEvents[ErrorKey];

export type ErrorMessageMap = {
  [key in ErrorValue | 'DEFAULT']: string;
};
