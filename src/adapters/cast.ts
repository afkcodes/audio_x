import { AudioX } from 'audio';
import {
  CAST_JOIN_POLICY,
  CAST_META_DATA,
  DEFAULT_CAST_CONFIG
} from 'constants/cast';
import { PLAYBACK_STATE, URLS } from 'constants/common';
import {
  createCastMediaTrack,
  isValidWindow,
  loadScript
} from 'helpers/common';
import ChangeNotifier from 'helpers/notifier';
import { CAST_SESSION_STATE } from 'states/castState';
import {
  AudioError,
  AudioState,
  JoinPolicy,
  MediaTrack,
  PlayBackState
} from 'types';

class CastAdapter {
  private static _instance: CastAdapter;
  private castContext: any;
  private chromeCast: any;
  private remotePlayer: any;
  private remotePlayerController: any;
  private audio: AudioX;
  private audioInstance: HTMLAudioElement;
  private notifier = ChangeNotifier;

  constructor() {
    if (CastAdapter._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instances of Cast framework returning existing instance'
      );
      return CastAdapter._instance;
    }
    CastAdapter._instance = this;
    this.audio = new AudioX();
    this.audioInstance = AudioX.getAudioInstance();
  }

  async load(
    retryCount: number = 0,
    maxRetries: number = 10,
    retryDelay: number = 150
  ): Promise<any> {
    try {
      await loadScript(
        URLS.CAST,
        () => console.log('Cast framework loaded'),
        'cast'
      );
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (isValidWindow) {
        this.castContext = window.cast.framework.CastContext.getInstance();
        this.chromeCast = window.chrome.cast;
      } else {
        console.error(
          'window is not defined, please make sure cast window is loaded before'
        );
        throw new Error('Window not available for Cast framework');
      }

      if (this.castContext) {
        return this.castContext;
      } else if (retryCount < maxRetries) {
        console.log(`Cast framework not ready. Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.load(retryCount + 1, maxRetries, retryDelay);
      } else {
        throw new Error(
          'Failed to initialize Cast framework after multiple retries.'
        );
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

  createCastMedia() {
    const audioState = this.audio.getAudioState();
    const currentTrack = audioState.currentTrack;

    if (!currentTrack || !currentTrack.source) {
      throw new Error('No valid MediaTrack provided for casting');
    }

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
    const audioState = this.audio.getAudioState();
    const request = new this.chromeCast.media.LoadRequest(mediaInfo);
    request.autoplay = audioState.playbackState === PLAYBACK_STATE.PLAYING;
    request.currentTime = this.audioInstance.currentTime || 0;
    return request;
  }

  async loadMedia(request: any) {
    await this.getCastSession().loadMedia(request);
    this.attachCastEventListeners();
  }

  initializeRemotePlayer() {
    if (isValidWindow) {
      this.remotePlayer = new window.cast.framework.RemotePlayer();
      this.remotePlayerController =
        new window.cast.framework.RemotePlayerController(this.remotePlayer);
    } else {
      console.error(
        'window is not defined, please make sure cast window is loaded before'
      );
    }
  }

  getRemotePlayer() {
    return this.getCastSession() ? this.remotePlayer : null;
  }

  getRemotePlayerController() {
    return this.getCastSession() ? this.remotePlayerController : null;
  }

  getCastSession() {
    return this.castContext ? this.castContext.getCurrentSession() : null;
  }

  async castAudio() {
    const audioState = this.audio.getAudioState();
    await this.castContext.requestSession();
    if (!this.getCastSession()) {
      throw new Error('Device connection failed - Cast session request failed');
    }

    this.initializeRemotePlayer();
    if (!this.remotePlayer || !this.remotePlayerController) {
      console.error('Remote player not initialized, window may not be defined');
      return;
    }

    const mediaInfo = this.createCastMedia();
    const request = await this.createLoadRequest(mediaInfo);

    await this.loadMedia(request)
      .then(() => {
        this.audio.pause();
        this.audio.mute();

        // if (audioState.playbackState === 'playing') {
        //   this.play();
        // }

        // this.updateFullAudioState(
        //   audioState.playbackState,
        //   track || audioState.currentTrack
        // );

        if (isValidWindow) {
          this.castContext.addEventListener(
            window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
            (event: any) => {
              if (event.sessionState === CAST_SESSION_STATE.SESSION_ENDED) {
                // update AudioState to reset castState
                this.notifier.notify('AUDIO_STATE', {
                  castDevice: null,
                  isCasting: false
                } as AudioState);

                // unmute the player and start on-device playback
                this.audio.unmute();
                this.audio.play();
              }

              if (event.sessionState === CAST_SESSION_STATE.SESSION_STARTED) {
                const castDevice =
                  this.getCastSession().getCastDevice().friendlyName ||
                  'audio_x_chromeCast';

                // setting up Cast Device Name & and isCasting
                this.notifier.notify('AUDIO_STATE', {
                  castDevice: castDevice,
                  isCasting: true
                } as AudioState);
              }
            }
          );
        } else {
          console.error(
            'window is not defined, please make sure cast window is loaded before'
          );
        }
      })
      .catch((error) => {
        console.error('Failed to cast audio:', error);
        ChangeNotifier.notify('AUDIO_STATE', {
          ...audioState,
          error: {
            code: 'CAST_ERROR',
            message: error.message,
            readable: 'Failed to start casting'
          },
          isCasting: false
        });
        throw error;
      });
  }

  play() {
    const controller = this.getRemotePlayerController();
    const remotePlayer = this.getRemotePlayer();
    const audioState = this.audio.getAudioState();

    if (controller && remotePlayer) {
      if (remotePlayer.isPaused) {
        controller.playOrPause();
        this.updateFullAudioState('playing');
      } else if (
        remotePlayer.playerState === window.chrome.cast.media.PlayerState.IDLE
      ) {
        const currentTrack = audioState.currentTrack;
        if (currentTrack) {
          console.log(
            'Reloading current track to resume playback:',
            currentTrack
          );
          this.castAudio(currentTrack);
        } else {
          console.error('No current track to reload');
        }
      }
    } else {
      console.error('Cannot play: No active cast session or remote player');
    }
  }

  pause() {
    const controller = this.getRemotePlayerController();
    if (controller && !this.remotePlayer.isPaused) {
      controller.playOrPause();
      this.updateFullAudioState('paused');
    }
  }

  stop() {
    const controller = this.getRemotePlayerController();
    if (controller) {
      controller.stop();
      this.updateFullAudioState('idle', undefined, 0);
    }
  }

  seek(time: number) {
    const remotePlayer = this.getRemotePlayer();
    if (remotePlayer) {
      remotePlayer.currentTime = time;
      this.getRemotePlayerController()?.seek();
      this.updateFullAudioState(undefined, undefined, time);
    }
  }

  async playNext() {
    const queue = this.audio.getQueue();
    const currentIndex = this.audio.getCurrentQueueIndex();
    const nextIndex = currentIndex + 1;

    if (queue.length > nextIndex) {
      const nextTrack = queue[nextIndex];
      const mediaInfo = this.createCastMedia(nextTrack);
      const request = await this.createLoadRequest(mediaInfo);
      try {
        await this.loadMedia(request);
        this.audio.setCurrentQueueIndex(nextIndex);
        this.updateFullAudioState('playing', nextTrack, 0);
        console.log('Next track loaded successfully:', nextTrack);
      } catch (error) {
        console.error('Failed to load next track:', error);
        this.updateFullAudioState('error', undefined, 0, {
          code: 'LOAD_ERROR',
          message: (error as any).message,
          readable: 'Failed to play next track'
        });
      }
    } else {
      this.stop();
      this.updateFullAudioState('queueended');
    }
  }

  async playPrevious() {
    const queue = this.audio.getQueue();
    const currentIndex = this.audio.getCurrentQueueIndex();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevTrack = queue[prevIndex];
      const mediaInfo = this.createCastMedia(prevTrack);
      const request = await this.createLoadRequest(mediaInfo);
      await this.loadMedia(request);
      this.audio.setCurrentQueueIndex(prevIndex);
      this.updateFullAudioState('playing', prevTrack, 0);
    }
  }

  private updateFullAudioState(
    playbackState?: string,
    currentTrack?: MediaTrack,
    progress?: number,
    error?: AudioError
  ) {
    const audioState = this.audio.getAudioState();
    const remotePlayer = this.getRemotePlayer();

    const newState: AudioState = {
      playbackState:
        (playbackState as PlayBackState) || audioState.playbackState,
      duration: remotePlayer?.duration || audioState.duration,
      bufferedDuration: 0,
      progress:
        progress !== undefined
          ? progress
          : remotePlayer?.currentTime || audioState.progress,
      volume: audioState.volume,
      playbackRate: audioState.playbackRate,
      error: error || audioState.error,
      currentTrack: currentTrack || audioState.currentTrack,
      currentTrackPlayTime:
        progress !== undefined
          ? progress
          : remotePlayer?.currentTime || audioState.currentTrackPlayTime,
      previousTrackPlayTime: audioState.previousTrackPlayTime,
      isCasting: true
    };

    ChangeNotifier.notify('AUDIO_STATE', newState);
  }

  private attachCastEventListeners() {
    const controller = this.getRemotePlayerController();
    if (!controller) {
      console.error('No RemotePlayerController available to attach listeners');
      return;
    }

    if (isValidWindow) {
      controller.addEventListener(
        window.cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        (event: any) => {
          const playerState = this.remotePlayer.playerState;
          console.log('CAST_PLAYER_STATE_CHANGED:', {
            playerState,
            media: this.remotePlayer.mediaInfo,
            currentTime: this.remotePlayer.currentTime,
            duration: this.remotePlayer.duration,
            event
          });

          let playbackState: string;
          switch (playerState) {
            case window.chrome.cast.media.PlayerState.PLAYING:
              playbackState = PLAYBACK_STATE.PLAYING;
              break;
            case window.chrome.cast.media.PlayerState.PAUSED:
              playbackState = PLAYBACK_STATE.PAUSED;
              break;
            case window.chrome.cast.media.PlayerState.IDLE:
              playbackState = PLAYBACK_STATE.IDLE;
              break;
            case window.chrome.cast.media.PlayerState.BUFFERING:
              playbackState = PLAYBACK_STATE.BUFFERING;
              break;
            default:
              playbackState = PLAYBACK_STATE.IDLE;
          }

          this.updateFullAudioState(playbackState);
        }
      );

      controller.addEventListener(
        window.cast.framework.RemotePlayerEventType.MEDIA_FINISHED,
        () => {
          console.log('CAST_MEDIA_FINISHED: Track completed');
          // this.handleTrackEnd();
        }
      );

      controller.addEventListener(
        window.cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
        () => {
          console.log(
            'CAST_CURRENT_TIME_CHANGED:',
            this.remotePlayer.currentTime
          );
          this.updateFullAudioState(
            undefined,
            undefined,
            this.remotePlayer.currentTime
          );
        }
      );

      controller.addEventListener(
        window.cast.framework.RemotePlayerEventType.DURATION_CHANGED,
        () => {
          console.log('CAST_DURATION_CHANGED:', this.remotePlayer.duration);
          const audioState = this.notifier.getLatestState(
            'AUDIO_X_STATE'
          ) as AudioState;

          this.notifier.notify(
            'AUDIO_STATE',
            {
              playbackState:
                audioState.playbackState === 'playing'
                  ? PLAYBACK_STATE.PLAYING
                  : PLAYBACK_STATE.DURATION_CHANGE,
              duration: this.remotePlayer.duration,
              error: { code: null, message: '', readable: '' },
              undefined
            },
            `cast_base_event_duration_changed`
          );
        }
      );
    } else {
      console.error(
        'window is not defined, please make sure cast window is loaded before'
      );
    }
  }
}

export default CastAdapter;
