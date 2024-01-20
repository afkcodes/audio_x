declare global {
  interface Window {
    Hls: any;
  }
}

import { AudioX } from 'audio';
import { URLS } from 'constants/common';
import { HLS_EVENTS_CALLBACK_MAP } from 'events/hlsEvents';
import { attachHlsEventsListeners } from 'events/listeners';
import { loadScript } from 'helpers/common';
import { MediaTrack } from 'types';
import type Hls from 'types/hls.js.js';
import type { HlsConfig } from 'types/hls.js.js';

let hlsInstance: Hls;

class HlsAdapter {
  private static _instance: HlsAdapter;
  private HlsClass: typeof Hls;

  constructor() {
    if (HlsAdapter._instance) {
      console.warn(
        'Instantiation failed: cannot create multiple instance of HLS returning existing instance'
      );
      return HlsAdapter._instance;
    }
    HlsAdapter._instance = this;
  }

  async load() {
    await loadScript(
      URLS.HLS,
      () => {
        console.log('HLS Loaded');
      },
      'hls'
    )
      .then(() => {
        this.HlsClass = window.Hls;
        window.Hls = undefined;
      })
      .catch((msg: string) => {
        console.log(msg);
      });

    return this.HlsClass;
  }

  async init(config: HlsConfig | {} = {}, enablePlayLog: boolean) {
    const Hls = await this.load();
    if (Hls.isSupported()) {
      hlsInstance = new Hls(config);
      attachHlsEventsListeners(HLS_EVENTS_CALLBACK_MAP, enablePlayLog);
    }
  }

  addHlsMedia(mediaTrack: MediaTrack) {
    const Hls = this.HlsClass;
    const audioInstance = AudioX.getAudioInstance();
    hlsInstance.loadSource(mediaTrack.source);
    hlsInstance.attachMedia(audioInstance);
    hlsInstance.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log('hls media attached');
    });
  }

  getHlsInstance() {
    return hlsInstance;
  }
}

export default HlsAdapter;
