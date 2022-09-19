(()=>{"use strict";function e(e,n){var t;const i=document.createElement("style");i.id=e;const o=e+Math.random().toString(16).slice(2),l=n.offsetHeight;i.innerHTML=`        div#${e} div.card.animate-expand {\n          animation: expand-card-${o} 0.5s ease-out;\n        }\n        div#${e} div.card.animate-shirink {\n          animation: shirink-card-${o} 0.5s ease-out;\n        }\n        @keyframes expand-card-${o}         { 0% { max-height: 0px; } 100% { max-height: ${l+10}px; }}\n        @keyframes shirink-card-${o}        { 0% { max-height: ${l+10}px; } 100% { max-height: 0px; }}\n        `,null===(t=document.querySelector("article.post"))||void 0===t||t.appendChild(i)}function n(e){var n;const t=e.target,i=null===(n=t.parentElement)||void 0===n?void 0:n.nextElementSibling;"none"===i.style.display?(function(e){e.style.overflow="hidden",e.style.display="block",e.classList.add("animate-expand"),e.addEventListener("animationend",(function n(){e.classList.remove("animate-expand"),e.removeEventListener("animationend",n),e.style.overflow="visible"}))}(i),t.innerText="🔼"):(function(e){e.classList.add("animate-shirink"),e.style.overflow="hidden",e.addEventListener("animationend",(function n(){e.classList.remove("animate-shirink"),e.removeEventListener("animationend",n),e.style.display="none"}))}(i),t.innerText="🔽")}function t(e){var n,t;const i=e.target,o=null===(n=i.parentElement)||void 0===n?void 0:n.children.namedItem("content");(()=>{var e,n,t,i;e=this,n=void 0,i=function*(){yield navigator.clipboard.writeText(o.innerText)},new((t=void 0)||(t=Promise))((function(o,l){function r(e){try{a(i.next(e))}catch(e){l(e)}}function c(e){try{a(i.throw(e))}catch(e){l(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(r,c)}a((i=i.apply(e,n||[])).next())}))})();const l=null===(t=i.parentElement)||void 0===t?void 0:t.querySelectorAll(".copy-check:not(.animate)");void 0!==l&&function(e){for(const n of e)n.classList.add("animate"),n.addEventListener("animationend",(()=>{n.classList.remove("animate")}))}(l)}function i(e){return new IntersectionObserver(e,{root:null,rootMargin:"0px",threshold:[.95,.05]})}function o(e,n){const t=window.innerWidth/2,i=window.innerHeight/2;e.forEach((e=>{var n;if(e.isIntersecting){const o=e.target,l=o.getBoundingClientRect(),r=null===(n=o.parentElement)||void 0===n?void 0:n.querySelector("a.link-title"),c=10,a=l.width/e.intersectionRect.width,s=l.height/e.intersectionRect.height;a>1.02&&(l.left>t?o.style.left=`calc(-50% - ${c}px - ${r.innerText.length}ch)`:l.left<t&&(o.style.left=`calc(150% + ${c}px + ${r.innerText.length}ch)`)),s>1.02&&(l.top<i?o.style.top=`calc(150% + ${c}px + 1em + 1px)`:o.style.top=`calc(-100% - ${c}px - 1em - 1px)`)}}))}window.innerWidth;const l=window.innerHeight/2;function r(e,n){e.forEach((e=>{const n=e.target,t=n.parentElement;if(null==t)throw Error("no wrapper!");const i=t.querySelector("a");if(null==i)throw Error("no aTag!");const o=i.getBoundingClientRect();e.isIntersecting&&(o.top>l?n.style.transform=`translate(-50%, calc(-100% - ${i.offsetHeight}px))`:n.style.transform="translate(-50% , 0%)")}))}let c,a,s,d,u=!1;function m(e){c.classList.add("no-animation"),a.classList.add("no-animation"),u=!0;const n=h(e);c.tabIndex=-1,c.style.outline="none",c.focus(),g(n),f(n)}function h(e){return e.preventDefault(),Math.min(e.clientY/window.innerHeight,1)}function v(e){c.classList.remove("no-animation"),a.classList.remove("no-animation"),u=!1,document.activeElement===c&&document.activeElement.blur()}function p(e){if(u){const n=h(e);g(n),f(n)}}function f(e){const n=e*(s.getBoundingClientRect().height-document.documentElement.clientHeight);window.scrollTo(0,n)}function y(e){g(-s.getBoundingClientRect().top/(s.getBoundingClientRect().height-document.documentElement.clientHeight))}function g(e){const n=`calc(100% * ${e} - ${c.style.height} * ${e} + ${c.style.height}/2)`;a.style.height=`clamp(${c.style.height}/2,${n},calc(100% - ${c.style.height}/2))`,c.style.top=`clamp(${c.style.height}/2,${n},calc(100% - ${c.style.height}/2))`}window.addEventListener("load",(()=>{!function(){const i=document.querySelectorAll(".callout");for(const o of i){const i=o.querySelector("button.collapse");if(null===i)continue;const l=o.id,r=o.querySelector(".card");if(null===r||void 0===l)throw new Error(`No card in ${null!=l?l:""} here`);const c=r.querySelector(".copy");e(l,r),r.style.display="🔼"===i.innerText?"block":"none",i.addEventListener("click",n),c.addEventListener("click",t)}}(),function(){var e,n,t;const o=i(r),l=document.querySelectorAll(".wikilink:not(.externallink)");for(let i=0;i<l.length;i++){const r=l[i],c=r.nextElementSibling;if(r.addEventListener("mouseover",(e=>{e.preventDefault(),c.style.display="block"})),window.location===window.parent.location)c.addEventListener("load",(e=>{var n;const t=null===(n=e.target.contentWindow)||void 0===n?void 0:n.document.querySelector("body");o.observe(c);const i=t.querySelector("header"),l=t.querySelector("footer");t.removeChild(i),t.removeChild(l)})),c.src=null!==(e=c.dataset.href)&&void 0!==e?e:"#";else if(null!==c){null===(n=r.parentElement)||void 0===n||n.removeChild(c);const e=document.createElement("span");e.classList.add("blocked-preview"),e.innerHTML='Security alert ❌<br/> <strong>Link in the nested iframe</strong><br/> visit <a href="#">this</a> page!',null===(t=r.parentElement)||void 0===t||t.appendChild(e)}}}(),function(){const e=i(o),n=document.querySelectorAll(".wikilink.externallink");for(let t=0;t<n.length;t++){const i=n[t],o=i.parentElement,l=o.querySelector("span.link-warning-text"),r=o.querySelector("a.link-title");i.addEventListener("click",(e=>{e.preventDefault(),r.focus()})),r.addEventListener("click",(e=>{e.preventDefault()})),r.innerText=i.innerText,r.style.display="inline",null!==l&&(l.style.display="inline",window.location!==window.parent.location&&(l.style.zIndex="10",l.innerHTML='Security alert ❌ <br/><strong>Link in the nested iframe</strong><br/> visit <a href="#" style="border-radius: 4px; background-color: white; padding: 1px 3px;">this</a> page!'),e.observe(l))}}(),c=document.querySelector(".scrollbarButton"),a=document.querySelector(".progressbar"),d=document.querySelector(".scrollWrapper"),s=document.querySelector("body"),function(){const e=window.innerHeight/document.documentElement.getBoundingClientRect().height;if(e>=1)d.style.display="none";else{const n=e*window.innerHeight+"px";c.style.height=n,c.style.top=e*window.innerHeight/2+"px"}}(),document.addEventListener("scroll",y),d.addEventListener("mousedown",m),document.addEventListener("mousemove",p),document.addEventListener("mouseup",v)}))})();