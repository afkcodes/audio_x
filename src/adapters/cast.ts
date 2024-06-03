import { AudioX } from 'audio';
import {
  CAST_JOIN_POLICY,
  CAST_META_DATA,
  DEFAULT_CAST_CONFIG
} from 'constants/cast';
import { URLS } from 'constants/common';
import { createCastMediaTrack, loadScript } from 'helpers/common';
import { AudioState, JoinPolicy } from 'types';

class CastAdapter {
  private static _instance: CastAdapter;
  private castContext: any;
  private chromeCast: any;
  private remotePlayer: any;
  private remotePlayerController: any;

  constructor() {
    if (CastAdapter._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instances of Cast framework returning existing instance'
      );
      return CastAdapter._instance;
    }
    CastAdapter._instance = this;
  }

  async load(
    retryCount: number = 0,
    maxRetries: number = 10,
    retryDelay: number = 300
  ): Promise<any> {
    try {
      await loadScript(
        URLS.CAST,
        () => {
          console.log('Cast framework loaded');
        },
        'cast'
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.castContext = window.cast.framework.CastContext.getInstance();
      this.chromeCast = window.chrome.cast;

      if (this.castContext) {
        return this.castContext;
      } else {
        if (retryCount < maxRetries) {
          console.log(
            `Cast framework not ready. Retrying in ${retryDelay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return this.load(retryCount + 1, maxRetries, retryDelay);
        } else {
          throw new Error(
            'Failed to initialize Cast framework after multiple retries.'
          );
        }
      }
    } catch (error) {
      console.error('Error loading Cast framework:', error);
      throw error;
    }
  }

  async init(
    receiverId: string = DEFAULT_CAST_CONFIG.receiverId,
    joinPolicy: keyof JoinPolicy = DEFAULT_CAST_CONFIG.joinPolicy,
    enablePlayLog?: boolean
  ) {
    if (!this.castContext) {
      const castContext = await this.load();
      if (castContext) {
        castContext.setOptions({
          receiverApplicationId: receiverId,
          autoJoinPolicy: CAST_JOIN_POLICY[joinPolicy]
        });
        return castContext;
      } else {
        console.warn('Cast framework is already initialized.');
      }
    }
  }

  castAudio() {
    console.log('::CAST - castAudio::', this.castContext);
    this.castContext.requestSession().then(() => {
      if (this.getCastSession()) {
        this.initializeRemotePlayer();
        const mediaInfo = this.createCastMedia();
        this.createLoadRequest(mediaInfo).then((request) => {
          // attach event listeners
          if (request) {
            this.loadMedia(request);
            this.remotePlayerController.playOrPause();
          }
        });
      } else {
        throw new Error(
          'Device connection failed - Cast session request failed'
        );
      }
    });
  }

  createCastMedia() {
    const audio = new AudioX();
    const audioState: AudioState = audio.getAudioState();
    const { currentTrack } = audioState;
    const castMediaTrack = createCastMediaTrack(currentTrack);
    const mediaInfo = new this.chromeCast.media.MediaInfo(
      currentTrack.source,
      'audio/mp3'
    );
    mediaInfo.metadata = new this.chromeCast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = CAST_META_DATA.GENERIC;
    mediaInfo.metadata = castMediaTrack;
    return mediaInfo;
  }

  async createLoadRequest(mediaInfo: any) {
    const audio = new AudioX();
    const audioState: AudioState = audio.getAudioState();
    const request = new this.chromeCast.media.LoadRequest(mediaInfo);
    request.autoplay = audioState.playbackState === 'playing';
    return request;
  }

  async loadMedia(request: any) {
    await this.getCastSession().loadMedia(request);
  }

  initializeRemotePlayer() {
    this.remotePlayer = new window.cast.framework.RemotePlayer();
    this.remotePlayerController =
      new window.cast.framework.RemotePlayerController(this.remotePlayer);
  }

  getRemotePlayer() {
    if (this.getCastSession()) {
      return this.remotePlayer;
    } else {
      console.error('Failed to get remotePlayer - No cast session active');
    }
  }

  getRemotePlayerController() {
    if (this.getCastSession()) {
      return this.remotePlayerController;
    } else {
      console.error(
        'Failed to get remotePlayerController - No cast session active'
      );
    }
  }

  getCastSession() {
    return this.castContext.getCurrentSession();
  }
}

export default CastAdapter;
