function e(e,t){if(t==null||t>e.length)t=e.length;for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function t(t){if(Array.isArray(t))return e(t)}function n(e,t,n,r,a,o,i){try{var u=e[o](i);var c=u.value}catch(e){n(e);return}if(u.done){t(c)}else{Promise.resolve(c).then(r,a)}}function r(e){return function(){var t=this,r=arguments;return new Promise(function(a,o){var i=e.apply(t,r);function u(e){n(i,a,o,u,c,"next",e)}function c(e){n(i,a,o,u,c,"throw",e)}u(undefined)})}}function a(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||false;r.configurable=true;if("value"in r)r.writable=true;Object.defineProperty(e,r.key,r)}}function i(e,t,n){if(t)o(e.prototype,t);if(n)o(e,n);return e}function u(e,t,n){if(t in e){Object.defineProperty(e,t,{value:n,enumerable:true,configurable:true,writable:true})}else{e[t]=n}return e}function c(e,t){if(t!=null&&typeof Symbol!=="undefined"&&t[Symbol.hasInstance]){return!!t[Symbol.hasInstance](e)}else{return e instanceof t}}function l(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function s(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function f(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};var r=Object.keys(n);if(typeof Object.getOwnPropertySymbols==="function"){r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))}r.forEach(function(t){u(e,t,n[t])})}return e}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);if(t){r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})}n.push.apply(n,r)}return n}function E(e,t){t=t!=null?t:{};if(Object.getOwnPropertyDescriptors){Object.defineProperties(e,Object.getOwnPropertyDescriptors(t))}else{d(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})}return e}function v(e){return t(e)||l(e)||y(e)||s()}function A(e){"@swc/helpers - typeof";return e&&typeof Symbol!=="undefined"&&e.constructor===Symbol?"symbol":typeof e}function y(t,n){if(!t)return;if(typeof t==="string")return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);if(r==="Object"&&t.constructor)r=t.constructor.name;if(r==="Map"||r==="Set")return Array.from(r);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return e(t,n)}function p(e,t){var n,r,a,o,i={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]};return o={next:u(0),"throw":u(1),"return":u(2)},typeof Symbol==="function"&&(o[Symbol.iterator]=function(){return this}),o;function u(e){return function(t){return c([e,t])}}function c(o){if(n)throw new TypeError("Generator is already executing.");while(i)try{if(n=1,r&&(a=o[0]&2?r["return"]:o[0]?r["throw"]||((a=r["return"])&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;if(r=0,a)o=[o[0]&2,a.value];switch(o[0]){case 0:case 1:a=o;break;case 4:i.label++;return{value:o[1],done:false};case 5:i.label++;r=o[1];o=[0];continue;case 7:o=i.ops.pop();i.trys.pop();continue;default:if(!(a=i.trys,a=a.length>0&&a[a.length-1])&&(o[0]===6||o[0]===2)){i=0;continue}if(o[0]===3&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(o[0]===6&&i.label<a[1]){i.label=a[1];a=o;break}if(a&&i.label<a[2]){i.label=a[2];i.ops.push(o);break}if(a[2])i.ops.pop();i.trys.pop();continue}o=t.call(e,i)}catch(e){o=[6,e];r=0}finally{n=a=0}if(o[0]&5)throw o[1];return{value:o[0]?o[1]:void 0,done:true}}}var _=Object.defineProperty;var b=function(e,t,n){return t in e?_(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n};var T=function(e,t){return _(e,"name",{value:t,configurable:!0})};var O=function(e,t,n){return b(e,(typeof t==="undefined"?"undefined":A(t))!="symbol"?t+"":t,n),n};var D=Object.freeze({REACT:"REACT",VANILLA:"VANILLA",DEVELOPMENT:"development"}),g=Object.freeze({BUFFERING:"buffering",PLAYING:"playing",PAUSED:"paused",READY:"ready",IDLE:"idle",ENDED:"ended",STALLED:"stalled",ERROR:"error"}),R=Object.freeze({MEDIA_ERR_ABORTED:"The user canceled the audio.",MEDIA_ERR_DECODE:"An error occurred while decoding the audio.",MEDIA_ERR_NETWORK:"A network error occurred while fetching the audio.",MEDIA_ERR_SRC_NOT_SUPPORTED:"The audio is missing or is in a format not supported by your browser.",DEFAULT:"An unknown error occurred."});var m=T(function(e){return e&&Array.isArray(e)&&e.length},"isValidArray"),h=T(function(e){return c(e,Function)&&typeof e=="function"},"isValidFunction"),S=T(function(e){return typeof e=="object"&&e!==null&&c(e,Object)&&Object.keys(e).length},"isValidObject"),I=T(function(e){var t;var n="";switch((t=e.error)===null||t===void 0?void 0:t.code){case MediaError.MEDIA_ERR_ABORTED:n+=R.MEDIA_ERR_ABORTED;break;case MediaError.MEDIA_ERR_NETWORK:n+=R.MEDIA_ERR_NETWORK;break;case MediaError.MEDIA_ERR_DECODE:n+=R.MEDIA_ERR_DECODE;break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:n+=R.MEDIA_ERR_SRC_NOT_SUPPORTED;break;default:n+=R.DEFAULT;break}return n},"getReadableErrorMessage"),N=T(function(e){var t;var n=e.title,r=e.album,a=e.artist,o=e.artwork,i=o?(t=o[0])===null||t===void 0?void 0:t.src:"",u=["96x96","128x128","192x192","256x256","384x384","512x512"].map(function(e){return{src:i,sizes:e,type:"image/png"}});return{title:n,album:r,artist:a,artwork:u}},"metaDataCreator");var k={},U={},w,P=(w=function(){"use strict";function e(){a(this,e)}i(e,null,[{key:"notify",value:function e(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"audiox_notifier_default";var r=k[e];r&&(h(r)&&t!==null&&(console.log("NOTIFYING TO EVENT : ".concat(e," - CALLER : ").concat(n)),S(t)?U[e]=f({},U[e],t):U[e]=t,r(U[e])),m(Array.from(r))&&t!==null&&(S(t)?U[e]=f({},U[e],t):U[e]=t,r.forEach(function(t){t(U[e])})))}},{key:"listen",value:function e(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(!k[e]&&h(t))U[e]||(U[e]=n),k[e]=new Set().add(t);else{var r=v(k[e]);k[e].forEach(function(){r.push(t)}),k[e]=new Set(r)}return function(t,n){k[e]?(console.log("REMOVING EVENT LISTENER FOR EVENT : ".concat(e," - CALLER : ").concat(t)),delete k[e],n&&U[e]&&(console.log("RESETTING STATE FOR EVENT : ".concat(e," - CALLER : ").concat(t)),delete U[e])):console.log("EVENT NOT FOUND : ".concat(e))}}}]);return e}(),T(w,"ChangeNotifier"),w),L=P;var M=Object.freeze({1:"MEDIA_ERR_ABORTED",3:"MEDIA_ERR_DECODE",2:"MEDIA_ERR_NETWORK",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"});var j=L,C={LOADED_META_DATA:function(e,t){var n;console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.BUFFERING,duration:(n=t)===null||n===void 0?void 0:n.duration,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_state_".concat(e.type))},CAN_PLAY:function(e){console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.BUFFERING,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},CAN_PLAY_THROUGH:function(e){console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.READY,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},PLAY:function(e,t){var n;console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.PLAYING,progress:(n=t)===null||n===void 0?void 0:n.currentTime,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},PAUSE:function(e,t){var n;console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.PAUSED,progress:(n=t)===null||n===void 0?void 0:n.currentTime,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},ENDED:function(e,t){var n;console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.ENDED,progress:(n=t)===null||n===void 0?void 0:n.currentTime,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},ERROR:function(e,t){var n;console.log(e.type);var r=(n=t.error)===null||n===void 0?void 0:n.code,a=I(t);j.notify("AUDIO_STATE",{playbackState:g.PAUSED,error:{code:r,message:M[r],readable:a}},"audiox_baseEvents_state_".concat(e.type))},TIME_UPDATE:function(e,t){var n;j.notify("AUDIO_STATE",{playbackState:g.PLAYING,progress:(n=t)===null||n===void 0?void 0:n.currentTime,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},WAITING:function(e,t){var n;console.log(e.type),j.notify("AUDIO_STATE",{playbackState:g.BUFFERING,progress:(n=t)===null||n===void 0?void 0:n.currentTime,error:{code:null,message:"",readable:""}},"audiox_baseEvents_state_".concat(e.type))},VOLUME_CHANGE:function(e){console.log(e.type),j.notify("AUDIO_STATE",{},"audiox_baseEvents_state")}};var G=Object.freeze({ABORT:"abort",TIME_UPDATE:"timeupdate",CAN_PLAY:"canplay",CAN_PLAY_THROUGH:"canplaythrough",DURATION_CHANGE:"durationchange",ENDED:"ended",EMPTIED:"emptied",PLAYING:"playing",WAITING:"waiting",SEEKING:"seeking",SEEKED:"seeked",LOADED_META_DATA:"loadedmetadata",LOADED_DATA:"loadeddata",PLAY:"play",PAUSE:"pause",RATE_CHANGE:"ratechange",VOLUME_CHANGE:"volumechange",SUSPEND:"suspend",STALLED:"stalled",PROGRESS:"progress",LOAD_START:"loadstart",ERROR:"error"});var V=T(function(e){var t=X.getAudioInstance();m(Object.keys(e))&&Object.keys(e).forEach(function(n){var r;var a=n;(r=t)===null||r===void 0?void 0:r.addEventListener(G[a],function(r){if(n&&e[a]){var o=e[a];typeof o=="function"&&o(r,t)}})})},"attachDefaultEventListeners"),H=T(function(e){var t=X.getAudioInstance();m(e)&&e.forEach(function(e){var n;var r=e;Object.keys(G).includes(r)&&((n=t)===null||n===void 0?void 0:n.addEventListener(G[r],function(e){L.notify(G[r],{e:e,audioInstance:t})}))})},"attachCustomEventListeners");var x=T(function(e){"mediaSession"in navigator&&(navigator.mediaSession.metadata=new MediaMetadata(N(e)))},"updateMetaData"),F=T(function(){"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",function(){X.getAudioInstance().play()}),navigator.mediaSession.setActionHandler("pause",function(){X.getAudioInstance().pause()}))},"attachMediaSessionHandlers");var Y={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4},B={playbackState:g.IDLE,duration:0,bufferedDuration:0,progress:0,volume:50,playbackRate:1,error:{code:null,message:"",readable:""},currentTrack:{}};L.listen("AUDIO_STATE",function(e){L.notify("AUDIO_X_STATE",f({},B,e))},B);var z,K=L,W,X=(W=function(){"use strict";function e(){a(this,e);var t;O(this,"_audio");if(W._instance)return console.warn("Instantiation failed: cannot create multiple instance of AudioX returning existing instance"),W._instance;if(process.env.NODE_ENV!==((t=D)===null||t===void 0?void 0:t.DEVELOPMENT)&&z)throw new Error("Cannot create multiple audio instance");W._instance=this,this._audio=new Audio}i(e,[{key:"init",value:function e(e){var t=this;return r(function(){var n,r,a,o,i,u,c,l,s,f,d;return p(this,function(E){r=e.preloadStrategy,a=r===void 0?"auto":r,o=e.autoplay,i=o===void 0?!1:o,u=e.useDefaultEventListeners,c=u===void 0?!0:u,l=e.customEventListeners,s=l===void 0?null:l,f=e.showNotificationActions,d=f===void 0?!1:f;(n=t._audio)===null||n===void 0?void 0:n.setAttribute("id","audio_x_instance"),t._audio.preload=a,t._audio.autoplay=i,z=t._audio,(c||s==null)&&V(C),d&&F();return[2]})})()}},{key:"addMedia",value:function e(e){return r(function(){return p(this,function(t){e&&(z.src=e.source,K.notify("AUDIO_STATE",E(f({},B),{currentTrack:e})),x(e));return[2]})})()}},{key:"play",value:function e(){return r(function(){var e,t,n;return p(this,function(r){switch(r.label){case 0:t=z.src!=="";n=((e=z)===null||e===void 0?void 0:e.paused)&&z.HAVE_ENOUGH_DATA===Y.HAVE_ENOUGH_DATA&&t;if(!n)return[3,2];return[4,z.play()];case 1:n=r.sent();r.label=2;case 2:n;return[2]}})})()}},{key:"addMediaAndPlay",value:function e(e){var t=this;return r(function(){return p(this,function(n){e&&t.addMedia(e).then(function(){z.load(),z.HAVE_ENOUGH_DATA===Y.HAVE_ENOUGH_DATA&&setTimeout(r(function(){return p(this,function(e){switch(e.label){case 0:return[4,t.play()];case 1:e.sent();return[2]}})}),950)});return[2]})})()}},{key:"pause",value:function e(){var e,t;z&&!((e=z)===null||e===void 0?void 0:e.paused)&&((t=z)===null||t===void 0?void 0:t.pause())}},{key:"stop",value:function e(){var e;z&&!z.paused&&((e=z)===null||e===void 0?void 0:e.pause(),z.currentTime=0)}},{key:"reset",value:function e(){var e=this;return r(function(){return p(this,function(t){z&&(e.stop(),z.src="",z.srcObject=null);return[2]})})()}},{key:"setVolume",value:function e(e){var t=e/100;z&&(z.volume=t,K.notify("AUDIO_STATE",E(f({},B),{volume:e})))}},{key:"setPlaybackRate",value:function e(e){z&&(z.playbackRate=e,K.notify("AUDIO_STATE",E(f({},B),{playbackRate:e})))}},{key:"mute",value:function e(){z&&!z.muted&&(z.muted=!0)}},{key:"seek",value:function e(e){z&&(z.currentTime=e)}},{key:"destroy",value:function e(){var e=this;return r(function(){var t;return p(this,function(n){switch(n.label){case 0:t=z;if(!t)return[3,2];return[4,e.reset()];case 1:t=(n.sent(),z.removeAttribute("src"),z.load());n.label=2;case 2:t;return[2]}})})()}},{key:"subscribe",value:function e(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:function(){},n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return K.listen(e,t,n)}},{key:"attachEventListeners",value:function e(e){H(e)}},{key:"id",get:function e(){var e;return(e=z)===null||e===void 0?void 0:e.getAttribute("id")}},{key:"media",set:function e(e){var t;z&&(z.src=(t=e)===null||t===void 0?void 0:t.source)}}],[{key:"getAudioInstance",value:function e(){return z}}]);return e}(),T(W,"AudioX"),O(W,"_instance"),W);export{G as AUDIO_EVENTS,B as AUDIO_STATE,D as AUDIO_X_CONSTANTS,X as AudioX};//# sourceMappingURL=index.js.map