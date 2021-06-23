(self.webpackChunkparty_js_docs=self.webpackChunkparty_js_docs||[]).push([[8656],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return l},kt:function(){return d}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var a=n.createContext({}),c=function(e){var t=n.useContext(a),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(a.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),m=c(r),d=i,f=m["".concat(a,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(f,s(s({ref:t},l),{},{components:r})):n.createElement(f,s({ref:t},l))}));function d(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,s=new Array(o);s[0]=m;var p={};for(var a in t)hasOwnProperty.call(t,a)&&(p[a]=t[a]);p.originalType=e,p.mdxType="string"==typeof e?e:i,s[1]=p;for(var c=2;c<o;c++)s[c]=r[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},9718:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return s},metadata:function(){return p},toc:function(){return a},default:function(){return l}});var n=r(2122),i=r(9756),o=(r(7294),r(3905)),s={id:"particles_emitter.emitterconstructionoptions",title:"Interface: EmitterConstructionOptions",sidebar_label:"EmitterConstructionOptions",custom_edit_url:null},p={unversionedId:"api/interfaces/particles_emitter.emitterconstructionoptions",id:"api/interfaces/particles_emitter.emitterconstructionoptions",isDocsHomePage:!1,title:"Interface: EmitterConstructionOptions",description:"particles/emitter.EmitterConstructionOptions",source:"@site/docs/api/interfaces/particles_emitter.emitterconstructionoptions.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/particles_emitter.emitterconstructionoptions",permalink:"/docs/api/interfaces/particles_emitter.emitterconstructionoptions",editUrl:null,version:"current",sidebar_label:"EmitterConstructionOptions",frontMatter:{id:"particles_emitter.emitterconstructionoptions",title:"Interface: EmitterConstructionOptions",sidebar_label:"EmitterConstructionOptions",custom_edit_url:null},sidebar:"api",previous:{title:"Interface: SplineKey<T>",permalink:"/docs/api/interfaces/components_spline.splinekey"},next:{title:"Interface: Burst",permalink:"/docs/api/interfaces/particles_options_emissionoptions.burst"}},a=[{value:"Properties",id:"properties",children:[{value:"emissionOptions",id:"emissionoptions",children:[]},{value:"emitterOptions",id:"emitteroptions",children:[]},{value:"rendererOptions",id:"rendereroptions",children:[]}]}],c={toc:a};function l(e){var t=e.components,r=(0,i.Z)(e,["components"]);return(0,o.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/api/modules/particles_emitter"},"particles/emitter"),".EmitterConstructionOptions"),(0,o.kt)("p",null,"Defines the set of options that can be used when creating a new emitter."),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("h3",{id:"emissionoptions"},"emissionOptions"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"emissionOptions"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"Partial"),"<",(0,o.kt)("a",{parentName:"p",href:"/docs/api/interfaces/particles_options_emissionoptions.emissionoptions"},"EmissionOptions"),">"),(0,o.kt)("h4",{id:"defined-in"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/emitter.ts#L20"},"particles/emitter.ts:20")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"emitteroptions"},"emitterOptions"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"emitterOptions"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"Partial"),"<",(0,o.kt)("a",{parentName:"p",href:"/docs/api/interfaces/particles_options_emitteroptions.emitteroptions"},"EmitterOptions"),">"),(0,o.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/emitter.ts#L19"},"particles/emitter.ts:19")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"rendereroptions"},"rendererOptions"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"rendererOptions"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"Partial"),"<",(0,o.kt)("a",{parentName:"p",href:"/docs/api/interfaces/particles_options_renderoptions.renderoptions"},"RenderOptions"),">"),(0,o.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/emitter.ts#L21"},"particles/emitter.ts:21")))}l.isMDXComponent=!0}}]);