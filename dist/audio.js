"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioX = void 0;
var audioInstance;
var AudioX = (function () {
    function AudioX() {
    }
    AudioX.prototype.init = function (source, initMode) {
        if (initMode === void 0) { initMode = 'REACT'; }
        if (process.env.NODE_ENV !== 'development' &&
            audioInstance &&
            initMode === 'REACT') {
            throw new Error('Cannot create multiple audio instance');
        }
        if (!source) {
            console.warn('Initializing audio without source, this might cause initial playback failure');
        }
        this._audio = new Audio(source);
        audioInstance = this._audio;
    };
    AudioX.prototype.play = function () {
        var isSourceAvailable = audioInstance.src !== '';
        if (audioInstance &&
            (audioInstance === null || audioInstance === void 0 ? void 0 : audioInstance.paused) &&
            audioInstance.HAVE_FUTURE_DATA &&
            isSourceAvailable) {
            audioInstance.play();
        }
        else {
            throw new Error('Audio source must be set before playing an audio');
        }
    };
    AudioX.prototype.pause = function () {
        if (audioInstance && !(audioInstance === null || audioInstance === void 0 ? void 0 : audioInstance.paused)) {
            audioInstance === null || audioInstance === void 0 ? void 0 : audioInstance.pause();
        }
    };
    AudioX.prototype.stop = function () {
        if (audioInstance) {
            audioInstance === null || audioInstance === void 0 ? void 0 : audioInstance.pause();
            audioInstance.currentTime = 0;
        }
    };
    AudioX.prototype.reset = function () {
        if (audioInstance) {
            this.stop();
            audioInstance.src = '';
        }
    };
    AudioX.prototype.setVolume = function (volume) {
        var actualVolume = volume / 100;
        if (audioInstance) {
            audioInstance.volume = actualVolume;
        }
    };
    AudioX.prototype.setPlaybackRate = function (playbackRate) {
        if (audioInstance) {
            audioInstance.playbackRate = playbackRate;
        }
    };
    return AudioX;
}());
exports.AudioX = AudioX;
//# sourceMappingURL=audio.js.map