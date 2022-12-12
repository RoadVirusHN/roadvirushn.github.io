(()=>{"use strict";function e(e,n){const t=document.createElement("style");t.id=e;const i=e+Math.random().toString(16).slice(2),r=n.offsetHeight;t.innerHTML=`        div#${e} div.card.animate-expand {\n          animation: expand-card-${i} 0.5s ease-out;\n        }\n        div#${e} div.card.animate-shirink {\n          animation: shirink-card-${i} 0.5s ease-out;\n        }\n        @keyframes expand-card-${i}         { 0% { max-height: 0px; } 100% { max-height: ${r+10}px; }}\n        @keyframes shirink-card-${i}        { 0% { max-height: ${r+10}px; } 100% { max-height: 0px; }}\n        `,document.querySelector("article.article")?.appendChild(t)}function n(e){const n=e.target,t=n.parentElement?.nextElementSibling;"none"===t.style.display?(function(e){e.style.overflow="hidden",e.style.display="block",e.classList.add("animate-expand"),e.addEventListener("animationend",(function n(){e.classList.remove("animate-expand"),e.removeEventListener("animationend",n),e.style.overflow="visible"}))}(t),n.innerText="🔼"):(function(e){e.classList.add("animate-shirink"),e.style.overflow="hidden",e.addEventListener("animationend",(function n(){e.classList.remove("animate-shirink"),e.removeEventListener("animationend",n),e.style.display="none"}))}(t),n.innerText="🔽")}function t(e){const n=e.target,t=n.parentElement?.children.namedItem("content");(async()=>{await navigator.clipboard.writeText(t.innerText)})();const i=n.parentElement?.querySelectorAll(".copy-check:not(.animate)");void 0!==i&&function(e){for(const n of e)n.classList.add("animate"),n.addEventListener("animationend",(()=>{n.classList.remove("animate")}))}(i)}function i(e){return new IntersectionObserver(e,{root:null,rootMargin:"0px",threshold:[.95,.05]})}function r(e,n){const t=window.innerWidth/2,i=window.innerHeight/2;e.forEach((e=>{if(e.isIntersecting){const n=e.target,r=n.getBoundingClientRect(),o=n.parentElement?.querySelector("a.link-title"),a=10,l=r.width/e.intersectionRect.width,c=r.height/e.intersectionRect.height;l>1.02&&(r.left>t?n.style.left=`calc(-50% - ${a}px - ${o.innerText.length}ch)`:r.left<t&&(n.style.left=`calc(150% + ${a}px + ${o.innerText.length}ch)`)),c>1.02&&(r.top<i?n.style.top=`calc(150% + ${a}px + 1em + 1px)`:n.style.top=`calc(-100% - ${a}px - 1em - 1px)`)}}))}window.innerWidth;const o=window.innerHeight/2;function a(e,n){e.forEach((e=>{const n=e.target,t=n.parentElement;if(null==t)throw Error("no wrapper!");const i=t.querySelector("a");if(null==i)throw Error("no aTag!");const r=i.getBoundingClientRect();e.isIntersecting&&(r.top>o?n.style.transform=`translate(-50%, calc(-100% - ${i.offsetHeight}px))`:n.style.transform="translate(-50% , 0%)")}))}window.addEventListener("load",(()=>{!function(){const i=document.querySelectorAll(".callout");for(const r of i){const i=r.querySelector("button.collapse");if(null===i)continue;const o=r.id,a=r.querySelector(".card");if(null===a||void 0===o)throw new Error(`No card in ${o??""} here`);const l=a.querySelector(".copy");e(o,a),a.style.display="🔼"===i.innerText?"block":"none",i.addEventListener("click",n),null!==l&&l.addEventListener("click",t)}}(),function(){const e=i(a),n=document.querySelectorAll(".wikilink:not(.externallink)");for(let t=0;t<n.length;t++){const i=n[t],r=i.nextElementSibling;if(i.addEventListener("mouseover",(e=>{e.preventDefault(),r.style.display="block"})),window.location===window.parent.location)r.addEventListener("load",(n=>{const t=n.target.contentWindow?.document.querySelector("body");e.observe(r);const i=t.querySelector("header"),o=t.querySelector("footer");t.removeChild(i),t.removeChild(o);const a=t.querySelector("#drawer"),l=t.querySelector("button.drawer-button.open");t.querySelector("main").removeChild(a),t.querySelector("main").removeChild(l)})),r.src=r.dataset.href??"#";else if(null!==r){i.parentElement?.removeChild(r);const e=document.createElement("span");e.classList.add("blocked-preview"),e.innerHTML='Security alert ❌<br/> <strong>Link in the nested iframe</strong><br/> visit <a href="#">this</a> page!',i.parentElement?.appendChild(e)}}}(),function(){const e=i(r),n=document.querySelectorAll(".wikilink.externallink");for(let t=0;t<n.length;t++){const i=n[t],r=i.parentElement,o=r.querySelector("span.link-warning-text"),a=r.querySelector("a.link-title");i.addEventListener("click",(e=>{e.preventDefault(),a.focus()})),a.addEventListener("click",(e=>{e.preventDefault()})),a.innerText=i.innerText,a.style.display="inline",null!==o&&(o.style.display="inline",window.location!==window.parent.location&&(o.style.zIndex="10",o.innerHTML='Security alert ❌ <br/><strong>Link in the nested iframe</strong><br/> visit <a href="#" style="border-radius: 4px; background-color: white; padding: 1px 3px;">this</a> page!'),e.observe(o))}}()}))})();