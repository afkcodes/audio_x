## audio_x

---

A simple audio player for all you audio playing needs, based on HTML5 audio element.Supports
most popular formats.

| Formats | Support |
| ------- | ------- |
| .mp3    | [✓]     |
| .aac    | [✓]     |
| .mp4    | [✓]     |
| .hls    | [✓]     |

For a comprehensive list of formats support visit [MDN audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)

### Features

---

- Supports all modern browsers.
- Light Weight just 18kb.
- Zero dependencies, and type-safe.
- No Built in UI to have full control over the player, bring in your own UI.
- Simple API to use.
- Works on React no external package needed.
- Access to audio element to use your own event listeners or use the default listeners to get up & running in a ziffy.
- MediaSession Support, shows notification and lock-screen actions on mobile devices.
- Playlog - Get actual playtime of a track.

### Upcoming Features

---

- Casting support
- Dash media playback
- DRM
- Equalizer
- Updates to APIs for better DX
- React hooks to easily get started with React.
- Ads Support
- Queue Support and etc.

### Installation

---

Currently there is no npm package so you have to install directly from github.
Soon i will be publishing it to npm.

> Note: This library is in active development phase so, there might be some changes that would come,
> that might be breaking, but be assured i will try not to make them.

```
npm install "afkcodes/audio_x#try"
```

### Usage

---

```
import { AUDIO_STATE, AudioState, AudioX, MediaTrack } from "audio_x";


// create an audio_x Instance
const audio = new AudioX();


// Initialize audio_x
audio.init({
  autoPlay: false,  // should auto play
  useDefaultEventListeners: true, // use Default event listeners
  showNotificationActions: true, // show notifications on devices
  preloadStrategy: "auto",   // preloading strategy
  playbackRate: 1,  // set playback rate
  enablePlayLog: true,  // enable playlog support
  enableHls: true,    // enable hls support
  hlsConfig: { backBufferLength: 2000 } // Hls init config
});

// create track
const track:MediaTrack ={
  artwork: [
    {
      src: "https://example.com/image.png",
      name: "image-name",
      sizes: "512x512",
    },
  ],
  source:
    "https://example.com/stream.mp3",
  title: "My Awesome Song",
  album: "Awesome Album",
  artist: "Amazing Artist",
  comment: "",
  duration: 309,
  genre: "Pop",
  year: 2023,
};

// add a track
audio.add(track);

// play
audio.play();

//pause
audio.pause();

// Get the Audio State
audio.subscribe("AUDIO_X_STATE", (data: AudioState) => {
  console.log(data);
});

// Sample Audio State
{
  "playbackState": "paused",
  "duration": null,
  "bufferedDuration": 0,
  "progress": 35.003483,
  "volume": 50,
  "playbackRate": 1,
  "error": {
    "code": null,
    "message": "",
    "readable": ""
  },
  "currentTrack": {
    "artwork": [
      {
        src: "https://example.com/image.png",
        name: "image-name",
        sizes: "512x512",
      }
    ],
    "source": "https://example.com/stream.mp3",
    title: "My Awesome Song",
    album: "Awesome Album",
    artist: "Amazing Artist",
    comment: "",
    duration: 309,
    genre: "Pop",
    year: 2023,
  },
  "currentTrackPlayTime": 35.003483,
  "previousTrackPlayTime": 35.003483
}
```

### Getting the audio Instance

---

audio_x exports audioInstance, through a static method, so that you can add your own event-listeners
directly on the HTML5 audio element.

```
const instance = AudioX.getAudioInstance();
```

### Author

---

- Ashish Kumar - [afkcodes](https://github.com/afkcodes)

### Contributions

> if you like this and find any issues please do raise a bug, or if you find working on audio stuff interesting,
> Do raise a PR for a feature or a fix.
