# audio_x

---

A simple audio player for all your audio playing needs, based on HTML5 audio element.Supports
most popular formats.

| Formats     | Support |
| ----------- | ------- |
| .mp3        | [✓]     |
| .aac        | [✓]     |
| .mp4        | [✓]     |
| .m3u8 (hls) | [✓]     |

For a comprehensive list of formats support visit [MDN audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)

## Features

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
- ~~Equalizer~~ [✓] Done
- Updates to APIs for better DX
- React hooks to easily get started with React.
- Ads Support
- ~~Queue Support~~ [✓] Done.

### Installation

---

```JS
npm install audio_x
```

### Usage

---

```JS
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
  id: 1,
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
audio.addMedia(track);

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

```JS
const instance = AudioX.getAudioInstance();
```

### Attaching custom event listeners

---

There are two ways to attach custom event listeners.

#### Method 1

```JS

// Create an object of Events and callbacks as below

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
    useDefaultEventListeners: false, // set default event listener to false
    mode: "REACT",
    showNotificationActions: true,
    customEventListeners: eventListenerMap, // provide custom event listeners at init
    preloadStrategy: "auto",
    playbackRate: 1,
    enableEQ: true,
    enablePlayLog: true,
    enableHls: true,
  });

```

> **NOTE:** &nbsp; _if custom event listeners are provided at init it will take priority even if useDefaultEventListeners is set to true, to use default event listener set useDefaultEventListeners to true and customEventListeners to null. Once custom event listener is added AUDIO_X_STATE will not not be fired, in favor of custom event listeners. All the events should be handled manually, This method only allows audio events._

#### Method 2

```JS
 audio.addEventListener("pause", (data: any) => {
    console.log(data);
  });
```

> **NOTE:** _This method allows adding events directly to audio element, and all the events can be added to the audio element, When using this set useDefaultEventListeners to false and customEventListeners to null to reduce un-necessary events being fired.All the events should be handled manually_

### Setting up the equalizer

---

```JS
// Getting the Presets
const presets = audio.getPresets(); // will return array of pre-tuned filters

// Sample Preset
[
  {
    "id": "preset_default",
    "name": "Default",
    "gains": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
  }
]

// Setting a Preset
audio.setPreset(id);

// example:
audio.setPreset('preset_default');  // will set default preset


// Custom EQ Setting

const gainsValue = preset[index].gains;
gainsValue[index] = value;  // value ranges from -10 to 10
audio.setCustomEQ(gainsValue);

// Example
const gainsValue = preset[0].gains;   // default preset gains [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
gainsValue[0] = 2.5;   // updated gain values [2.5, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
audio.setCustomEQ(gainsValue);

```

### Adding and Handling Queue

// Audio_x allows you to play audio in queue.

```JS
// To add a queue

const tracks = [track_1, track_2, ...other_tracks]
audio.addQueue(tracks, "DEFAULT");

NOTE: addQueue takes two parameters one is tracks array and second is playback type i.e "DEFAULT" | "REVERSE" | "SHUFFLE"
if no playbackType is passed audio_x will play it as DEFAULT

// To Play the Queue from the beginning, call addMediaAndPlay like below.

audio.addMediaAndPlay();

// if you are fetching something dynamically to play audio, such as source of the audio you can do it like below.

audio.addMediaAndPlay(null, async (currentTrack: MediaTrack) => {
        const res = await fetch('url);
        currentTrack.source = res.data.url;
      });

// This will make sure that the above function gets called before every audio that plays in a queue.
```

```JS
// To add a single track to queue

audio.addToQueue(track);
```

```JS
// To clear Queue

audio.clearQueue();
```

```JS
// To play Next in Queue

audio.playNext();
```

```JS
// To play Previous in Queue

audio.playPrevious();
```

### Author

---

- Ashish Kumar - [afkcodes](https://afk.codes)

### Contributions

> if you like this and find any issues please do raise a bug, or if you find working on audio stuff interesting,
> Do raise a PR for a feature or a fix.
