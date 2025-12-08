const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/LoginPage-DbRE5oNT.js","assets/react-vendor-CYaOf62E.js","assets/supabase-Dgb8Dr8T.js","assets/RegisterPage-DdunNESB.js","assets/QuizPage-gerg9sEU.js","assets/questionLoader-DjJgUGhF.js","assets/progressTracker-Ttbwvfu5.js","assets/Badge-DEFM6kQD.js","assets/Modal-B4PKGg3O.js","assets/ProgressRing-Babo_OKD.js","assets/PracticePage-DDLZTUK5.js","assets/MockExamPage-Co1QhE_Y.js","assets/mockTestProgress-BuL2M9rS.js","assets/ExamPage-DJQcDK0x.js","assets/MockTestListPage-C1SFbCj7.js"])))=>i.map(i=>d[i]);
var fe=Object.defineProperty;var he=(e,t,r)=>t in e?fe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var q=(e,t,r)=>he(e,typeof t!="symbol"?t+"":t,r);import{r as ge,b as xe,c as m,R as T,N as ye,L as ve,B as be,d as je,e as j}from"./react-vendor-CYaOf62E.js";import{c as Ee}from"./supabase-Dgb8Dr8T.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();var U={exports:{}},P={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X;function we(){if(X)return P;X=1;var e=ge(),t=Symbol.for("react.element"),r=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,n=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function s(l,d,p){var u,c={},f=null,h=null;p!==void 0&&(f=""+p),d.key!==void 0&&(f=""+d.key),d.ref!==void 0&&(h=d.ref);for(u in d)i.call(d,u)&&!o.hasOwnProperty(u)&&(c[u]=d[u]);if(l&&l.defaultProps)for(u in d=l.defaultProps,d)c[u]===void 0&&(c[u]=d[u]);return{$$typeof:t,type:l,key:f,ref:h,props:c,_owner:n.current}}return P.Fragment=r,P.jsx=s,P.jsxs=s,P}var K;function Se(){return K||(K=1,U.exports=we()),U.exports}var a=Se(),I={},Y;function Ne(){if(Y)return I;Y=1;var e=xe();return I.createRoot=e.createRoot,I.hydrateRoot=e.hydrateRoot,I}var _e=Ne();const Pe="modulepreload",Ce=function(e){return"/sia-test/"+e},Z={},N=function(t,r,i){let n=Promise.resolve();if(r&&r.length>0){let s=function(p){return Promise.all(p.map(u=>Promise.resolve(u).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=s(r.map(p=>{if(p=Ce(p),p in Z)return;Z[p]=!0;const u=p.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${c}`))return;const f=document.createElement("link");if(f.rel=u?"stylesheet":Pe,u||(f.as="script"),f.crossOrigin="",f.href=p,d&&f.setAttribute("nonce",d),document.head.appendChild(f),u)return new Promise((h,_)=>{f.addEventListener("load",h),f.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(s){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=s,window.dispatchEvent(l),!l.defaultPrevented)throw s}return n.then(s=>{for(const l of s||[])l.status==="rejected"&&o(l.reason);return t().catch(o)})};let Oe={data:""},Ie=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Oe},Re=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,ke=/\/\*[^]*?\*\/|  +/g,ee=/\n+/g,w=(e,t)=>{let r="",i="",n="";for(let o in e){let s=e[o];o[0]=="@"?o[1]=="i"?r=o+" "+s+";":i+=o[1]=="f"?w(s,o):o+"{"+w(s,o[1]=="k"?"":t)+"}":typeof s=="object"?i+=w(s,t?t.replace(/([^,])+/g,l=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,l):l?l+" "+d:d)):o):s!=null&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=w.p?w.p(o,s):o+":"+s+";")}return r+(t&&n?t+"{"+n+"}":n)+i},v={},re=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+re(e[r]);return t}return e},Ae=(e,t,r,i,n)=>{let o=re(e),s=v[o]||(v[o]=(d=>{let p=0,u=11;for(;p<d.length;)u=101*u+d.charCodeAt(p++)>>>0;return"go"+u})(o));if(!v[s]){let d=o!==e?e:(p=>{let u,c,f=[{}];for(;u=Re.exec(p.replace(ke,""));)u[4]?f.shift():u[3]?(c=u[3].replace(ee," ").trim(),f.unshift(f[0][c]=f[0][c]||{})):f[0][u[1]]=u[2].replace(ee," ").trim();return f[0]})(e);v[s]=w(n?{["@keyframes "+s]:d}:d,r?"":"."+s)}let l=r&&v.g?v.g:null;return r&&(v.g=v[s]),((d,p,u,c)=>{c?p.data=p.data.replace(c,d):p.data.indexOf(d)===-1&&(p.data=u?d+p.data:p.data+d)})(v[s],t,i,l),s},Me=(e,t,r)=>e.reduce((i,n,o)=>{let s=t[o];if(s&&s.call){let l=s(r),d=l&&l.props&&l.props.className||/^go/.test(l)&&l;s=d?"."+d:l&&typeof l=="object"?l.props?"":w(l,""):l===!1?"":l}return i+n+(s??"")},"");function $(e){let t=this||{},r=e.call?e(t.p):e;return Ae(r.unshift?r.raw?Me(r,[].slice.call(arguments,1),t.p):r.reduce((i,n)=>Object.assign(i,n&&n.call?n(t.p):n),{}):r,Ie(t.target),t.g,t.o,t.k)}let se,W,F;$.bind({g:1});let b=$.bind({k:1});function Te(e,t,r,i){w.p=t,se=e,W=r,F=i}function S(e,t){let r=this||{};return function(){let i=arguments;function n(o,s){let l=Object.assign({},o),d=l.className||n.className;r.p=Object.assign({theme:W&&W()},l),r.o=/ *go\d+/.test(d),l.className=$.apply(r,i)+(d?" "+d:"");let p=e;return e[0]&&(p=l.as||e,delete l.as),F&&p[0]&&F(l),se(p,l)}return n}}var $e=e=>typeof e=="function",M=(e,t)=>$e(e)?e(t):e,Le=(()=>{let e=0;return()=>(++e).toString()})(),ae=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),De=20,V="default",oe=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===t.toast.id?{...s,...t.toast}:s)};case 2:let{toast:i}=t;return oe(e,{type:e.toasts.find(s=>s.id===i.id)?1:0,toast:i});case 3:let{toastId:n}=t;return{...e,toasts:e.toasts.map(s=>s.id===n||n===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+o}))}}},A=[],ie={toasts:[],pausedAt:void 0,settings:{toastLimit:De}},y={},ne=(e,t=V)=>{y[t]=oe(y[t]||ie,e),A.forEach(([r,i])=>{r===t&&i(y[t])})},le=e=>Object.keys(y).forEach(t=>ne(e,t)),ze=e=>Object.keys(y).find(t=>y[t].toasts.some(r=>r.id===e)),L=(e=V)=>t=>{ne(t,e)},qe={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ue=(e={},t=V)=>{let[r,i]=m.useState(y[t]||ie),n=m.useRef(y[t]);m.useEffect(()=>(n.current!==y[t]&&i(y[t]),A.push([t,i]),()=>{let s=A.findIndex(([l])=>l===t);s>-1&&A.splice(s,1)}),[t]);let o=r.toasts.map(s=>{var l,d,p;return{...e,...e[s.type],...s,removeDelay:s.removeDelay||((l=e[s.type])==null?void 0:l.removeDelay)||(e==null?void 0:e.removeDelay),duration:s.duration||((d=e[s.type])==null?void 0:d.duration)||(e==null?void 0:e.duration)||qe[s.type],style:{...e.style,...(p=e[s.type])==null?void 0:p.style,...s.style}}});return{...r,toasts:o}},We=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Le()}),O=e=>(t,r)=>{let i=We(t,e,r);return L(i.toasterId||ze(i.id))({type:2,toast:i}),i.id},g=(e,t)=>O("blank")(e,t);g.error=O("error");g.success=O("success");g.loading=O("loading");g.custom=O("custom");g.dismiss=(e,t)=>{let r={type:3,toastId:e};t?L(t)(r):le(r)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let r={type:4,toastId:e};t?L(t)(r):le(r)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,r)=>{let i=g.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let o=t.success?M(t.success,n):void 0;return o?g.success(o,{id:i,...r,...r==null?void 0:r.success}):g.dismiss(i),n}).catch(n=>{let o=t.error?M(t.error,n):void 0;o?g.error(o,{id:i,...r,...r==null?void 0:r.error}):g.dismiss(i)}),e};var Fe=1e3,Ge=(e,t="default")=>{let{toasts:r,pausedAt:i}=Ue(e,t),n=m.useRef(new Map).current,o=m.useCallback((c,f=Fe)=>{if(n.has(c))return;let h=setTimeout(()=>{n.delete(c),s({type:4,toastId:c})},f);n.set(c,h)},[]);m.useEffect(()=>{if(i)return;let c=Date.now(),f=r.map(h=>{if(h.duration===1/0)return;let _=(h.duration||0)+h.pauseDuration-(c-h.createdAt);if(_<0){h.visible&&g.dismiss(h.id);return}return setTimeout(()=>g.dismiss(h.id,t),_)});return()=>{f.forEach(h=>h&&clearTimeout(h))}},[r,i,t]);let s=m.useCallback(L(t),[t]),l=m.useCallback(()=>{s({type:5,time:Date.now()})},[s]),d=m.useCallback((c,f)=>{s({type:1,toast:{id:c,height:f}})},[s]),p=m.useCallback(()=>{i&&s({type:6,time:Date.now()})},[i,s]),u=m.useCallback((c,f)=>{let{reverseOrder:h=!1,gutter:_=8,defaultPosition:Q}=f||{},D=r.filter(x=>(x.position||Q)===(c.position||Q)&&x.height),pe=D.findIndex(x=>x.id===c.id),J=D.filter((x,z)=>z<pe&&x.visible).length;return D.filter(x=>x.visible).slice(...h?[J+1]:[0,J]).reduce((x,z)=>x+(z.height||0)+_,0)},[r]);return m.useEffect(()=>{r.forEach(c=>{if(c.dismissed)o(c.id,c.removeDelay);else{let f=n.get(c.id);f&&(clearTimeout(f),n.delete(c.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:u}}},Ve=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Be=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,He=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Qe=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ve} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Be} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${He} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Je=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Xe=S("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Je} 1s linear infinite;
`,Ke=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ye=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ze=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ke} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ye} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,et=S("div")`
  position: absolute;
`,tt=S("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,rt=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,st=S("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${rt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,at=({toast:e})=>{let{icon:t,type:r,iconTheme:i}=e;return t!==void 0?typeof t=="string"?m.createElement(st,null,t):t:r==="blank"?null:m.createElement(tt,null,m.createElement(Xe,{...i}),r!=="loading"&&m.createElement(et,null,r==="error"?m.createElement(Qe,{...i}):m.createElement(Ze,{...i})))},ot=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,it=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,nt="0%{opacity:0;} 100%{opacity:1;}",lt="0%{opacity:1;} 100%{opacity:0;}",ct=S("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,dt=S("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ut=(e,t)=>{let r=e.includes("top")?1:-1,[i,n]=ae()?[nt,lt]:[ot(r),it(r)];return{animation:t?`${b(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},mt=m.memo(({toast:e,position:t,style:r,children:i})=>{let n=e.height?ut(e.position||t||"top-center",e.visible):{opacity:0},o=m.createElement(at,{toast:e}),s=m.createElement(dt,{...e.ariaProps},M(e.message,e));return m.createElement(ct,{className:e.className,style:{...n,...r,...e.style}},typeof i=="function"?i({icon:o,message:s}):m.createElement(m.Fragment,null,o,s))});Te(m.createElement);var pt=({id:e,className:t,style:r,onHeightUpdate:i,children:n})=>{let o=m.useCallback(s=>{if(s){let l=()=>{let d=s.getBoundingClientRect().height;i(e,d)};l(),new MutationObserver(l).observe(s,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return m.createElement("div",{ref:o,className:t,style:r},n)},ft=(e,t)=>{let r=e.includes("top"),i=r?{top:0}:{bottom:0},n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:ae()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...i,...n}},ht=$`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,gt=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:i,children:n,toasterId:o,containerStyle:s,containerClassName:l})=>{let{toasts:d,handlers:p}=Ge(r,o);return m.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...s},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(u=>{let c=u.position||t,f=p.calculateOffset(u,{reverseOrder:e,gutter:i,defaultPosition:t}),h=ft(c,f);return m.createElement(pt,{id:u.id,key:u.id,onHeightUpdate:p.updateHeight,className:u.visible?ht:"",style:h},u.type==="custom"?M(u.message,u):n?n(u):m.createElement(mt,{toast:u,position:c}))}))};const te={"door-supervisor":{slug:"door-supervisor",code:"DS",name:"Door Supervisor",description:"Level 2 Award for Door Supervisors in the Private Security Industry",totalMcqQuestions:60,totalUnits:4,totalTimeMinutes:90,examPapers:[{examNumber:1,examName:"Working in Private Security & Conflict Management",unitsCovered:[1,3],questions:40,timeMinutes:60,passingScore:70},{examNumber:2,examName:"Working as a Door Supervisor",unitsCovered:[2],questions:20,timeMinutes:30,passingScore:70}]},"security-guard":{slug:"security-guard",code:"SG",name:"Security Guard",description:"Level 2 Award for Security Officers (Guarding) in the Private Security Industry",totalMcqQuestions:40,totalUnits:3,totalTimeMinutes:60,examPapers:[{examNumber:1,examName:"Working in Private Security & Conflict Management",unitsCovered:[1,3],questions:20,timeMinutes:30,passingScore:70},{examNumber:2,examName:"Working as a Security Officer",unitsCovered:[2],questions:20,timeMinutes:30,passingScore:70}]},"cctv-operator":{slug:"cctv-operator",code:"CCTV",name:"CCTV Operator",description:"Level 2 Award for Working as a CCTV Operator (Public Space Surveillance)",totalMcqQuestions:40,totalUnits:2,totalTimeMinutes:60,examPapers:[{examNumber:1,examName:"Working in the Private Security Industry",unitsCovered:[1],questions:20,timeMinutes:30,passingScore:70},{examNumber:2,examName:"Working as a CCTV Operator",unitsCovered:[2],questions:20,timeMinutes:30,passingScore:70}]},"close-protection":{slug:"close-protection",code:"CP",name:"Close Protection",description:"Level 3 Certificate for Working as a Close Protection Operative",totalMcqQuestions:132,totalUnits:7,totalTimeMinutes:200,examPapers:[{examNumber:1,examName:"Principles of Working as a CPO",unitsCovered:[1],questions:52,timeMinutes:80,passingScore:70},{examNumber:2,examName:"Working as a CPO",unitsCovered:[2],questions:30,timeMinutes:45,passingScore:70},{examNumber:3,examName:"Conflict Management for CP",unitsCovered:[3],questions:20,timeMinutes:30,passingScore:70},{examNumber:4,examName:"Physical Intervention Skills",unitsCovered:[7],questions:30,timeMinutes:45,passingScore:80}]}},Mt={QUIZ_STATE:"sia_quiz_state"},E={HOME:"/",LOGIN:"/login",REGISTER:"/register",QUIZ:"/quiz",EXAM:"/exam/:examSlug",EXAM_PRACTICE:"/exam/:examSlug/practice",EXAM_MOCK:"/exam/:examSlug/mock",EXAM_MOCK_TEST:"/exam/:examSlug/mock/:testNumber"},ce="https://mjpozzyxwlylgxyevzwi.supabase.co/",de="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcG96enl4d2x5bGd4eWV2endpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMTA4NzMsImV4cCI6MjA4MDY4Njg3M30.SopUlVvFWfc1EEMDTgGdpjIM8K5WSeoG5F-r_2oSHng",k=Ee(ce,de,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}),xt=()=>!ce.includes("placeholder")&&!de.includes("placeholder"),ue=m.createContext(void 0);function yt({children:e}){const[t,r]=m.useState(null),[i,n]=m.useState(null),[o,s]=m.useState(!0),l=xt();m.useEffect(()=>{if(!l){s(!1);return}k.auth.getSession().then(({data:{session:f}})=>{n(f),r((f==null?void 0:f.user)??null),s(!1)});const{data:{subscription:c}}=k.auth.onAuthStateChange((f,h)=>{n(h),r((h==null?void 0:h.user)??null),s(!1)});return()=>c.unsubscribe()},[l]);const u={user:t,session:i,loading:o,signInWithGoogle:async()=>{if(!l)throw new Error("Supabase is not configured. Please set up your environment variables.");const{error:c}=await k.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/sia-test/`}});if(c)throw console.error("Error signing in with Google:",c),c},signOut:async()=>{if(!l)return;const{error:c}=await k.auth.signOut();if(c)throw console.error("Error signing out:",c),c},isConfigured:l};return a.jsx(ue.Provider,{value:u,children:e})}function vt(){const e=m.useContext(ue);if(e===void 0)throw new Error("useAuth must be used within an AuthProvider");return e}const B=T.memo(({size:e="md",color:t="white",className:r=""})=>{const i={sm:"h-4 w-4",md:"h-6 w-6",lg:"h-8 w-8"},n={primary:"border-primary",secondary:"border-secondary",accent:"border-accent",white:"border-white"};return a.jsx("div",{className:`animate-spin rounded-full border-2 border-t-transparent ${i[e]} ${n[t]} ${r}`,role:"status","aria-label":"Loading",children:a.jsx("span",{className:"sr-only",children:"Loading..."})})});B.displayName="Spinner";function C({children:e}){const{user:t,loading:r,isConfigured:i}=vt();return r?a.jsx("div",{className:"flex min-h-screen items-center justify-center bg-background",children:a.jsxs("div",{className:"text-center",children:[a.jsx(B,{size:"lg"}),a.jsx("p",{className:"mt-4 text-gray-600",children:"Loading..."})]})}):i?t?a.jsx(a.Fragment,{children:e}):a.jsx(ye,{to:"/login",replace:!0}):a.jsx(a.Fragment,{children:e})}const G=T.memo(({children:e,variant:t="primary",size:r="md",loading:i=!1,leftIcon:n,rightIcon:o,fullWidth:s=!1,disabled:l,className:d="",...p})=>{const u="inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",c={primary:"bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700",secondary:"bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 active:bg-secondary-700",danger:"bg-error text-white hover:bg-error-600 focus:ring-error-500 active:bg-error-700",ghost:"bg-transparent text-primary hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100",success:"bg-accent text-white hover:bg-accent-600 focus:ring-accent-500 active:bg-accent-700"},f={sm:"px-3 py-1.5 text-sm gap-1.5",md:"px-4 py-2 text-base gap-2",lg:"px-6 py-3 text-lg gap-2.5"},h=s?"w-full":"";return a.jsxs("button",{className:`${u} ${c[t]} ${f[r]} ${h} ${d}`,disabled:l||i,...p,children:[i&&a.jsx(B,{size:r==="sm"?"sm":"md"}),!i&&n&&a.jsx("span",{className:"flex-shrink-0",children:n}),a.jsx("span",{children:e}),!i&&o&&a.jsx("span",{className:"flex-shrink-0",children:o})]})});G.displayName="Button";const H=T.memo(({children:e,variant:t="default",padding:r="md",hoverable:i=!1,className:n="",onClick:o})=>{const s="bg-white rounded-lg border border-gray-200 transition-all duration-200",l={default:"shadow-card",elevated:"shadow-elevated"},d={none:"",sm:"p-3",md:"p-4",lg:"p-6"},p=i?"cursor-pointer hover:shadow-elevated hover:-translate-y-0.5":"",u=o?"cursor-pointer":"";return a.jsx("div",{className:`${s} ${l[t]} ${d[r]} ${p} ${u} ${n}`,onClick:o,role:o?"button":void 0,tabIndex:o?0:void 0,onKeyDown:o?c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),o())}:void 0,children:e})});H.displayName="Card";class bt extends T.Component{constructor(r){super(r);q(this,"handleRetry",()=>{this.setState({hasError:!1,error:null,errorInfo:null})});q(this,"handleGoHome",()=>{window.location.href="/sia-test/"});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(r){return{hasError:!0,error:r}}componentDidCatch(r,i){console.error("ErrorBoundary caught an error:",r),console.error("Error info:",i),this.setState({errorInfo:i})}render(){return this.state.hasError?this.props.fallback?this.props.fallback:a.jsx("div",{className:"min-h-screen flex items-center justify-center bg-gray-50 p-4",children:a.jsxs(H,{padding:"lg",className:"max-w-lg text-center",children:[a.jsx("div",{className:"text-6xl mb-4",children:"😵"}),a.jsx("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Something went wrong"}),a.jsx("p",{className:"text-gray-600 mb-6",children:"An unexpected error occurred. We apologize for the inconvenience."}),!1,a.jsxs("div",{className:"flex gap-3 justify-center",children:[a.jsx(G,{variant:"secondary",onClick:this.handleRetry,children:"Try Again"}),a.jsx(G,{variant:"primary",onClick:this.handleGoHome,children:"Go to Home"})]})]})}):this.props.children}}function jt(){return a.jsxs("div",{className:"flex min-h-screen flex-col bg-gray-50",children:[a.jsx("header",{className:"border-b bg-white",children:a.jsx("div",{className:"container mx-auto px-4 py-6",children:a.jsxs("div",{className:"flex items-center gap-3",children:[a.jsx("span",{className:"text-3xl",children:"🎓"}),a.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"SIA Exam Prep"})]})})}),a.jsx("main",{className:"flex-1 py-12",children:a.jsxs("div",{className:"container mx-auto px-4",children:[a.jsxs("div",{className:"mb-12 text-center",children:[a.jsx("h2",{className:"mb-3 text-4xl font-bold text-gray-900",children:"Choose Your SIA Qualification"}),a.jsx("p",{className:"text-lg text-gray-600",children:"Select an exam to view details and start practicing"})]}),a.jsx("div",{className:"mx-auto grid max-w-5xl gap-6 md:grid-cols-2",children:Object.keys(te).map(e=>{const t=te[e];return a.jsx(ve,{to:`/exam/${e}`,className:"block transition-transform hover:scale-105",children:a.jsx(H,{hoverable:!0,className:"h-full",children:a.jsxs("div",{className:"p-6",children:[a.jsx("h3",{className:"mb-3 text-2xl font-bold text-gray-900",children:t.name}),a.jsx("p",{className:"mb-4 text-gray-600",children:t.description}),a.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[a.jsxs("span",{className:"font-medium",children:[t.totalMcqQuestions," questions"]}),a.jsx("span",{children:"•"}),a.jsxs("span",{children:[t.totalTimeMinutes," minutes"]}),a.jsx("span",{children:"•"}),a.jsx("span",{children:"70% to pass"})]})]})})},e)})})]})}),a.jsx("footer",{className:"border-t bg-white py-8",children:a.jsxs("div",{className:"container mx-auto px-4 text-center text-sm text-gray-600",children:["© ",new Date().getFullYear()," SIA Exam Prep. All rights reserved."]})})]})}const Et=m.lazy(()=>N(()=>import("./LoginPage-DbRE5oNT.js"),__vite__mapDeps([0,1,2])).then(e=>({default:e.LoginPage}))),wt=m.lazy(()=>N(()=>import("./RegisterPage-DdunNESB.js"),__vite__mapDeps([3,1,2])).then(e=>({default:e.RegisterPage}))),St=m.lazy(()=>N(()=>import("./QuizPage-gerg9sEU.js"),__vite__mapDeps([4,1,5,6,7,8,9,2])).then(e=>({default:e.QuizPage}))),Nt=m.lazy(()=>N(()=>import("./PracticePage-DDLZTUK5.js"),__vite__mapDeps([10,1,5,7,9,8,2])).then(e=>({default:e.PracticePage}))),_t=m.lazy(()=>N(()=>import("./MockExamPage-Co1QhE_Y.js"),__vite__mapDeps([11,1,6,5,7,8,12,2])).then(e=>({default:e.MockExamPage}))),Pt=m.lazy(()=>N(()=>import("./ExamPage-DJQcDK0x.js"),__vite__mapDeps([13,1,7,2])).then(e=>({default:e.ExamPage}))),Ct=m.lazy(()=>N(()=>import("./MockTestListPage-C1SFbCj7.js"),__vite__mapDeps([14,1,8,12,2])).then(e=>({default:e.MockTestListPage})));function Ot(){return a.jsx("div",{className:"flex min-h-screen items-center justify-center bg-background",children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"}),a.jsx("p",{className:"text-gray-600",children:"Loading..."})]})})}function It(){return a.jsx(be,{basename:"/sia-test",children:a.jsx(yt,{children:a.jsxs(bt,{children:[a.jsx(m.Suspense,{fallback:a.jsx(Ot,{}),children:a.jsxs(je,{children:[a.jsx(j,{path:E.HOME,element:a.jsx(jt,{})}),a.jsx(j,{path:E.LOGIN,element:a.jsx(Et,{})}),a.jsx(j,{path:E.REGISTER,element:a.jsx(wt,{})}),a.jsx(j,{path:E.EXAM,element:a.jsx(C,{children:a.jsx(Pt,{})})}),a.jsx(j,{path:E.EXAM_PRACTICE,element:a.jsx(C,{children:a.jsx(Nt,{})})}),a.jsx(j,{path:E.EXAM_MOCK,element:a.jsx(C,{children:a.jsx(Ct,{})})}),a.jsx(j,{path:E.EXAM_MOCK_TEST,element:a.jsx(C,{children:a.jsx(_t,{})})}),a.jsx(j,{path:E.QUIZ,element:a.jsx(C,{children:a.jsx(St,{})})})]})}),a.jsx(gt,{position:"top-right"})]})})})}const me=document.getElementById("root");if(!me)throw new Error("Root element not found");_e.createRoot(me).render(a.jsx(m.StrictMode,{children:a.jsx(It,{})}));export{G as B,H as C,te as E,E as R,B as S,Mt as a,a as j,k as s,vt as u};
//# sourceMappingURL=index-DKDRh3Ci.js.map
