import { ERROR_MSG_MAP } from 'constants/common';

const isValidArray = (arr: any[]) => arr && Array.isArray(arr) && arr.length;
const isValidFunction = (fn: any) =>
  fn instanceof Function && typeof fn === 'function';

const isValidObject = (obj: any) =>
  typeof obj === 'object' &&
  obj !== null &&
  obj instanceof Object &&
  Object.keys(obj).length;

const isValidWindow = typeof window !== undefined && window instanceof Window;

const getReadableErrorMessage = (audioInstance: HTMLAudioElement) => {
  let message = '';
  const err = audioInstance.error;

  switch (err?.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      message += ERROR_MSG_MAP['MEDIA_ERR_ABORTED'];
      break;
    case MediaError.MEDIA_ERR_NETWORK:
      message += ERROR_MSG_MAP['MEDIA_ERR_NETWORK'];
      break;
    case MediaError.MEDIA_ERR_DECODE:
      message += ERROR_MSG_MAP['MEDIA_ERR_DECODE'];
      break;
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      message += ERROR_MSG_MAP['MEDIA_ERR_SRC_NOT_SUPPORTED'];
      break;
    default:
      message += ERROR_MSG_MAP['DEFAULT'];
      break;
  }

  return message;
};

export {
  getReadableErrorMessage,
  isValidArray,
  isValidFunction,
  isValidObject,
  isValidWindow
};
