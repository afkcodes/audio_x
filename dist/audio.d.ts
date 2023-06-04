import { InitMode, PlaybackRate } from 'types';
declare class AudioX {
    private _audio;
    init(source: string, initMode?: InitMode): void;
    play(): void;
    pause(): void;
    stop(): void;
    reset(): void;
    setVolume(volume: number): void;
    setPlaybackRate(playbackRate: PlaybackRate): void;
}
export { AudioX };
