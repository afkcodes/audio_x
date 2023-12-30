var w=Object.defineProperty;var Q=(s,e,t)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var r=(s,e)=>w(s,"name",{value:e,configurable:!0});var c=(s,e,t)=>(Q(s,typeof e!="symbol"?e+"":e,t),t);var k=[{frequency:31,type:"lowshelf",gain:0},{frequency:63,type:"peaking",gain:0},{frequency:125,type:"peaking",gain:0},{frequency:250,type:"peaking",gain:0},{frequency:500,type:"peaking",gain:0},{frequency:1e3,type:"peaking",gain:0},{frequency:2e3,type:"peaking",gain:0},{frequency:4e3,type:"peaking",gain:0},{frequency:8e3,type:"peaking",gain:0},{frequency:16e3,type:"highshelf",gain:0}],C=[{id:"preset_default",name:"Default",gains:[0,0,0,0,0,0,0,0,0,0]},{id:"preset_live",name:"Live",gains:[-1,1,3,4,4,4,3,2,2,2]},{id:"preset_acoustic",name:"Acoustic",gains:[6,6,4,1,3,3,4,5,4,1.5]},{id:"preset_classical",name:"Classical",gains:[6,5,4,3,-1,-1,0,2,4,5]},{id:"preset_piano",name:"Piano",gains:[4,2,0,3.5,4,1.5,5,6,4,4.5]},{id:"preset_lounge",name:"Lounge",gains:[-3,-1.5,0,1,5.5,1,0,-1.5,2,.5]},{id:"preset_spoken_word",name:"Spoken Word",gains:[-2,0,0,1,5,6.5,7,6,3,0]},{id:"preset_jazz",name:"Jazz",gains:[5.5,4,1,2,-1.5,-1.5,0,1,4,5.5]},{id:"preset_pop",name:"Pop",gains:[.5,2.4,3.8,4.3,3,0,-.5,-.5,.5,.5]},{id:"preset_dance",name:"Dance",gains:[5,10,6.5,0,2,4.5,7.5,7,5.5,0]},{id:"preset_latin",name:"Latin",gains:[3.5,1.5,0,0,-1.5,-1.5,-1.5,0,4,6.5]},{id:"preset_rnb",name:"RnB",gains:[3.5,10.5,8.5,1,-3,-1.5,3,3.5,4,5]},{id:"preset_hiphop",name:"HipHop",gains:[7,6,1,4,-1,-.5,1,-.5,2,4]},{id:"preset_electronic",name:"Electronic",gains:[6,5.5,1,0,-2,2,1,1.5,5.5,6.5]},{id:"preset_techno",name:"Techno",gains:[3.8,2.4,0,-2.4,-1.9,0,3.8,4.8,4.8,4.3]},{id:"preset_deep",name:"Deep",gains:[6,5,1.5,.5,4,3,1.5,-2,-5,-6.5]},{id:"preset_club",name:"Club",gains:[0,0,3.8,2.4,2.4,2.4,1,0,0,0]},{id:"preset_rock",name:"Rock",gains:[7,5.5,4,1,-.5,0,.5,3,4.5,6.5]},{id:"preset_rock_soft",name:"Rock Soft",gains:[1.5,0,0,-.5,0,1,3.8,4.8,5.7,6.2]},{id:"preset_ska",name:"Ska",gains:[-.5,-1.5,-1,0,1,2,3.8,4.3,5.2,4.3]},{id:"preset_reggae",name:"Reggae",gains:[0,0,0,-2.4,0,2.5,2.5,0,0,0]},{id:"preset_country",name:"Country",gains:[3,2,1,0,-1,0,2,3,4,4]},{id:"preset_funk",name:"Funk",gains:[4,5,3,0,-1,0,2,4,5,5]},{id:"preset_blues",name:"Blues",gains:[2,1,0,-1,0,1,2,3,4,3]},{id:"preset_metal",name:"Metal",gains:[8,7,6,4,2,1,0,2,4,6]},{id:"preset_indie",name:"Indie",gains:[2,3,2,1,0,-1,-2,0,3,4]},{id:"preset_chill",name:"Chill",gains:[1,1,0,-1,-2,-1,1,2,3,2]},{id:"preset_world",name:"World",gains:[3,2,0,-2,-1,1,3,4,5,3]},{id:"preset_alternative",name:"Alternative",gains:[3,2,1,0,-1,-2,1,3,4,3]},{id:"preset_ambient",name:"Ambient",gains:[0,-1,-2,-3,-2,0,1,2,3,2]},{id:"preset_mellow",name:"Mellow",gains:[1,1,0,-1,-2,-1,1,2,3,1]},{id:"preset_grunge",name:"Grunge",gains:[5,4,3,2,1,0,0,2,4,5]},{id:"preset_soul",name:"Soul",gains:[3,3,2,1,0,-1,0,2,3,3]},{id:"preset_folk",name:"Folk",gains:[2,1,0,-1,-2,-1,1,2,3,2]},{id:"preset_trap",name:"Trap",gains:[7,6,3,1,-2,-1,1,3,6,7]},{id:"preset_dubstep",name:"Dubstep",gains:[6,5,4,3,2,1,1,3,5,6]}];var O=Object.freeze({REACT:"REACT",VANILLA:"VANILLA",DEVELOPMENT:"development"}),E=Object.freeze({BUFFERING:"buffering",PLAYING:"playing",PAUSED:"paused",READY:"ready",IDLE:"idle",ENDED:"ended",STALLED:"stalled",ERROR:"error",TRACK_CHANGE:"trackchanged"}),S=Object.freeze({MEDIA_ERR_ABORTED:"The user canceled the audio.",MEDIA_ERR_DECODE:"An error occurred while decoding the audio.",MEDIA_ERR_NETWORK:"A network error occurred while fetching the audio.",MEDIA_ERR_SRC_NOT_SUPPORTED:"The audio is missing or is in a format not supported by your browser.",DEFAULT:"An unknown error occurred."}),x={HLS:"https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"};var l,J=(l=class{static validateEventName(e){if(!e||typeof e!="string")throw new Error("Invalid event name")}static notify(e,t,a="audiox_notifier_default"){this.validateEventName(e);let o=l.listeners[e];o&&t!==null&&(l.notifierState[e]={...l.notifierState[e]||{},...t},o.forEach(i=>{i(l.notifierState[e]);}));}static listen(e,t,a={}){if(this.validateEventName(e),typeof t!="function")throw new Error("Callback must be a function");return l.listeners[e]?l.listeners[e].add(t):(l.notifierState[e]=a,l.listeners[e]=new Set([t])),()=>{let o=l.listeners[e];o&&(o.delete(t),o.size===0&&delete l.listeners[e]);}}static multiListen(e,t,a={}){if(this.validateEventName(e),!Array.isArray(t)||t.length===0)throw new Error("Callbacks must be a non-empty array of functions");let o=t.map(i=>l.listen(e,i,a));return ()=>{o.forEach(i=>i());}}static getLatestState(e){return this.validateEventName(e),l.notifierState[e]}},r(l,"ChangeNotifier"),c(l,"listeners",{}),c(l,"notifierState",{}),l),A=J;var D=r(s=>s&&Array.isArray(s)&&s.length,"isValidArray");var M={},G=r(s=>{let e="";switch(s.error?.code){case MediaError.MEDIA_ERR_ABORTED:e+=S.MEDIA_ERR_ABORTED;break;case MediaError.MEDIA_ERR_NETWORK:e+=S.MEDIA_ERR_NETWORK;break;case MediaError.MEDIA_ERR_DECODE:e+=S.MEDIA_ERR_DECODE;break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:e+=S.MEDIA_ERR_SRC_NOT_SUPPORTED;break;default:e+=S.DEFAULT;break}return e},"getReadableErrorMessage"),v=r(s=>{let{title:e,album:t,artist:a,artwork:o}=s,i=o?o[0]?.src:"",g=["96x96","128x128","192x192","256x256","384x384","512x512"].map(I=>({src:i,sizes:I,type:"image/png"}));return {title:e,album:t,artist:a,artwork:g}},"metaDataCreator"),N=0,m=r((s,e)=>{let t=new Set;for(let i=0;i<s.played.length;i++){let d=s.played.start(i),h=s.played.end(i)-d;t.add(h);}let o=[...t].reduce((i,d)=>i+d,0);N=["ENDED","TRACK_CHANGE","PAUSE"].includes(e)?o:N,A.notify("AUDIO_STATE",{currentTrackPlayTime:o,previousTrackPlayTime:N});},"calculateActualPlayedLength"),B=r((s,e,t)=>new Promise((a,o)=>{if(window instanceof Window&&window.document)if(M[t])e(),a();else {M[t]=!0;let i=document.createElement("script");i.type="text/javascript",i.src=s,i.async=!0,i.onload=()=>{e(),a();},document.head.appendChild(i);}else o(`Window not ready unable to initialize ${t}`);}),"loadScript");var p,U=(p=class{constructor(){c(this,"audioCtx");c(this,"audioCtxStatus");c(this,"eqFilterBands");if(p._instance)return p._instance;if(this.audioCtx===void 0&&typeof AudioContext<"u")if(typeof AudioContext<"u")this.audioCtx=new AudioContext,this.audioCtxStatus="ACTIVE",this.init();else if(typeof window.webkitAudioContext<"u")this.audioCtx=new window.webkitAudioContext,this.audioCtxStatus="ACTIVE",this.init();else throw new Error("Web Audio API is not supported in this browser.");else this.audioCtxStatus="FAILED";if(this.audioCtxStatus==="ACTIVE"&&this.audioCtx.state==="suspended"){var e=r(()=>{this.audioCtx.resume(),setTimeout(()=>{this.audioCtx.state==="running"&&document.body.removeEventListener("click",e,!1);},0);},"resume");document.body.addEventListener("click",e,!1);}p._instance=this;}init(){try{let e=u.getAudioInstance(),t=this.audioCtx.createMediaElementSource(e),a=k.map(i=>{let d=this.audioCtx.createBiquadFilter();return d.type=i.type,d.frequency.value=i.frequency,d.gain.value=i.gain,d.Q.value=1,d}),o=this.audioCtx.createGain();o.gain.value=1,t.connect(a[0]);for(let i=0;i<a.length-1;i++)a[i].connect(a[i+1]);a[a.length-1].connect(o),o.connect(this.audioCtx.destination),this.audioCtxStatus="ACTIVE",this.eqFilterBands=a;}catch{this.audioCtxStatus="FAILED";}}setPreset(e){let t=C.find(a=>a.id===e);if(!(!this.eqFilterBands||this.eqFilterBands.length!==t?.gains.length))for(let a=0;a<this.eqFilterBands.length;a++)this.eqFilterBands[a].gain.value=t?.gains[a];}static getPresets(){return C}status(){return this.audioCtx.state==="suspended"&&this.audioCtx.resume(),this.audioCtxStatus}setCustomEQ(e){D(e)&&this.eqFilterBands.forEach((t,a)=>{t.gain.value=e[a];});}},r(p,"Equalizer"),c(p,"_instance"),p);var V={ERROR:(s,e)=>{let t=e.type,a=e.details,o=e.fatal;A.notify("AUDIO_STATE",{playbackState:E.ERROR,error:{type:t,isFatal:o,detail:a}},`audiox_baseEvents_state_${s.type}`);},FRAG_CHANGED:()=>{}};var b=Object.freeze({ABORT:"abort",TIME_UPDATE:"timeupdate",CAN_PLAY:"canplay",CAN_PLAY_THROUGH:"canplaythrough",DURATION_CHANGE:"durationchange",ENDED:"ended",EMPTIED:"emptied",PLAYING:"playing",WAITING:"waiting",SEEKING:"seeking",SEEKED:"seeked",LOADED_META_DATA:"loadedmetadata",LOADED_DATA:"loadeddata",PLAY:"play",PAUSE:"pause",RATE_CHANGE:"ratechange",VOLUME_CHANGE:"volumechange",SUSPEND:"suspend",STALLED:"stalled",PROGRESS:"progress",LOAD_START:"loadstart",ERROR:"error",TRACK_CHANGE:"trackchange"}),q={MEDIA_ATTACHING:"hlsMediaAttaching",MEDIA_ATTACHED:"hlsMediaAttached",MEDIA_DETACHING:"hlsMediaDetaching",MEDIA_DETACHED:"hlsMediaDetached",BUFFER_RESET:"hlsBufferReset",BUFFER_CODECS:"hlsBufferCodecs",BUFFER_CREATED:"hlsBufferCreated",BUFFER_APPENDING:"hlsBufferAppending",BUFFER_APPENDED:"hlsBufferAppended",BUFFER_EOS:"hlsBufferEos",BUFFER_FLUSHING:"hlsBufferFlushing",BUFFER_FLUSHED:"hlsBufferFlushed",MANIFEST_LOADING:"hlsManifestLoading",MANIFEST_LOADED:"hlsManifestLoaded",MANIFEST_PARSED:"hlsManifestParsed",LEVEL_SWITCHING:"hlsLevelSwitching",LEVEL_SWITCHED:"hlsLevelSwitched",LEVEL_LOADING:"hlsLevelLoading",LEVEL_LOADED:"hlsLevelLoaded",LEVEL_UPDATED:"hlsLevelUpdated",LEVEL_PTS_UPDATED:"hlsLevelPtsUpdated",LEVELS_UPDATED:"hlsLevelsUpdated",AUDIO_TRACKS_UPDATED:"hlsAudioTracksUpdated",AUDIO_TRACK_SWITCHING:"hlsAudioTrackSwitching",AUDIO_TRACK_SWITCHED:"hlsAudioTrackSwitched",AUDIO_TRACK_LOADING:"hlsAudioTrackLoading",AUDIO_TRACK_LOADED:"hlsAudioTrackLoaded",SUBTITLE_TRACKS_UPDATED:"hlsSubtitleTracksUpdated",SUBTITLE_TRACKS_CLEARED:"hlsSubtitleTracksCleared",SUBTITLE_TRACK_SWITCH:"hlsSubtitleTrackSwitch",SUBTITLE_TRACK_LOADING:"hlsSubtitleTrackLoading",SUBTITLE_TRACK_LOADED:"hlsSubtitleTrackLoaded",SUBTITLE_FRAG_PROCESSED:"hlsSubtitleFragProcessed",CUES_PARSED:"hlsCuesParsed",NON_NATIVE_TEXT_TRACKS_FOUND:"hlsNonNativeTextTracksFound",INIT_PTS_FOUND:"hlsInitPtsFound",FRAG_LOADING:"hlsFragLoading",FRAG_LOAD_EMERGENCY_ABORTED:"hlsFragLoadEmergencyAborted",FRAG_LOADED:"hlsFragLoaded",FRAG_DECRYPTED:"hlsFragDecrypted",FRAG_PARSING_INIT_SEGMENT:"hlsFragParsingInitSegment",FRAG_PARSING_USERDATA:"hlsFragParsingUserdata",FRAG_PARSING_METADATA:"hlsFragParsingMetadata",FRAG_PARSED:"hlsFragParsed",FRAG_BUFFERED:"hlsFragBuffered",FRAG_CHANGED:"hlsFragChanged",FPS_DROP:"hlsFpsDrop",FPS_DROP_LEVEL_CAPPING:"hlsFpsDropLevelCapping",ERROR:"hlsError",DESTROYING:"hlsDestroying",KEY_LOADING:"hlsKeyLoading",KEY_LOADED:"hlsKeyLoaded",LIVE_BACK_BUFFER_REACHED:"hlsLiveBackBufferReached",BACK_BUFFER_REACHED:"hlsBackBufferReached"};var P=r((s,e=!1)=>{let t=u.getAudioInstance();D(Object.keys(s))&&Object.keys(s).forEach(a=>{let o=a;t?.addEventListener(b[o],i=>{if(a&&s[o]){let d=s[o];typeof d=="function"&&d(i,t,e);}});});},"attachEventListeners");var K=r((s,e=!1)=>{let a=new R().getHlsInstance();D(Object.keys(s))&&Object.keys(s).forEach(o=>{let i=o;a.on(q[i],(d,g)=>{if(i&&s[i]){let h=s[i];typeof h=="function"&&h(d,g,a,e);}});});},"attachHlsEventsListeners");var y,T,Z=(T=class{constructor(){c(this,"HlsClass");if(T._instance)return T._instance;T._instance=this;}async load(){return await B(x.HLS,()=>{},"hls").then(()=>{this.HlsClass=window.Hls,window.Hls=void 0;}).catch(e=>{}),this.HlsClass}async init(e={},t){let a=await this.load();a.isSupported()&&(y=new a(e),K(V,t));}addHlsMedia(e){let t=this.HlsClass,a=u.getAudioInstance();y.loadSource(e.source),y.attachMedia(a),y.on(t.Events.MEDIA_ATTACHED,function(){});}getHlsInstance(){return y}},r(T,"HlsAdapter"),c(T,"_instance"),T),R=Z;var Y=Object.freeze({1:"MEDIA_ERR_ABORTED",3:"MEDIA_ERR_DECODE",2:"MEDIA_ERR_NETWORK",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"});var _=A,z={LOADED_META_DATA:(s,e)=>{_.notify("AUDIO_STATE",{playbackState:E.BUFFERING,duration:e?.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_state_${s.type}`);},CAN_PLAY:s=>{_.notify("AUDIO_STATE",{playbackState:E.BUFFERING,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},CAN_PLAY_THROUGH:s=>{_.notify("AUDIO_STATE",{playbackState:E.READY,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},PLAY:(s,e)=>{_.notify("AUDIO_STATE",{playbackState:E.PLAYING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},PAUSE:(s,e,t)=>{_.notify("AUDIO_STATE",{playbackState:E.PAUSED,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`),t&&m(e,"PAUSE");},ENDED:(s,e,t)=>{_.notify("AUDIO_STATE",{playbackState:E.ENDED,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`),t&&m(e,"ENDED");},ERROR:(s,e)=>{let t=e.error?.code,a=G(e);_.notify("AUDIO_STATE",{playbackState:E.ERROR,error:{code:t,message:Y[t],readable:a}},`audiox_baseEvents_state_${s.type}`);},TIME_UPDATE:(s,e)=>{let t=A.getLatestState("AUDIO_X_STATE");_.notify("AUDIO_STATE",{playbackState:e.paused?t?.playbackState:E.PLAYING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},WAITING:(s,e)=>{_.notify("AUDIO_STATE",{playbackState:E.BUFFERING,progress:e?.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},VOLUME_CHANGE:s=>{_.notify("AUDIO_STATE",{},"audiox_baseEvents_state");}};var X=r(s=>{"mediaSession"in navigator&&(navigator.mediaSession.metadata=new MediaMetadata(v(s)));},"updateMetaData"),j=r(()=>{"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>{u.getAudioInstance().play();}),navigator.mediaSession.setActionHandler("pause",()=>{u.getAudioInstance().pause();}));},"attachMediaSessionHandlers");var H={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},F={playbackState:E.IDLE,duration:0,bufferedDuration:0,progress:0,volume:50,playbackRate:1,error:{code:null,message:"",readable:""},currentTrack:{},currentTrackPlayTime:0,previousTrackPlayTime:0};A.listen("AUDIO_STATE",s=>{A.notify("AUDIO_X_STATE",{...F,...s});},F);var n,L=A,f,u=(f=class{constructor(){c(this,"_audio");c(this,"isPlayLogEnabled");c(this,"eqStatus","IDEAL");c(this,"isEqEnabled",!1);c(this,"eqInstance");if(f._instance)return f._instance;if(process.env.NODE_ENV!==O?.DEVELOPMENT&&n)throw new Error("Cannot create multiple audio instance");f._instance=this,this._audio=new Audio,n=this._audio;}async init(e){let{preloadStrategy:t="auto",autoPlay:a=!1,useDefaultEventListeners:o=!0,customEventListeners:i=null,showNotificationActions:d=!1,enablePlayLog:g=!1,enableHls:h=!1,enableEQ:I=!1,crossOrigin:W="anonymous",hlsConfig:$={}}=e;this._audio?.setAttribute("id","audio_x_instance"),this._audio.preload=t,this._audio.autoplay=a,this._audio.crossOrigin=W,this.isPlayLogEnabled=g,i!==null?P(i,!1):P(z,g),d&&j(),I&&(this.isEqEnabled=I),h&&new R().init($,g);}async addMedia(e){if(!e)return;let t=e.source.includes(".m3u8")?"HLS":"DEFAULT";if(this.isPlayLogEnabled&&m(n,"TRACK_CHANGE"),t==="HLS"){let a=new R,o=a.getHlsInstance();o?(o.detachMedia(),a.addHlsMedia(e)):await this.reset();}else n.src=e.source;L.notify("AUDIO_STATE",{playbackState:E.TRACK_CHANGE,currentTrackPlayTime:0,currentTrack:e}),X(e),n.load();}attachEq(){if(this.isEqEnabled&&this.eqStatus==="IDEAL")try{let e=new U;this.eqStatus=e.status(),this.eqInstance=e;}catch{}}async play(){let e=n.src!=="";n?.paused&&n.HAVE_ENOUGH_DATA===H.HAVE_ENOUGH_DATA&&e&&await n.play().then(()=>{}).catch(()=>{});}async addMediaAndPlay(e){try{e&&this.addMedia(e).then(()=>{n.HAVE_ENOUGH_DATA===H.HAVE_ENOUGH_DATA&&setTimeout(async()=>{this.attachEq(),await this.play();},950);});}catch{}}pause(){n&&!n?.paused&&n?.pause();}stop(){n&&!n.paused&&(n?.pause(),n.currentTime=0);}async reset(){n&&(this.stop(),n.src="",n.srcObject=null);}setVolume(e){let t=e/100;n&&(n.volume=t,L.notify("AUDIO_STATE",{volume:e}));}setPlaybackRate(e){n&&(n.playbackRate=e,L.notify("AUDIO_STATE",{playbackRate:e}));}mute(){n&&!n.muted&&(n.muted=!0);}seek(e){n&&(n.currentTime=e);}async destroy(){n&&(await this.reset(),n.removeAttribute("src"),n.load());}subscribe(e,t,a={}){return L.listen(e,t,a)}addEventListener(e,t){n.addEventListener(e,t);}getPresets(){return U.getPresets()}setPreset(e){this.eqInstance.setPreset(e);}setCustomEQ(e){this.eqInstance.setCustomEQ(e);}get id(){return n?.getAttribute("id")}static getAudioInstance(){return n}},r(f,"AudioX"),c(f,"_instance"),f);

export { b as AUDIO_EVENTS, F as AUDIO_STATE, O as AUDIO_X_CONSTANTS, u as AudioX };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map