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
  private remotePlayer: any;
  private remotePlayerController: any;
  private castSession: any;

  constructor() {
    if (CastAdapter._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instances of Cast framework returning existing instance'
      );
      return CastAdapter._instance;
    }
    CastAdapter._instance = this;
  }

  async load() {
    await loadScript(
      URLS.CAST,
      () => {
        console.log('Cast framework Loaded');
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

  castAudio() {
    this.castContext.requestSession().then(() => {
      if (!this.castContext.getCurrentSession()) {
        throw new Error(
          'Failed to request Cast Session -  Device Connection Failed'
        );
      } else {
        this.castSession = this.castContext.getCurrentSession();
        this.initializeRemotePlayer();
      }
    });
  }

  initializeRemotePlayer() {
    this.remotePlayer = new window.cast.framework.RemotePlayer();
    this.remotePlayerController =
      new window.cast.framework.RemotePlayerController(this.remotePlayer);
  }

  getRemotePlayer() {
    if (this.castSession) {
      return this.remotePlayer;
    } else {
      console.error('Failed to get remotePlayer - No Cast Session active');
    }
  }

  getRemotePlayerController() {
    if (this.castSession) {
      return this.remotePlayerController;
    } else {
      console.error(
        'Failed to get remotePlayerController - No Cast Session active'
      );
    }
  }

  getCastSession() {
    return this.castSession ? this.castSession : undefined;
  }
}

export default CastAdapter;
