var x=Object.defineProperty;var ee=(a,e,t)=>e in a?x(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var r=(a,e)=>x(a,"name",{value:e,configurable:!0});var d=(a,e,t)=>(ee(a,typeof e!="symbol"?e+"":e,t),t);var H=[{frequency:31,type:"lowshelf",gain:0},{frequency:63,type:"peaking",gain:0},{frequency:125,type:"peaking",gain:0},{frequency:250,type:"peaking",gain:0},{frequency:500,type:"peaking",gain:0},{frequency:1e3,type:"peaking",gain:0},{frequency:2e3,type:"peaking",gain:0},{frequency:4e3,type:"peaking",gain:0},{frequency:8e3,type:"peaking",gain:0},{frequency:16e3,type:"highshelf",gain:0}],C=[{id:"preset_default",name:"Default",gains:[0,0,0,0,0,0,0,0,0,0]},{id:"preset_live",name:"Live",gains:[-1,1,3,4,4,4,3,2,2,2]},{id:"preset_acoustic",name:"Acoustic",gains:[6,6,4,1,3,3,4,5,4,1.5]},{id:"preset_classical",name:"Classical",gains:[6,5,4,3,-1,-1,0,2,4,5]},{id:"preset_piano",name:"Piano",gains:[4,2,0,3.5,4,1.5,5,6,4,4.5]},{id:"preset_lounge",name:"Lounge",gains:[-3,-1.5,0,1,5.5,1,0,-1.5,2,.5]},{id:"preset_spoken_word",name:"Spoken Word",gains:[-2,0,0,1,5,6.5,7,6,3,0]},{id:"preset_jazz",name:"Jazz",gains:[5.5,4,1,2,-1.5,-1.5,0,1,4,5.5]},{id:"preset_pop",name:"Pop",gains:[.5,2.4,3.8,4.3,3,0,-.5,-.5,.5,.5]},{id:"preset_dance",name:"Dance",gains:[5,10,6.5,0,2,4.5,7.5,7,5.5,0]},{id:"preset_latin",name:"Latin",gains:[3.5,1.5,0,0,-1.5,-1.5,-1.5,0,4,6.5]},{id:"preset_rnb",name:"RnB",gains:[3.5,10.5,8.5,1,-3,-1.5,3,3.5,4,5]},{id:"preset_hiphop",name:"HipHop",gains:[7,6,1,4,-1,-.5,1,-.5,2,4]},{id:"preset_electronic",name:"Electronic",gains:[6,5.5,1,0,-2,2,1,1.5,5.5,6.5]},{id:"preset_techno",name:"Techno",gains:[3.8,2.4,0,-2.4,-1.9,0,3.8,4.8,4.8,4.3]},{id:"preset_deep",name:"Deep",gains:[6,5,1.5,.5,4,3,1.5,-2,-5,-6.5]},{id:"preset_club",name:"Club",gains:[0,0,3.8,2.4,2.4,2.4,1,0,0,0]},{id:"preset_rock",name:"Rock",gains:[7,5.5,4,1,-.5,0,.5,3,4.5,6.5]},{id:"preset_rock_soft",name:"Rock Soft",gains:[1.5,0,0,-.5,0,1,3.8,4.8,5.7,6.2]},{id:"preset_ska",name:"Ska",gains:[-.5,-1.5,-1,0,1,2,3.8,4.3,5.2,4.3]},{id:"preset_reggae",name:"Reggae",gains:[0,0,0,-2.4,0,2.5,2.5,0,0,0]},{id:"preset_country",name:"Country",gains:[3,2,1,0,-1,0,2,3,4,4]},{id:"preset_funk",name:"Funk",gains:[4,5,3,0,-1,0,2,4,5,5]},{id:"preset_blues",name:"Blues",gains:[2,1,0,-1,0,1,2,3,4,3]},{id:"preset_metal",name:"Metal",gains:[8,7,6,4,2,1,0,2,4,6]},{id:"preset_indie",name:"Indie",gains:[2,3,2,1,0,-1,-2,0,3,4]},{id:"preset_chill",name:"Chill",gains:[1,1,0,-1,-2,-1,1,2,3,2]},{id:"preset_world",name:"World",gains:[3,2,0,-2,-1,1,3,4,5,3]},{id:"preset_alternative",name:"Alternative",gains:[3,2,1,0,-1,-2,1,3,4,3]},{id:"preset_ambient",name:"Ambient",gains:[0,-1,-2,-3,-2,0,1,2,3,2]},{id:"preset_mellow",name:"Mellow",gains:[1,1,0,-1,-2,-1,1,2,3,1]},{id:"preset_grunge",name:"Grunge",gains:[5,4,3,2,1,0,0,2,4,5]},{id:"preset_soul",name:"Soul",gains:[3,3,2,1,0,-1,0,2,3,3]},{id:"preset_folk",name:"Folk",gains:[2,1,0,-1,-2,-1,1,2,3,2]},{id:"preset_trap",name:"Trap",gains:[7,6,3,1,-2,-1,1,3,6,7]},{id:"preset_dubstep",name:"Dubstep",gains:[6,5,4,3,2,1,1,3,5,6]}];var O=Object.freeze({REACT:"REACT",VANILLA:"VANILLA",DEVELOPMENT:"development"}),l=Object.freeze({BUFFERING:"buffering",PLAYING:"playing",PAUSED:"paused",READY:"ready",IDLE:"idle",ENDED:"ended",STALLED:"stalled",ERROR:"error",TRACK_CHANGE:"trackchanged",DURATION_CHANGE:"durationchanged"}),D=Object.freeze({MEDIA_ERR_ABORTED:"The user canceled the audio.",MEDIA_ERR_DECODE:"An error occurred while decoding the audio.",MEDIA_ERR_NETWORK:"A network error occurred while fetching the audio.",MEDIA_ERR_SRC_NOT_SUPPORTED:"The audio is missing or is in a format not supported by your browser.",DEFAULT:"An unknown error occurred."}),w={HLS:"https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"};var c,te=(c=class{static validateEventName(e){if(!e||typeof e!="string")throw new Error("Invalid event name")}static notify(e,t,s="audiox_notifier_default"){this.validateEventName(e);let i=c.listeners[e];i&&t!==null&&(c.notifierState[e]={...c.notifierState[e]||{},...t},i.forEach(n=>{n(c.notifierState[e]);}));}static listen(e,t,s={}){if(this.validateEventName(e),typeof t!="function")throw new Error("Callback must be a function");return c.listeners[e]?c.listeners[e].add(t):(c.notifierState[e]=s,c.listeners[e]=new Set([t])),()=>{let i=c.listeners[e];i&&(i.delete(t),i.size===0&&delete c.listeners[e]);}}static multiListen(e,t,s={}){if(this.validateEventName(e),!Array.isArray(t)||t.length===0)throw new Error("Callbacks must be a non-empty array of functions");let i=t.map(n=>c.listen(e,n,s));return ()=>{i.forEach(n=>n());}}static getLatestState(e){return this.validateEventName(e),c.notifierState[e]}},r(c,"ChangeNotifier"),d(c,"listeners",{}),d(c,"notifierState",{}),c),A=te;var p=r(a=>a&&Array.isArray(a)&&a.length,"isValidArray"),v=r(a=>a instanceof Function&&typeof a=="function","isValidFunction");var G={},M=r(a=>{let e="";switch(a.error?.code){case MediaError.MEDIA_ERR_ABORTED:e+=D.MEDIA_ERR_ABORTED;break;case MediaError.MEDIA_ERR_NETWORK:e+=D.MEDIA_ERR_NETWORK;break;case MediaError.MEDIA_ERR_DECODE:e+=D.MEDIA_ERR_DECODE;break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:e+=D.MEDIA_ERR_SRC_NOT_SUPPORTED;break;default:e+=D.DEFAULT;break}return e},"getReadableErrorMessage"),q=r(a=>{let{title:e,album:t,artist:s,artwork:i}=a,n=i?i[0]?.src:"",g=["96x96","128x128","192x192","256x256","384x384","512x512"].map(I=>({src:n,sizes:I,type:"image/png"}));return {title:e,album:t,artist:s,artwork:g}},"metaDataCreator"),N=0,m=r((a,e)=>{let t=new Set;for(let n=0;n<a.played.length;n++){let u=a.played.start(n),S=a.played.end(n)-u;t.add(S);}let i=[...t].reduce((n,u)=>n+u,0);N=["ENDED","TRACK_CHANGE","PAUSE"].includes(e)?i:N,A.notify("AUDIO_STATE",{currentTrackPlayTime:i,previousTrackPlayTime:N});},"calculateActualPlayedLength"),B=r((a,e,t)=>new Promise((s,i)=>{if(window instanceof Window&&window.document)if(G[t])e(),s();else {G[t]=!0;let n=document.createElement("script");n.type="text/javascript",n.src=a,n.async=!0,n.onload=()=>{e(),s();},document.head.appendChild(n);}else i(`Window not ready unable to initialize ${t}`);}),"loadScript"),V=r(()=>{let a=new _,e=a.getQueue(),t=!1,s=r(i=>{i.playbackState==="ended"&&!t&&(t=!0,e&&p(e)&&a.playNext()),i.playbackState!=="ended"&&(t=!1);},"audioStateListener");A.listen("AUDIO_STATE",s);},"handleQueuePlayback"),K=r(a=>{let e=[...a];for(let t=e.length-1;t>0;t--){let s=Math.floor(Math.random()*t);[e[t],e[s]]=[e[s],e[t]];}return e},"shuffle");var T,U=(T=class{constructor(){d(this,"audioCtx");d(this,"audioCtxStatus");d(this,"eqFilterBands");if(T._instance)return T._instance;if(this.audioCtx===void 0&&typeof AudioContext<"u")if(typeof AudioContext<"u")this.audioCtx=new AudioContext,this.audioCtxStatus="ACTIVE",this.init();else if(typeof window.webkitAudioContext<"u")this.audioCtx=new window.webkitAudioContext,this.audioCtxStatus="ACTIVE",this.init();else throw new Error("Web Audio API is not supported in this browser.");else this.audioCtxStatus="FAILED";if(this.audioCtxStatus==="ACTIVE"&&this.audioCtx.state==="suspended"){var e=r(()=>{this.audioCtx.resume(),setTimeout(()=>{this.audioCtx.state==="running"&&document.body.removeEventListener("click",e,!1);},0);},"resume");document.body.addEventListener("click",e,!1);}T._instance=this;}init(){try{let e=_.getAudioInstance(),t=this.audioCtx.createMediaElementSource(e),s=H.map(n=>{let u=this.audioCtx.createBiquadFilter();return u.type=n.type,u.frequency.value=n.frequency,u.gain.value=n.gain,u.Q.value=1,u}),i=this.audioCtx.createGain();i.gain.value=1,t.connect(s[0]);for(let n=0;n<s.length-1;n++)s[n].connect(s[n+1]);s[s.length-1].connect(i),i.connect(this.audioCtx.destination),this.audioCtxStatus="ACTIVE",this.eqFilterBands=s;}catch{this.audioCtxStatus="FAILED";}}setPreset(e){let t=C.find(s=>s.id===e);if(!(!this.eqFilterBands||this.eqFilterBands.length!==t?.gains.length))for(let s=0;s<this.eqFilterBands.length;s++)this.eqFilterBands[s].gain.value=t?.gains[s];}static getPresets(){return C}status(){return this.audioCtx.state==="suspended"&&this.audioCtx.resume(),this.audioCtxStatus}setCustomEQ(e){p(e)&&this.eqFilterBands.forEach((t,s)=>{t.gain.value=e[s];});}},r(T,"Equalizer"),d(T,"_instance"),T);var Y={ERROR:(a,e)=>{let t=e.type,s=e.details,i=e.fatal;A.notify("AUDIO_STATE",{playbackState:l.ERROR,error:{type:t,isFatal:i,detail:s}},`audiox_baseEvents_state_${a.type}`);},FRAG_CHANGED:()=>{}};var b=Object.freeze({ABORT:"abort",TIME_UPDATE:"timeupdate",CAN_PLAY:"canplay",CAN_PLAY_THROUGH:"canplaythrough",DURATION_CHANGE:"durationchange",ENDED:"ended",EMPTIED:"emptied",PLAYING:"playing",WAITING:"waiting",SEEKING:"seeking",SEEKED:"seeked",LOADED_META_DATA:"loadedmetadata",LOADED_DATA:"loadeddata",PLAY:"play",PAUSE:"pause",RATE_CHANGE:"ratechange",VOLUME_CHANGE:"volumechange",SUSPEND:"suspend",STALLED:"stalled",PROGRESS:"progress",LOAD_START:"loadstart",ERROR:"error",TRACK_CHANGE:"trackchange"}),Q={MEDIA_ATTACHING:"hlsMediaAttaching",MEDIA_ATTACHED:"hlsMediaAttached",MEDIA_DETACHING:"hlsMediaDetaching",MEDIA_DETACHED:"hlsMediaDetached",BUFFER_RESET:"hlsBufferReset",BUFFER_CODECS:"hlsBufferCodecs",BUFFER_CREATED:"hlsBufferCreated",BUFFER_APPENDING:"hlsBufferAppending",BUFFER_APPENDED:"hlsBufferAppended",BUFFER_EOS:"hlsBufferEos",BUFFER_FLUSHING:"hlsBufferFlushing",BUFFER_FLUSHED:"hlsBufferFlushed",MANIFEST_LOADING:"hlsManifestLoading",MANIFEST_LOADED:"hlsManifestLoaded",MANIFEST_PARSED:"hlsManifestParsed",LEVEL_SWITCHING:"hlsLevelSwitching",LEVEL_SWITCHED:"hlsLevelSwitched",LEVEL_LOADING:"hlsLevelLoading",LEVEL_LOADED:"hlsLevelLoaded",LEVEL_UPDATED:"hlsLevelUpdated",LEVEL_PTS_UPDATED:"hlsLevelPtsUpdated",LEVELS_UPDATED:"hlsLevelsUpdated",AUDIO_TRACKS_UPDATED:"hlsAudioTracksUpdated",AUDIO_TRACK_SWITCHING:"hlsAudioTrackSwitching",AUDIO_TRACK_SWITCHED:"hlsAudioTrackSwitched",AUDIO_TRACK_LOADING:"hlsAudioTrackLoading",AUDIO_TRACK_LOADED:"hlsAudioTrackLoaded",SUBTITLE_TRACKS_UPDATED:"hlsSubtitleTracksUpdated",SUBTITLE_TRACKS_CLEARED:"hlsSubtitleTracksCleared",SUBTITLE_TRACK_SWITCH:"hlsSubtitleTrackSwitch",SUBTITLE_TRACK_LOADING:"hlsSubtitleTrackLoading",SUBTITLE_TRACK_LOADED:"hlsSubtitleTrackLoaded",SUBTITLE_FRAG_PROCESSED:"hlsSubtitleFragProcessed",CUES_PARSED:"hlsCuesParsed",NON_NATIVE_TEXT_TRACKS_FOUND:"hlsNonNativeTextTracksFound",INIT_PTS_FOUND:"hlsInitPtsFound",FRAG_LOADING:"hlsFragLoading",FRAG_LOAD_EMERGENCY_ABORTED:"hlsFragLoadEmergencyAborted",FRAG_LOADED:"hlsFragLoaded",FRAG_DECRYPTED:"hlsFragDecrypted",FRAG_PARSING_INIT_SEGMENT:"hlsFragParsingInitSegment",FRAG_PARSING_USERDATA:"hlsFragParsingUserdata",FRAG_PARSING_METADATA:"hlsFragParsingMetadata",FRAG_PARSED:"hlsFragParsed",FRAG_BUFFERED:"hlsFragBuffered",FRAG_CHANGED:"hlsFragChanged",FPS_DROP:"hlsFpsDrop",FPS_DROP_LEVEL_CAPPING:"hlsFpsDropLevelCapping",ERROR:"hlsError",DESTROYING:"hlsDestroying",KEY_LOADING:"hlsKeyLoading",KEY_LOADED:"hlsKeyLoaded",LIVE_BACK_BUFFER_REACHED:"hlsLiveBackBufferReached",BACK_BUFFER_REACHED:"hlsBackBufferReached"};var P=r((a,e=!1)=>{let t=_.getAudioInstance();p(Object.keys(a))&&Object.keys(a).forEach(s=>{let i=s;t?.addEventListener(b[i],n=>{if(s&&a[i]){let u=a[i];typeof u=="function"&&u(n,t,e);}});});},"attachEventListeners");var X=r((a,e=!1)=>{let s=new y().getHlsInstance();p(Object.keys(a))&&Object.keys(a).forEach(i=>{let n=i;s.on(Q[n],(u,g)=>{if(n&&a[n]){let S=a[n];typeof S=="function"&&S(u,g,s,e);}});});},"attachHlsEventsListeners");var R,f,ae=(f=class{constructor(){d(this,"HlsClass");if(f._instance)return f._instance;f._instance=this;}async load(){return await B(w.HLS,()=>{},"hls").then(()=>{this.HlsClass=window.Hls,window.Hls=void 0;}).catch(e=>{}),this.HlsClass}async init(e={},t){let s=await this.load();s.isSupported()&&(R=new s(e),X(Y,t));}addHlsMedia(e){let t=this.HlsClass,s=_.getAudioInstance();R.loadSource(e.source),R.attachMedia(s),R.on(t.Events.MEDIA_ATTACHED,function(){});}getHlsInstance(){return R}},r(f,"HlsAdapter"),d(f,"_instance"),f),y=ae;var z=Object.freeze({1:"MEDIA_ERR_ABORTED",3:"MEDIA_ERR_DECODE",2:"MEDIA_ERR_NETWORK",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"});var E=A,j={LOAD_START:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e?.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_state_${a.type}`);},DURATION_CHANGE:(a,e)=>{let t=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:t.playbackState==="playing"?l.PLAYING:l.DURATION_CHANGE,duration:e?.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_state_${a.type}`);},LOADED_META_DATA:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e?.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_state_${a.type}`);},LOADED_DATA:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e?.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_state_${a.type}`);},CAN_PLAY:a=>{E.notify("AUDIO_STATE",{playbackState:l.READY,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},CAN_PLAY_THROUGH:a=>{let e=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:e.playbackState==="playing"?l.PLAYING:l.READY,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},PLAY:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.PLAYING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},PLAYING:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.PLAYING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},PAUSE:(a,e,t)=>{E.notify("AUDIO_STATE",{playbackState:l.PAUSED,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`),t&&m(e,"PAUSE");},ENDED:(a,e,t)=>{E.notify("AUDIO_STATE",{playbackState:l.ENDED,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`),t&&m(e,"ENDED");},ERROR:(a,e)=>{let t=e.error?.code,s=M(e);E.notify("AUDIO_STATE",{playbackState:l.ERROR,error:{code:t,message:z[t],readable:s}},`audiox_baseEvents_state_${a.type}`);},TIME_UPDATE:(a,e)=>{let t=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:e.paused?t?.playbackState:l.PLAYING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},WAITING:(a,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${a.type}`);},VOLUME_CHANGE:a=>{E.notify("AUDIO_STATE",{},"audiox_baseEvents_state");}};var $=r(a=>{"mediaSession"in navigator&&(navigator.mediaSession.metadata=new MediaMetadata(q(a)));},"updateMetaData"),W=r(()=>{"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>{_.getAudioInstance().play();}),navigator.mediaSession.setActionHandler("pause",()=>{_.getAudioInstance().pause();}));},"attachMediaSessionHandlers");var k={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},F={playbackState:l.IDLE,duration:0,bufferedDuration:0,progress:0,volume:50,playbackRate:1,error:{code:null,message:"",readable:""},currentTrack:{},currentTrackPlayTime:0,previousTrackPlayTime:0};A.listen("AUDIO_STATE",a=>{A.notify("AUDIO_X_STATE",{...F,...a});},F);var o,L=A,h,_=(h=class{constructor(){d(this,"_audio");d(this,"isPlayLogEnabled");d(this,"_queue");d(this,"_currentQueueIndex",0);d(this,"eqStatus","IDEAL");d(this,"isEqEnabled",!1);d(this,"eqInstance");if(h._instance)return h._instance;if(process.env.NODE_ENV!==O?.DEVELOPMENT&&o)throw new Error("Cannot create multiple audio instance");h._instance=this,this._audio=new Audio,o=this._audio;}async init(e){let{preloadStrategy:t="auto",autoPlay:s=!1,useDefaultEventListeners:i=!0,customEventListeners:n=null,showNotificationActions:u=!1,enablePlayLog:g=!1,enableHls:S=!1,enableEQ:I=!1,crossOrigin:J="anonymous",hlsConfig:Z={}}=e;this._audio?.setAttribute("id","audio_x_instance"),this._audio.preload=t,this._audio.autoplay=s,this._audio.crossOrigin=J,this.isPlayLogEnabled=g,n!==null?P(n,!1):P(j,g),u&&W(),I&&(this.isEqEnabled=I),S&&new y().init(Z,g);}async addMedia(e){if(!e)return;let t=e.source.includes(".m3u8")?"HLS":"DEFAULT";if(this.isPlayLogEnabled&&m(o,"TRACK_CHANGE"),t==="HLS"){let s=new y,i=s.getHlsInstance();i?(i.detachMedia(),s.addHlsMedia(e)):await this.reset();}else o.src=e.source;L.notify("AUDIO_STATE",{playbackState:l.TRACK_CHANGE,currentTrackPlayTime:0,currentTrack:e}),$(e),o.load();}attachEq(){if(this.isEqEnabled&&this.eqStatus==="IDEAL")try{let e=new U;this.eqStatus=e.status(),this.eqInstance=e;}catch{}}async play(){let e=o.src!=="";o?.paused&&o.HAVE_ENOUGH_DATA===k.HAVE_ENOUGH_DATA&&e&&await o.play().then(()=>{}).catch(()=>{});}async addMediaAndPlay(e,t){let s=e||(this._queue.length>0?this._queue[0]:void 0);t&&v(t)&&s&&t(s),this._queue&&p(this._queue)&&(this._currentQueueIndex=this._queue.findIndex(i=>i.id===s?.id));try{s&&this.addMedia(s).then(()=>{o.HAVE_ENOUGH_DATA===k.HAVE_ENOUGH_DATA&&setTimeout(async()=>{this.attachEq(),await this.play();},950);});}catch{}}pause(){o&&!o?.paused&&o?.pause();}stop(){o&&!o.paused&&(o?.pause(),o.currentTime=0);}async reset(){o&&(this.stop(),o.src="",o.srcObject=null);}setVolume(e){let t=e/100;o&&(o.volume=t,L.notify("AUDIO_STATE",{volume:e}));}setPlaybackRate(e){o&&(o.playbackRate=e,L.notify("AUDIO_STATE",{playbackRate:e}));}mute(){o&&!o.muted&&(o.muted=!0);}seek(e){o&&(o.currentTime=e);}async destroy(){o&&(await this.reset(),o.removeAttribute("src"),o.load());}subscribe(e,t,s={}){return L.listen(e,t,s)}addEventListener(e,t){o.addEventListener(e,t);}getPresets(){return U.getPresets()}setPreset(e){this.eqInstance.setPreset(e);}setCustomEQ(e){this.eqInstance.setCustomEQ(e);}addQueue(e,t){let s=p(e)?e.slice():[];switch(t){case"DEFAULT":this._queue=s;break;case"REVERSE":this._queue=s.reverse();break;case"SHUFFLE":this._queue=K(s);break;default:this._queue=s;break}V();}playNext(){if(this._queue.length>this._currentQueueIndex+1){this._currentQueueIndex++;let e=this._queue[this._currentQueueIndex];this.addMediaAndPlay(e);}}playPrevious(){if(this._currentQueueIndex>0){this._currentQueueIndex--;let e=this._queue[this._currentQueueIndex];this.addMediaAndPlay(e);}}clearQueue(){this._queue&&p(this._queue)&&(this._queue=[]);}removeFromQueue(e){if(this._queue&&p(this._queue)){let t=this._queue.filter(s=>s.id==e.id);this._queue=t;}}getQueue(){if(this._queue&&this._queue.length)return this._queue}get id(){return o?.getAttribute("id")}static getAudioInstance(){return o}},r(h,"AudioX"),d(h,"_instance"),h);

export { b as AUDIO_EVENTS, F as AUDIO_STATE, O as AUDIO_X_CONSTANTS, _ as AudioX };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map