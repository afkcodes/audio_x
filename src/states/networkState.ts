// import { NetworkState } from 'types/networkState.types';

import { NetworkState } from 'types';

// Ref: https://html.spec.whatwg.org/multipage/media.html#network-states
export const NETWORK_STATE: NetworkState = Object.freeze({
  0: 'NETWORK_EMPTY',
  1: 'NETWORK_IDLE',
  2: 'NETWORK_LOADING',
  3: 'NETWORK_NO_SOURCE',
});
