"use strict";(self.webpackChunkparty_js_docs=self.webpackChunkparty_js_docs||[]).push([[7445],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=s(n),d=a,h=m["".concat(p,".").concat(d)]||m[d]||c[d]||o;return n?r.createElement(h,i(i({ref:t},u),{},{components:n})):r.createElement(h,i({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8432:function(e,t,n){n.r(t),n.d(t,{contentTitle:function(){return u},default:function(){return h},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=[{value:"2.2.0 (2022-07-11)",id:"220-2022-07-11",children:[]},{value:"2.1.3 (2022-06-07)",id:"213-2022-06-07",children:[]},{value:"2.1.1 (2021-10-09)",id:"211-2021-10-09",children:[]},{value:"2.1.0 (2021-09-26)",id:"210-2021-09-26",children:[]},{value:"2.0.1 (2021-05-17)",id:"201-2021-05-17",children:[]},{value:"2.0.0 (2021-04-18)",id:"200-2021-04-18",children:[]}],l={toc:i};function p(e){var t=e.components,n=(0,a.Z)(e,["components"]);return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"changelog"},"Changelog"),(0,o.kt)("p",null,"All notable changes to this project will be documented in this file.\nThis project adheres to ",(0,o.kt)("a",{parentName:"p",href:"https://semver.org/spec/v2.0.0.html"},"Semantic Versioning"),"."),(0,o.kt)("p",null,"Note that the changelog only dates back to release of ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/yiliansource/party-js/releases/tag/v2.0.0"},"v2.0.0"),"."),(0,o.kt)("h2",{id:"220-2022-07-11"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/compare/v2.1.3...v2.2.0"},"2.2.0")," (2022-07-11)"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Bug Fix")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Fixed exports in ",(0,o.kt)("inlineCode",{parentName:"li"},"package.json")," that would cause issue with ECMAScript module loaders."),(0,o.kt)("li",{parentName:"ul"},"Moved ",(0,o.kt)("inlineCode",{parentName:"li"},"webpackDevServer")," to ",(0,o.kt)("inlineCode",{parentName:"li"},"optionalDependencies"),".")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"New Feature")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"The sparkles template now supports the ",(0,o.kt)("inlineCode",{parentName:"li"},"shapes")," option, similar to the confetti template.")),(0,o.kt)("h2",{id:"213-2022-06-07"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/compare/v2.1.1...v2.1.3"},"2.1.3")," (2022-06-07)"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Bug Fix")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Removed source maps from the npm package, since they were causing some issues.")),(0,o.kt)("h2",{id:"211-2021-10-09"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/compare/v2.1.0...v2.1.1"},"2.1.1")," (2021-10-09)"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"New Feature")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Exposed the ",(0,o.kt)("inlineCode",{parentName:"li"},"lifetime")," parameter on the ",(0,o.kt)("inlineCode",{parentName:"li"},"sparkles")," template, so you can now control the total range of the stars via ",(0,o.kt)("inlineCode",{parentName:"li"},"lifetime")," and ",(0,o.kt)("inlineCode",{parentName:"li"},"speed")," (",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/72"},"#72"),").")),(0,o.kt)("h2",{id:"210-2021-09-26"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/compare/v2.0.1...v2.1.0"},"2.1.0")," (2021-09-26)"),(0,o.kt)("p",null,"A lot of quality-of-life changes regarding the library and the respective documentation."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"New Feature")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Added support for the ",(0,o.kt)("inlineCode",{parentName:"li"},"respect-reduced-motion")," media query. The library now doesn't activate its effects if said query is detected. This can be disabled via a flag in the settings (",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/74"},"#74"),")."),(0,o.kt)("li",{parentName:"ul"},"Added deployment workflows."),(0,o.kt)("li",{parentName:"ul"},'Added "live codeblocks" to the docs, so you can play around with live examples.')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Bug Fix")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Fixed a bug where the container wouldn't stretch to cover the entire DOM, so particles should no longer be cut off somewhere (",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/70"},"#70"),", ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/71"},"#71"),")."),(0,o.kt)("li",{parentName:"ul"},"Updated some development packages to fix potential security issues.")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Polish")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Revamped the style of the documentation site ","[party.js.org]","."),(0,o.kt)("li",{parentName:"ul"},"Improved the generation of the docs and API (",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/42"},"#42"),")."),(0,o.kt)("li",{parentName:"ul"},"Improved module exporting.")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Removed")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Removed stale-bot from the repository.")),(0,o.kt)("h2",{id:"201-2021-05-17"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/compare/v2.0.0...v2.0.1"},"2.0.1")," (2021-05-17)"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Bug Fix")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Fixed a bug where the dynamic source sampler would confuse ",(0,o.kt)("inlineCode",{parentName:"li"},"Rect"),"s and ",(0,o.kt)("inlineCode",{parentName:"li"},"HTMLElement"),"s (",(0,o.kt)("a",{parentName:"li",href:"https://github.com/yiliansource/party-js/issues/60"},"#60"),").")),(0,o.kt)("h2",{id:"200-2021-04-18"},(0,o.kt)("a",{parentName:"h2",href:"https://github.com/yiliansource/party-js/releases/tag/v2.0.0"},"2.0.0")," (2021-04-18)"),(0,o.kt)("p",null,"The huge rewrite of the entire library. The codebase is now properly structured, typed, tested and documented."))}p.isMDXComponent=!0;var s={title:"Changelog",hide_title:!0,sidebar_label:"Changelog"},u=void 0,c={unversionedId:"changelog",id:"changelog",isDocsHomePage:!1,title:"Changelog",description:"export const toc = ChangelogTOC;",source:"@site/docs/changelog.mdx",sourceDirName:".",slug:"/changelog",permalink:"/docs/changelog",editUrl:"https://github.com/yiliansource/party-js/edit/main/docs/docs/changelog.mdx",tags:[],version:"current",frontMatter:{title:"Changelog",hide_title:!0,sidebar_label:"Changelog"},sidebar:"docs",previous:{title:"Migrating from v1",permalink:"/docs/migrating-v1-v2"},next:{title:"Templates",permalink:"/docs/ref/templates"}},m=i,d={toc:m};function h(e){var t=e.components,n=(0,a.Z)(e,["components"]);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)(p,{mdxType:"Changelog"}))}h.isMDXComponent=!0}}]);