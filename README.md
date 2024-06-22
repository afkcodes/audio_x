# audio_x

---

A simple audio player for all your audio playing needs, based on the HTML5 audio element. Supports most popular formats.

| Formats     | Support |
| ----------- | ------- |
| .mp3        | [✓]     |
| .aac        | [✓]     |
| .mp4        | [✓]     |
| .m3u8 (hls) | [✓]     |

For a comprehensive list of supported formats, visit the [MDN audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs).

## Features

---

- Supports all modern browsers.
- Lightweight, just 18kb.
- Zero dependencies and type-safe.
- No built-in UI, allowing full control over the player. Bring your own UI.
- Simple API to use.
- Works with React, no external packages needed.
- Access to the audio element to use your own event listeners or the default listeners to get up and running quickly.
- MediaSession support, shows notification and lock-screen actions on mobile devices.
- Playlog - Get the actual playtime of a track.

### Upcoming Features

---

- Casting support
- Dash media playback
- DRM
- Ads support
- ~~Equalizer~~ [✓] Done
- ~~Updates to APIs for better DX~~ [✓] Done
- ~~Queue support~~ [✓] Done

### Installation

---

```JS
npm install audio_x
```

### Usage

---

```JS
import { AUDIO_STATE, AudioState, AudioX, MediaTrack } from "audio_x";

// Create an audio_x instance
const audio = new AudioX();

// Initialize audio_x
audio.init({
  autoPlay: false,  // Should autoplay
  useDefaultEventListeners: true, // Use default event listeners
  showNotificationActions: true, // Show notifications on devices
  preloadStrategy: "auto",   // Preloading strategy
  playbackRate: 1,  // Set playback rate
  enablePlayLog: true,  // Enable playlog support
  enableHls: true,    // Enable HLS support
  hlsConfig: { backBufferLength: 2000 } // HLS init config
});

// Create a track
const track: MediaTrack = {
  id: 1,
  artwork: [
    {
      src: "https://example.com/image.png",
      name: "image-name",
      sizes: "512x512",
    },
  ],
  source: "https://example.com/stream.mp3",
  title: "My Awesome Song",
  album: "Awesome Album",
  artist: "Amazing Artist",
  comment: "",
  duration: 309,
  genre: "Pop",
  year: 2023,
};

// Add a track
audio.addMedia(track);

// Play
audio.play();

// Pause
audio.pause();

// Get the audio state
audio.subscribe("AUDIO_X_STATE", (audioState: AudioState) => {
  console.log(audioState);
});

// Sample audio state
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

### Getting the audio instance

---

audio_x exports an audio instance through a static method, so you can add your own event listeners directly to the HTML5 audio element.

```JS
const instance = AudioX.getAudioInstance();
```

### Attaching custom event listeners

---

There are two ways to attach custom event listeners.

#### Method 1

```JS
// Create an object of events and callbacks as below

const eventListenerMap: EventListenerCallbackMap = {
  CAN_PLAY_THROUGH: (e, audioInstance, isPlayLogEnabled) => {
    console.log(e, audioInstance, isPlayLogEnabled);
  },
  PLAY: (e, audioInstance, isPlayLogEnabled) => {
    console.log(e, audioInstance, isPlayLogEnabled);
  },
};

audio.init({
  autoPlay: false,
  useDefaultEventListeners: false, // Set default event listener to false
  mode: "REACT",
  showNotificationActions: true,
  customEventListeners: eventListenerMap, // Provide custom event listeners at init
  preloadStrategy: "auto",
  playbackRate: 1,
  enableEQ: true,
  enablePlayLog: true,
  enableHls: true,
});
```

> **NOTE:** &nbsp; _If custom event listeners are provided at init, they will take priority even if useDefaultEventListeners is set to true. To use the default event listener, set useDefaultEventListeners to true and customEventListeners to null. Once a custom event listener is added, AUDIO_X_STATE will not be fired in favor of custom event listeners. All events should be handled manually. This method only allows audio events._

#### Method 2

```JS
audio.addEventListener("pause", (data: any) => {
  console.log(data);
});
```

> **NOTE:** _This method allows adding events directly to the audio element, and all events can be added to the audio element. When using this, set useDefaultEventListeners to false and customEventListeners to null to reduce unnecessary events being fired. All events should be handled manually._

### Setting up the equalizer

---

```JS
// Getting the presets
const presets = audio.getPresets(); // Will return an array of pre-tuned filters

// Sample preset
[
  {
    "id": "preset_default",
    "name": "Default",
    "gains": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  }
]

// Setting a preset
audio.setPreset(id);

// Example:
audio.setPreset('preset_default');  // Will set default preset

// Custom EQ setting

const gainsValue = preset[index].gains;
gainsValue[index] = value;  // Value ranges from -10 to 10
audio.setCustomEQ(gainsValue);

// Example
const gainsValue = preset[0].gains;   // Default preset gains [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
gainsValue[0] = 2.5;   // Updated gain values [2.5, 0, 0, 0, 0, 0, 0, 0, 0, 0]
audio.setCustomEQ(gainsValue);
```

### Adding and handling the queue

---

Audio_x allows you to play audio in a queue.

```JS
// To add a queue

const tracks = [track_1, track_2, ...other_tracks]
audio.addQueue(tracks, "DEFAULT");

// NOTE: addQueue takes two parameters: one is the tracks array, and the second is playback type, i.e., "DEFAULT" | "REVERSE" | "SHUFFLE".
// If no playbackType is passed, audio_x will play it as DEFAULT.

// To play the queue from the beginning, call addMediaAndPlay like below.

audio.addMediaAndPlay();

// If you are fetching something dynamically to play audio, such as the source of the audio, you can do it like below.

audio.addMediaAndPlay(null, async (currentTrack: MediaTrack) => {
  const res = await fetch('url');
  currentTrack.source = res.data.url;
});

// This will ensure that the above function gets called before every audio that plays in a queue.
```

```JS
// To add a single track to the queue

audio.addToQueue(track);
```

```JS
// To add multiple tracks to the queue

audio.addToQueue([track1, track2, track3]);
```

```JS
// To clear the queue

audio.clearQueue();
```

```JS
// To play the next track in the queue

audio.playNext();
```

```JS
// To play the previous track in the queue

audio.playPrevious();
```

```JS
// To seek to a particular position

audio.seek(position); // Position is basically time in seconds
```

```JS
// To seek by a particular time range

audio.seekBy(time); // Time range in seconds to seek
```

### Author

---

- Ashish Kumar - [afkcodes](https://afk.codes)

### Contributions

> If you like this and find any issues, please raise a bug, or if you find working on audio stuff interesting, do raise a PR for a feature or a fix.