declare global {
  interface Window {
    cast: any;
    chrome: any;
  }
}

import { CAST_JOIN_POLICY } from 'constants/cast';
import { URLS } from 'constants/common';
import { loadScript } from 'helpers/common';

class CastAdapter {
  private static _instance: CastAdapter;
  private castContext: any;

  constructor() {
    if (CastAdapter._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of Cast returning existing instance'
      );
      return CastAdapter._instance;
    }
    CastAdapter._instance = this;
  }

  async load() {
    await loadScript(
      URLS.CAST,
      () => {
        console.log('HLS Loaded');
      },
      'cast'
    )
      .then(() => {
        this.castContext = window.cast.framework.CastContext.getInstance();
      })
      .catch((msg: string) => {
        console.log(msg);
      });

    return this.castContext;
  }

  async init(
    receiverId: string = 'CC1AD845',
    joinPolicy: keyof typeof CAST_JOIN_POLICY = 'ORIGIN_SCOPED'
  ) {
    const castContext = await this.load();
    if (castContext) {
      castContext.setOptions({
        receiverApplicationId: receiverId,
        autoJoinPolicy: CAST_JOIN_POLICY[joinPolicy]
      });
    }
  }
}

export default CastAdapter;
