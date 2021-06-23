(self.webpackChunkparty_js_docs=self.webpackChunkparty_js_docs||[]).push([[6701],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return o},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),d=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},o=function(e){var t=d(e.components);return n.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,o=s(e,["components","mdxType","originalType","parentName"]),u=d(r),m=a,h=u["".concat(p,".").concat(m)]||u[m]||c[m]||i;return r?n.createElement(h,l(l({ref:t},o),{},{components:r})):n.createElement(h,l({ref:t},o))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=u;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var d=2;d<i;d++)l[d]=r[d];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},7247:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return o}});var n=r(2122),a=r(9756),i=(r(7294),r(3905)),l={id:"particles_renderer.renderer",title:"Class: Renderer",sidebar_label:"Renderer",custom_edit_url:null},s={unversionedId:"api/classes/particles_renderer.renderer",id:"api/classes/particles_renderer.renderer",isDocsHomePage:!1,title:"Class: Renderer",description:"particles/renderer.Renderer",source:"@site/docs/api/classes/particles_renderer.renderer.md",sourceDirName:"api/classes",slug:"/api/classes/particles_renderer.renderer",permalink:"/docs/api/classes/particles_renderer.renderer",editUrl:null,version:"current",sidebar_label:"Renderer",frontMatter:{id:"particles_renderer.renderer",title:"Class: Renderer",sidebar_label:"Renderer",custom_edit_url:null},sidebar:"api",previous:{title:"Class: Particle",permalink:"/docs/api/classes/particles_particle.particle"},next:{title:"Class: Scene",permalink:"/docs/api/classes/scene.scene-1"}},p=[{value:"Constructors",id:"constructors",children:[{value:"constructor",id:"constructor",children:[]}]},{value:"Properties",id:"properties",children:[{value:"elements",id:"elements",children:[]},{value:"light",id:"light",children:[]}]},{value:"Methods",id:"methods",children:[{value:"begin",id:"begin",children:[]},{value:"end",id:"end",children:[]},{value:"renderParticle",id:"renderparticle",children:[]}]}],d={toc:p};function o(e){var t=e.components,r=(0,a.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/api/modules/particles_renderer"},"particles/renderer"),".Renderer"),(0,i.kt)("p",null,"Represents a renderer used to draw particles to the DOM via HTML\nelements. Additionally, it is responsible for purging the elements\nof destroyed particles from the DOM."),(0,i.kt)("h2",{id:"constructors"},"Constructors"),(0,i.kt)("h3",{id:"constructor"},"constructor"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"new Renderer"),"()"),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"elements"},"elements"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"elements"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"Map"),"<symbol, HTMLElement",">"),(0,i.kt)("p",null,"The lookup of elements currently handled by the renderer, with the\nparticle ID as key and a HTMLElement as the value."),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/renderer.ts#L19"},"particles/renderer.ts:19")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"light"},"light"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"light"),": ",(0,i.kt)("a",{parentName:"p",href:"/docs/api/classes/components_vector.vector"},"Vector")),(0,i.kt)("p",null,"The normalized direction the light comes from."),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/renderer.ts#L23"},"particles/renderer.ts:23")),(0,i.kt)("h2",{id:"methods"},"Methods"),(0,i.kt)("h3",{id:"begin"},"begin"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"begin"),"(): ",(0,i.kt)("inlineCode",{parentName:"p"},"void")),(0,i.kt)("p",null,"Begins a new render block."),(0,i.kt)("h4",{id:"returns"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"void")),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/renderer.ts#L34"},"particles/renderer.ts:34")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"end"},"end"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"end"),"(): ",(0,i.kt)("inlineCode",{parentName:"p"},"number")),(0,i.kt)("p",null,"Terminates an existing render block. This checks which particles were rendered\nduring the block and purges all unused HTMLElements from the DOM."),(0,i.kt)("h4",{id:"returns-1"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"number")),(0,i.kt)("p",null,"The amount of particles that were rendered."),(0,i.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/renderer.ts#L43"},"particles/renderer.ts:43")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"renderparticle"},"renderParticle"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"renderParticle"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"particle"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"emitter"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"void")),(0,i.kt)("p",null,"Renders an individual particle to the DOM. If the particle is rendered for the first\ntime, a HTMLElement will be created using the emitter's render settings."),(0,i.kt)("h4",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"particle")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/docs/api/classes/particles_particle.particle"},"Particle")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The particle to be rendered.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"emitter")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/docs/api/classes/particles_emitter.emitter"},"Emitter")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The system containing the particle.")))),(0,i.kt)("h4",{id:"returns-2"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"void")),(0,i.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/blob/159d2f4/src/particles/renderer.ts#L66"},"particles/renderer.ts:66")))}o.isMDXComponent=!0}}]);