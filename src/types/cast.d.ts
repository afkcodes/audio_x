/**
 * Type definitions for Google Cast SDK
 */
interface Window {
  __gCastApiAvailable?: boolean | ((isAvailable: boolean) => void);
  cast?: any;
  chrome?: any;
}
