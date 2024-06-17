var B=Object.defineProperty;var M=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var U=(s,e,t)=>e in s?B(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,m=(s,e)=>{for(var t in e||(e={}))re.call(e,t)&&U(s,t,e[t]);if(M)for(var t of M(e))oe.call(e,t)&&U(s,t,e[t]);return s};var n=(s,e)=>B(s,"name",{value:e,configurable:!0});var u=(s,e,t)=>(U(s,typeof e!="symbol"?e+"":e,t),t);var p=(s,e,t)=>new Promise((a,i)=>{var o=A=>{try{f(t.next(A));}catch(S){i(S);}},c=A=>{try{f(t.throw(A));}catch(S){i(S);}},f=A=>A.done?a(A.value):Promise.resolve(A.value).then(o,c);f((t=t.apply(s,e)).next());});var q=[{frequency:31,type:"lowshelf",gain:0},{frequency:63,type:"peaking",gain:0},{frequency:125,type:"peaking",gain:0},{frequency:250,type:"peaking",gain:0},{frequency:500,type:"peaking",gain:0},{frequency:1e3,type:"peaking",gain:0},{frequency:2e3,type:"peaking",gain:0},{frequency:4e3,type:"peaking",gain:0},{frequency:8e3,type:"peaking",gain:0},{frequency:16e3,type:"highshelf",gain:0}],I=[{name:"Default",id:"default",default:!0,gains:[0,0,0,0,0,0,0,0,0,0]},{name:"Club",id:"club",default:!0,gains:[0,0,4.8,3.36,3.36,3.36,1.92,0,0,0]},{name:"Live",id:"live",default:!0,gains:[-2.88,0,2.4,3.36,3.36,3.36,2.4,1.44,1.44,1.44]},{name:"Party",id:"Party",default:!0,gains:[4.32,4.32,0,0,0,0,0,0,4.32,4.32]},{name:"Pop",id:"pop",default:!0,gains:[.96,2.88,4.32,4.8,3.36,0,-1.44,-1.44,.96,.96]},{name:"Soft",id:"soft",default:!0,gains:[2.88,.96,0,-1.44,0,2.4,4.8,5.76,6.72,7.2]},{name:"Ska",id:"ska",default:!0,gains:[-1.44,-2.88,-2.4,0,2.4,3.36,5.28,5.76,6.72,5.76]},{name:"Reggae",id:"reggae",default:!0,gains:[0,0,0,-3.36,0,3.84,3.84,0,0,0]},{name:"Rock",id:"rock",default:!0,gains:[4.8,2.88,-3.36,-4.8,-1.92,2.4,5.28,6.72,6.72,6.72]},{name:"Dance",id:"dance",default:!0,gains:[5.76,4.32,1.44,0,0,-3.36,-4.32,-4.32,0,0]},{name:"Techno",id:"techno",default:!0,gains:[4.8,3.36,0,-3.36,-2.88,0,4.8,5.76,5.76,5.28]},{name:"Headphones",id:"headphones",default:!0,gains:[2.88,6.72,3.36,-1.92,-1.44,.96,2.88,5.76,7.68,8.64]},{name:"Soft rock",id:"soft_rock",default:!0,gains:[2.4,2.4,1.44,0,-2.4,-3.36,-1.92,0,1.44,5.28]},{name:"Classical",id:"classical",default:!0,gains:[0,0,0,0,0,0,-4.32,-4.32,-4.32,-5.76]},{name:"Large Hall",id:"large_hall",default:!0,gains:[6.24,6.24,3.36,3.36,0,-2.88,-2.88,-2.88,0,0]},{name:"Full Bass",id:"full_base",default:!0,gains:[4.8,5.76,5.76,3.36,.96,-2.4,-4.8,-6.24,-6.72,-6.72]},{name:"Full Treble",id:"full_treble",default:!0,gains:[-5.76,-5.76,-5.76,-2.4,1.44,6.72,9.6,9.6,9.6,10.08]},{name:"Laptop Speakers",id:"laptop_speakers",default:!0,gains:[2.88,6.72,3.36,-1.92,-1.44,.96,2.88,5.76,7.68,8.64]},{name:"Full Bass & Treble",id:"bass_treble",default:!0,gains:[4.32,3.36,0,-4.32,-2.88,.96,4.8,6.72,7.2,7.2]}];var P=Object.freeze({REACT:"REACT",VANILLA:"VANILLA",DEVELOPMENT:"development"}),l=Object.freeze({BUFFERING:"buffering",PLAYING:"playing",PAUSED:"paused",READY:"ready",IDLE:"idle",ENDED:"ended",STALLED:"stalled",ERROR:"error",TRACK_CHANGE:"trackchanged",DURATION_CHANGE:"durationchanged"}),R=Object.freeze({MEDIA_ERR_ABORTED:"The user canceled the audio.",MEDIA_ERR_DECODE:"An error occurred while decoding the audio.",MEDIA_ERR_NETWORK:"A network error occurred while fetching the audio.",MEDIA_ERR_SRC_NOT_SUPPORTED:"The audio is missing or is in a format not supported by your browser.",DEFAULT:"An unknown error occurred."}),V={HLS:"https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.11/hls.min.js",CAST:"https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"};var d,ne=(d=class{static validateEventName(e){if(!e||typeof e!="string")throw new Error("Invalid event name")}static notify(e,t,a="audiox_notifier_default"){this.validateEventName(e);let i=d.listeners[e];i&&t!==null&&(d.notifierState[e]=m(m({},d.notifierState[e]||{}),t),i.forEach(o=>{o(d.notifierState[e]);}));}static listen(e,t,a={}){if(this.validateEventName(e),typeof t!="function")throw new Error("Callback must be a function");return d.listeners[e]?d.listeners[e].add(t):(d.notifierState[e]=a,d.listeners[e]=new Set([t])),()=>{let i=d.listeners[e];i&&(i.delete(t),i.size===0&&delete d.listeners[e]);}}static multiListen(e,t,a={}){if(this.validateEventName(e),!Array.isArray(t)||t.length===0)throw new Error("Callbacks must be a non-empty array of functions");let i=t.map(o=>d.listen(e,o,a));return ()=>{i.forEach(o=>o());}}static getLatestState(e){return this.validateEventName(e),d.notifierState[e]}},n(d,"ChangeNotifier"),u(d,"listeners",{}),u(d,"notifierState",{}),d),_=ne;var T=n(s=>s&&Array.isArray(s)&&s.length,"isValidArray"),Y=n(s=>s instanceof Function&&typeof s=="function","isValidFunction");var K={},X=n(s=>{let e="",t=s.error;switch(t==null?void 0:t.code){case MediaError.MEDIA_ERR_ABORTED:e+=R.MEDIA_ERR_ABORTED;break;case MediaError.MEDIA_ERR_NETWORK:e+=R.MEDIA_ERR_NETWORK;break;case MediaError.MEDIA_ERR_DECODE:e+=R.MEDIA_ERR_DECODE;break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:e+=R.MEDIA_ERR_SRC_NOT_SUPPORTED;break;default:e+=R.DEFAULT;break}return e},"getReadableErrorMessage"),Q=n(s=>{var S;let{title:e,album:t,artist:a,artwork:i}=s,o=i?(S=i[0])==null?void 0:S.src:"",f=["96x96","128x128","192x192","256x256","384x384","512x512"].map(b=>({src:o,sizes:b,type:"image/png"}));return {title:e,album:t,artist:a,artwork:f}},"metaDataCreator"),F=0,L=n((s,e)=>{let t=new Set;for(let o=0;o<s.played.length;o++){let c=s.played.start(o),A=s.played.end(o)-c;t.add(A);}let i=[...t].reduce((o,c)=>o+c,0);F=["ENDED","TRACK_CHANGE","PAUSE"].includes(e)?i:F,_.notify("AUDIO_STATE",{currentTrackPlayTime:i,previousTrackPlayTime:F});},"calculateActualPlayedLength"),j=n((s,e,t)=>new Promise((a,i)=>{if(window instanceof Window&&window.document)if(K[t])e(),a();else {K[t]=!0;let o=document.createElement("script");o.type="text/javascript",o.src=s,o.async=!0,o.onload=()=>{e(),a();},document.head.appendChild(o);}else i(`Window not ready unable to initialize ${t}`);}),"loadScript"),z=n(()=>{let s=new h,e=s.getQueue(),t=!1,a=n(i=>{i.playbackState==="ended"&&!t&&(t=!0,e&&T(e)&&s.playNext()),i.playbackState!=="ended"&&(t=!1);},"audioStateListener");_.listen("AUDIO_STATE",a);},"handleQueuePlayback"),$=n(s=>{let e=[...s];for(let t=e.length-1;t>0;t--){let a=Math.floor(Math.random()*t);[e[t],e[a]]=[e[a],e[t]];}return e},"shuffle");var g,k=(g=class{constructor(){u(this,"audioCtx");u(this,"audioCtxStatus");u(this,"eqFilterBands");if(g._instance)return g._instance;this.initializeAudioContext(),g._instance=this;}initializeAudioContext(){typeof AudioContext!="undefined"?this.audioCtx=new AudioContext:typeof window.webkitAudioContext!="undefined"&&(this.audioCtx=new window.webkitAudioContext),this.audioCtxStatus="ACTIVE",this.init(),this.audioCtx.state==="suspended"&&this.addResumeListener();}addResumeListener(){let e=n(()=>{this.audioCtx.resume(),setTimeout(()=>{this.audioCtx.state==="running"&&document.body.removeEventListener("click",e,!1);},0);},"resume");document.body.addEventListener("click",e,!1);}init(){try{let e=h.getAudioInstance(),t=this.audioCtx.createMediaElementSource(e),a=q.map(o=>{let c=this.audioCtx.createBiquadFilter();return c.type=o.type,c.frequency.value=o.frequency,c.gain.value=o.gain,c.Q.value=1,c}),i=this.audioCtx.createGain();i.gain.value=1,t.connect(a[0]);for(let o=0;o<a.length-1;o++)a[o].connect(a[o+1]);a[a.length-1].connect(i),i.connect(this.audioCtx.destination),this.audioCtxStatus="ACTIVE",this.eqFilterBands=a;}catch(e){this.audioCtxStatus="FAILED";}}setPreset(e){let t=I.find(a=>a.id===e);t&&(!this.eqFilterBands||this.eqFilterBands.length!==t.gains.length||this.eqFilterBands.forEach((a,i)=>{a.gain.value=t.gains[i];}));}static getPresets(){return I}status(){return this.audioCtx.state==="suspended"&&this.audioCtx.resume(),this.audioCtxStatus}setCustomEQ(e){T(e)&&this.eqFilterBands.forEach((t,a)=>{t.gain.value=e[a];});}},n(g,"Equalizer"),u(g,"_instance"),g);var W={ERROR:(s,e)=>{let t=e.type,a=e.details,i=e.fatal;_.notify("AUDIO_STATE",{playbackState:l.ERROR,error:{type:t,isFatal:i,detail:a}},`audiox_baseEvents_state_${s.type}`);},FRAG_CHANGED:()=>{}};var x=Object.freeze({ABORT:"abort",TIME_UPDATE:"timeupdate",CAN_PLAY:"canplay",CAN_PLAY_THROUGH:"canplaythrough",DURATION_CHANGE:"durationchange",ENDED:"ended",EMPTIED:"emptied",PLAYING:"playing",WAITING:"waiting",SEEKING:"seeking",SEEKED:"seeked",LOADED_META_DATA:"loadedmetadata",LOADED_DATA:"loadeddata",PLAY:"play",PAUSE:"pause",RATE_CHANGE:"ratechange",VOLUME_CHANGE:"volumechange",SUSPEND:"suspend",STALLED:"stalled",PROGRESS:"progress",LOAD_START:"loadstart",ERROR:"error",TRACK_CHANGE:"trackchange"}),J={MEDIA_ATTACHING:"hlsMediaAttaching",MEDIA_ATTACHED:"hlsMediaAttached",MEDIA_DETACHING:"hlsMediaDetaching",MEDIA_DETACHED:"hlsMediaDetached",BUFFER_RESET:"hlsBufferReset",BUFFER_CODECS:"hlsBufferCodecs",BUFFER_CREATED:"hlsBufferCreated",BUFFER_APPENDING:"hlsBufferAppending",BUFFER_APPENDED:"hlsBufferAppended",BUFFER_EOS:"hlsBufferEos",BUFFER_FLUSHING:"hlsBufferFlushing",BUFFER_FLUSHED:"hlsBufferFlushed",MANIFEST_LOADING:"hlsManifestLoading",MANIFEST_LOADED:"hlsManifestLoaded",MANIFEST_PARSED:"hlsManifestParsed",LEVEL_SWITCHING:"hlsLevelSwitching",LEVEL_SWITCHED:"hlsLevelSwitched",LEVEL_LOADING:"hlsLevelLoading",LEVEL_LOADED:"hlsLevelLoaded",LEVEL_UPDATED:"hlsLevelUpdated",LEVEL_PTS_UPDATED:"hlsLevelPtsUpdated",LEVELS_UPDATED:"hlsLevelsUpdated",AUDIO_TRACKS_UPDATED:"hlsAudioTracksUpdated",AUDIO_TRACK_SWITCHING:"hlsAudioTrackSwitching",AUDIO_TRACK_SWITCHED:"hlsAudioTrackSwitched",AUDIO_TRACK_LOADING:"hlsAudioTrackLoading",AUDIO_TRACK_LOADED:"hlsAudioTrackLoaded",SUBTITLE_TRACKS_UPDATED:"hlsSubtitleTracksUpdated",SUBTITLE_TRACKS_CLEARED:"hlsSubtitleTracksCleared",SUBTITLE_TRACK_SWITCH:"hlsSubtitleTrackSwitch",SUBTITLE_TRACK_LOADING:"hlsSubtitleTrackLoading",SUBTITLE_TRACK_LOADED:"hlsSubtitleTrackLoaded",SUBTITLE_FRAG_PROCESSED:"hlsSubtitleFragProcessed",CUES_PARSED:"hlsCuesParsed",NON_NATIVE_TEXT_TRACKS_FOUND:"hlsNonNativeTextTracksFound",INIT_PTS_FOUND:"hlsInitPtsFound",FRAG_LOADING:"hlsFragLoading",FRAG_LOAD_EMERGENCY_ABORTED:"hlsFragLoadEmergencyAborted",FRAG_LOADED:"hlsFragLoaded",FRAG_DECRYPTED:"hlsFragDecrypted",FRAG_PARSING_INIT_SEGMENT:"hlsFragParsingInitSegment",FRAG_PARSING_USERDATA:"hlsFragParsingUserdata",FRAG_PARSING_METADATA:"hlsFragParsingMetadata",FRAG_PARSED:"hlsFragParsed",FRAG_BUFFERED:"hlsFragBuffered",FRAG_CHANGED:"hlsFragChanged",FPS_DROP:"hlsFpsDrop",FPS_DROP_LEVEL_CAPPING:"hlsFpsDropLevelCapping",ERROR:"hlsError",DESTROYING:"hlsDestroying",KEY_LOADING:"hlsKeyLoading",KEY_LOADED:"hlsKeyLoaded",LIVE_BACK_BUFFER_REACHED:"hlsLiveBackBufferReached",BACK_BUFFER_REACHED:"hlsBackBufferReached"};var H=n((s,e=!1)=>{let t=h.getAudioInstance();T(Object.keys(s))&&Object.keys(s).forEach(a=>{let i=a;t==null||t.addEventListener(x[i],o=>{if(a&&s[i]){let c=s[i];typeof c=="function"&&c(o,t,e);}});});},"attachEventListeners");var Z=n((s,e=!1)=>{let a=new O().getHlsInstance();T(Object.keys(s))&&Object.keys(s).forEach(i=>{let o=i;a.on(J[o],(c,f)=>{if(o&&s[o]){let A=s[o];typeof A=="function"&&A(c,f,a,e);}});});},"attachHlsEventsListeners");var C,D,le=(D=class{constructor(){u(this,"HlsClass");if(D._instance)return D._instance;D._instance=this;}load(){return p(this,null,function*(){return yield j(V.HLS,()=>{},"hls").then(()=>{this.HlsClass=window.Hls,window.Hls=void 0;}).catch(e=>{}),this.HlsClass})}init(){return p(this,arguments,function*(e={},t){let a=yield this.load();a.isSupported()&&(C=new a(e),Z(W,t));})}addHlsMedia(e){let t=this.HlsClass,a=h.getAudioInstance();C.loadSource(e.source),C.attachMedia(a),C.on(t.Events.MEDIA_ATTACHED,function(){});}getHlsInstance(){return C}},n(D,"HlsAdapter"),u(D,"_instance"),D),O=le;var ee=Object.freeze({1:"MEDIA_ERR_ABORTED",3:"MEDIA_ERR_DECODE",2:"MEDIA_ERR_NETWORK",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"});var E=_,te={LOAD_START:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e==null?void 0:e.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},DURATION_CHANGE:(s,e)=>{let t=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:t.playbackState==="playing"?l.PLAYING:l.DURATION_CHANGE,duration:e==null?void 0:e.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},LOADED_META_DATA:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e==null?void 0:e.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},LOADED_DATA:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,duration:e==null?void 0:e.duration,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},CAN_PLAY:s=>{E.notify("AUDIO_STATE",{playbackState:l.READY,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},CAN_PLAY_THROUGH:s=>{let e=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:e.playbackState==="playing"?l.PLAYING:l.READY,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},PLAY:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.PLAYING,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},PLAYING:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.PLAYING,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},PAUSE:(s,e,t)=>{E.notify("AUDIO_STATE",{playbackState:l.PAUSED,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`),t&&L(e,"PAUSE");},ENDED:(s,e,t)=>{E.notify("AUDIO_STATE",{playbackState:l.ENDED,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`),t&&L(e,"ENDED");},ERROR:(s,e)=>{var i;let t=(i=e.error)==null?void 0:i.code,a=X(e);E.notify("AUDIO_STATE",{playbackState:l.ERROR,error:{code:t,message:ee[t],readable:a}},`audiox_baseEvents_state_${s.type}`);},TIME_UPDATE:(s,e)=>{let t=E.getLatestState("AUDIO_X_STATE");E.notify("AUDIO_STATE",{playbackState:e.paused?t==null?void 0:t.playbackState:l.PLAYING,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},WAITING:(s,e)=>{E.notify("AUDIO_STATE",{playbackState:l.BUFFERING,progress:e==null?void 0:e.currentTime,error:{code:null,message:"",readable:""}},`audiox_baseEvents_state_${s.type}`);},VOLUME_CHANGE:s=>{E.notify("AUDIO_STATE",{},"audiox_baseEvents_state");}};var se=n(s=>{"mediaSession"in navigator&&(navigator.mediaSession.metadata=new MediaMetadata(Q(s)));},"updateMetaData"),ae=n(()=>{"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>{h.getAudioInstance().play();}),navigator.mediaSession.setActionHandler("pause",()=>{h.getAudioInstance().pause();}));},"attachMediaSessionHandlers");var v={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},w={playbackState:l.IDLE,duration:0,bufferedDuration:0,progress:0,volume:50,playbackRate:1,error:{code:null,message:"",readable:""},currentTrack:{},currentTrackPlayTime:0,previousTrackPlayTime:0};_.listen("AUDIO_STATE",s=>{_.notify("AUDIO_X_STATE",m(m({},w),s));},w);var r,N=_,y,h=(y=class{constructor(){u(this,"_audio");u(this,"isPlayLogEnabled");u(this,"_queue");u(this,"_currentQueueIndex",0);u(this,"_fetchFn");u(this,"eqStatus","IDEAL");u(this,"isEqEnabled",!1);u(this,"eqInstance");var e;if(y._instance)return y._instance;if(process.env.NODE_ENV!==((e=P)==null?void 0:e.DEVELOPMENT)&&r)throw new Error("Cannot create multiple audio instance");y._instance=this,this._audio=new Audio,r=this._audio;}init(e){return p(this,null,function*(){var G;let{preloadStrategy:t="auto",autoPlay:a=!1,useDefaultEventListeners:i=!0,customEventListeners:o=null,showNotificationActions:c=!1,enablePlayLog:f=!1,enableHls:A=!1,enableEQ:S=!1,crossOrigin:b="anonymous",hlsConfig:ie={}}=e;(G=this._audio)==null||G.setAttribute("id","audio_x_instance"),this._audio.preload=t,this._audio.autoplay=a,this._audio.crossOrigin=b,this.isPlayLogEnabled=f,o!==null?H(o,!1):H(te,f),c&&ae(),S&&(this.isEqEnabled=S),A&&new O().init(ie,f);})}addMedia(e){return p(this,null,function*(){if(!e)return;let t=e.source.includes(".m3u8")?"HLS":"DEFAULT";if(this.isPlayLogEnabled&&L(r,"TRACK_CHANGE"),t==="HLS"){let a=new O,i=a.getHlsInstance();i?(i.detachMedia(),a.addHlsMedia(e)):yield this.reset();}else r.src=e.source;N.notify("AUDIO_STATE",{playbackState:l.TRACK_CHANGE,currentTrackPlayTime:0,currentTrack:e}),se(e),r.load();})}attachEq(){if(this.isEqEnabled&&this.eqStatus==="IDEAL")try{let e=new k;this.eqStatus=e.status(),this.eqInstance=e;}catch(e){}}play(){return p(this,null,function*(){let e=r.src!=="";r!=null&&r.paused&&r.HAVE_ENOUGH_DATA===v.HAVE_ENOUGH_DATA&&e&&(yield r.play().then(()=>{}).catch(()=>{}));})}addMediaAndPlay(e,t){return p(this,null,function*(){let a=e||(this._queue.length>0?this._queue[0]:void 0);t&&Y(t)&&a&&(this._fetchFn=t,yield t(a)),this._queue&&T(this._queue)&&(this._currentQueueIndex=this._queue.findIndex(i=>i.id===(a==null?void 0:a.id)));try{a&&this.addMedia(a).then(()=>{r.HAVE_ENOUGH_DATA===v.HAVE_ENOUGH_DATA&&setTimeout(()=>p(this,null,function*(){this.attachEq(),yield this.play();}),950);});}catch(i){}})}pause(){r&&!(r!=null&&r.paused)&&(r==null||r.pause());}stop(){r&&!r.paused&&(r==null||r.pause(),r.currentTime=0);}reset(){return p(this,null,function*(){r&&(this.stop(),r.src="",r.srcObject=null);})}setVolume(e){let t=e/100;r&&(r.volume=t,N.notify("AUDIO_STATE",{volume:e}));}setPlaybackRate(e){r&&(r.playbackRate=e,N.notify("AUDIO_STATE",{playbackRate:e}));}mute(){r&&!r.muted&&(r.muted=!0);}seek(e){r&&(r.currentTime=e);}destroy(){return p(this,null,function*(){r&&(yield this.reset(),r.removeAttribute("src"),r.load());})}subscribe(e,t,a={}){return N.listen(e,t,a)}addEventListener(e,t){r.addEventListener(e,t);}getPresets(){return k.getPresets()}setPreset(e){this.eqInstance.setPreset(e);}setCustomEQ(e){this.eqInstance.setCustomEQ(e);}addQueue(e,t){let a=T(e)?e.slice():[];switch(t){case"DEFAULT":this._queue=a;break;case"REVERSE":this._queue=a.reverse();break;case"SHUFFLE":this._queue=$(a);break;default:this._queue=a;break}z();}playNext(){if(this._queue.length>this._currentQueueIndex+1){this._currentQueueIndex++;let e=this._queue[this._currentQueueIndex];this.addMediaAndPlay(e,this._fetchFn);}}playPrevious(){if(this._currentQueueIndex>0){this._currentQueueIndex--;let e=this._queue[this._currentQueueIndex];this.addMediaAndPlay(e,this._fetchFn);}}clearQueue(){this._queue&&T(this._queue)&&(this._queue=[]);}removeFromQueue(e){if(this._queue&&T(this._queue)){let t=this._queue.filter(a=>a.id==e.id);this._queue=t;}}getQueue(){return this._queue&&T(this._queue)?this._queue:[]}get id(){return r==null?void 0:r.getAttribute("id")}static getAudioInstance(){return r}},n(y,"AudioX"),u(y,"_instance"),y);

export { x as AUDIO_EVENTS, w as AUDIO_STATE, P as AUDIO_X_CONSTANTS, h as AudioX };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map