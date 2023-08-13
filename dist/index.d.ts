interface AudioEvents {
    ABORT: 'abort';
    TIME_UPDATE: 'timeupdate';
    CAN_PLAY: 'canplay';
    CAN_PLAY_THROUGH: 'canplaythrough';
    DURATION_CHANGE: 'durationchange';
    ENDED: 'ended';
    EMPTIED: 'emptied';
    PLAYING: 'playing';
    WAITING: 'waiting';
    SEEKING: 'seeking';
    SEEKED: 'seeked';
    LOADED_META_DATA: 'loadedmetadata';
    LOADED_DATA: 'loadeddata';
    PLAY: 'play';
    PAUSE: 'pause';
    RATE_CHANGE: 'ratechange';
    VOLUME_CHANGE: 'volumechange';
    SUSPEND: 'suspend';
    STALLED: 'stalled';
    PROGRESS: 'progress';
    LOAD_START: 'loadstart';
    ERROR: 'error';
}
interface CustomAudioState {
    AUDIO_X_STATE: 'AUDIO_X_STATE';
}
type EventListenersList = Array<keyof AudioEvents> | Array<keyof CustomAudioState>;
type EventListenerCallbackMap = {
    [key in keyof Partial<AudioEvents>]: (e: Event, audioInstance: HTMLAudioElement) => void;
};

type InitMode = 'REACT' | 'VANILLA';
type PlaybackRate = 1.0 | 1.25 | 1.5 | 1.75 | 2.0 | 2.5 | 3.0;
type Preload = 'none' | 'metadata' | 'auto' | '';
type PlayBackState = 'idle' | 'playing' | 'ended' | 'ready' | 'paused' | 'stalled' | 'error' | 'buffering';
type MediaArtwork = {
    src: string;
    name?: string;
    sizes?: string;
};
interface MediaTrack {
    title: string;
    source: string;
    artwork: MediaArtwork[] | null;
    duration?: number;
    genre?: string;
    album?: string;
    comment?: string;
    year?: number | string;
    artist?: string;
}
interface AudioInit {
    mode: InitMode;
    useDefaultEventListeners: boolean;
    preloadStrategy?: Preload;
    playbackRate?: PlaybackRate;
    customEventListeners?: EventListenerCallbackMap | null;
    autoplay?: boolean;
    showNotificationActions: boolean;
}
interface AudioError {
    code: number | string | null;
    message: string;
    readable: string;
}
interface AudioState {
    playbackState: PlayBackState;
    duration: number | undefined;
    bufferedDuration: number;
    progress: number | undefined;
    volume: number;
    playbackRate: PlaybackRate;
    error: AudioError;
    currentTrack: MediaTrack;
}

interface ReadyState {
    HAVE_NOTHING: 0;
    HAVE_METADATA: 1;
    HAVE_CURRENT_DATA: 2;
    HAVE_FUTURE_DATA: 3;
    HAVE_ENOUGH_DATA: 4;
}

interface ErrorEvents {
    1: 'MEDIA_ERR_ABORTED';
    3: 'MEDIA_ERR_DECODE';
    2: 'MEDIA_ERR_NETWORK';
    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED';
}

interface NetworkState {
    0: 'NETWORK_EMPTY';
    1: 'NETWORK_IDLE';
    2: 'NETWORK_LOADING';
    3: 'NETWORK_NO_SOURCE';
}

declare class AudioX {
    private _audio;
    private static _instance;
    constructor();
    init(initProps: AudioInit): Promise<void>;
    addMedia(mediaTrack: MediaTrack): Promise<void>;
    play(): Promise<void>;
    addMediaAndPlay(mediaTrack: MediaTrack): Promise<void>;
    pause(): void;
    stop(): void;
    reset(): Promise<void>;
    setVolume(volume: number): void;
    setPlaybackRate(playbackRate: PlaybackRate): void;
    mute(): void;
    seek(time: number): void;
    destroy(): Promise<void>;
    subscribe(eventName: string, callback?: Function, state?: any): (caller: string, resetState: boolean) => void;
    attachEventListeners(eventListenersList: EventListenersList): void;
    get id(): string | null;
    set media(media: MediaTrack);
    static getAudioInstance(): HTMLAudioElement;
}

declare const AUDIO_X_CONSTANTS: Readonly<{
    REACT: InitMode;
    VANILLA: InitMode;
    DEVELOPMENT: "development";
}>;

declare const AUDIO_EVENTS: AudioEvents;

declare const AUDIO_STATE: AudioState;

export { AUDIO_EVENTS, AUDIO_STATE, AUDIO_X_CONSTANTS, AudioError, AudioEvents, AudioInit, AudioState, AudioX, ErrorEvents, EventListenerCallbackMap, EventListenersList, InitMode, MediaArtwork, MediaTrack, NetworkState, PlayBackState, PlaybackRate, ReadyState };
