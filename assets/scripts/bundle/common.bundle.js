(()=>{"use strict";function o(){const o=sessionStorage.getItem("drawer_status");let e;return e=null==o?{}:JSON.parse(o),e}let e,r,n,t,c=!1;function l(o){return o.preventDefault(),Math.min(o.clientY/window.innerHeight,1)}function s(o){const e=o*(n.getBoundingClientRect().height-document.documentElement.clientHeight);window.scrollTo(0,e)}function i(o){const n=`calc(100% * ${o} - ${e.style.height} * ${o} + ${e.style.height}/2)`;r.style.height=`clamp(${e.style.height}/2,${n},calc(100% - ${e.style.height}/2))`,e.style.top=`clamp(${e.style.height}/2,${n},calc(100% - ${e.style.height}/2))`}const a=JSON.parse('{"DB":{"background-color":"rgb(238, 137, 137)","color":"rgb(17, 118, 68)"},"CS":{"background-color":"rgb(42, 217, 217)","color":"rgb(213, 38, 181)"},"CSS":{"background-color":"rgb(29, 218, 218)","color":"rgb(226, 37, 223)"},"FE":{"background-color":"rgb(48, 156, 156)","color":"rgb(207, 99, 119)"},"CRUDE":{"background-color":"rgb(133, 27, 27)","color":"rgb(122, 228, 163)"},"HTML":{"background-color":"rgb(203, 48, 48)","color":"rgb(52, 207, 144)"},"DJANGO":{"background-color":"rgb(146, 8, 8)","color":"rgb(109, 247, 77)"},"PYTHON":{"background-color":"rgb(204, 100, 100)","color":"rgb(51, 155, 70)"},"BE":{"background-color":"rgb(103, 95, 95)","color":"rgb(152, 160, 208)"},"NODE":{"background-color":"rgb(138, 46, 46)","color":"rgb(117, 209, 195)"},"TOOL":{"background-color":"rgb(137, 133, 133)","color":"rgb(118, 122, 67)"},"알고리즘":{"background-color":"rgb(80, 233, 233)","color":"rgb(175, 22, 192)"},"요약":{"background-color":"rgb(11, 114, 114)","color":"rgb(244, 141, 114)"},"AWS":{"background-color":"rgb(212, 116, 116)","color":"rgb(43, 139, 75)"},"CLOUD":{"background-color":"rgb(98, 211, 211)","color":"rgb(157, 44, 159)"},"DOCKER":{"background-color":"rgb(237, 231, 231)","color":"rgb(18, 24, 156)"},"CICD":{"background-color":"rgb(92, 181, 181)","color":"rgb(163, 74, 89)"},"MATH":{"background-color":"rgb(186, 157, 157)","color":"rgb(69, 98, 77)"},"EXPRESSJS":{"background-color":"rgb(32, 169, 169)","color":"rgb(223, 86, 178)"},"JS":{"background-color":"rgb(44, 139, 139)","color":"rgb(211, 116, 241)"},"GIT":{"background-color":"rgb(110, 95, 95)","color":"rgb(145, 160, 182)"},"FLASK":{"background-color":"rgb(136, 70, 70)","color":"rgb(119, 185, 255)"},"GRAPHQL":{"background-color":"rgb(60, 222, 222)","color":"rgb(195, 33, 158)"},"ENG":{"background-color":"rgb(66, 222, 222)","color":"rgb(189, 33, 53)"},"OS":{"background-color":"rgb(223, 33, 33)","color":"rgb(32, 222, 97)"},"컴퓨터_구조":{"background-color":"rgb(203, 100, 100)","color":"rgb(52, 155, 200)"},"HIDE":{"background-color":"rgb(73, 230, 230)","color":"rgb(182, 25, 205)"},"NETWORK":{"background-color":"rgb(142, 6, 6)","color":"rgb(113, 249, 66)"},"BLOG_TEST":{"background-color":"rgb(0, 116, 116)","color":"rgb(255, 139, 59)"},"JENKINS":{"background-color":"rgb(93, 103, 103)","color":"rgb(162, 152, 47)"},"LINUX":{"background-color":"rgb(210, 94, 94)","color":"rgb(45, 161, 142)"},"AI":{"background-color":"rgb(103, 94, 94)","color":"rgb(152, 161, 213)"},"CV":{"background-color":"rgb(73, 80, 80)","color":"rgb(182, 175, 176)"},"DL":{"background-color":"rgb(220, 94, 94)","color":"rgb(35, 161, 85)"},"DATA_VIS":{"background-color":"rgb(58, 169, 169)","color":"rgb(197, 86, 253)"},"DATA":{"background-color":"rgb(218, 60, 60)","color":"rgb(37, 195, 75)"},"GRAPH":{"background-color":"rgb(140, 248, 248)","color":"rgb(115, 7, 212)"},"모델_경량화":{"background-color":"rgb(180, 195, 195)","color":"rgb(75, 60, 252)"},"NLP":{"background-color":"rgb(192, 39, 39)","color":"rgb(63, 216, 51)"},"MRC":{"background-color":"rgb(235, 240, 240)","color":"rgb(20, 15, 171)"},"정형데이터":{"background-color":"rgb(223, 204, 204)","color":"rgb(32, 51, 197)"}}');let d=[];function g(o){return(e,r)=>{const n=document.createElement("a"),t=r.toUpperCase();return n.innerText=t+" x",n.classList.add("tag-link"),n.classList.add("for-search"),void 0!==a[t]?(n.style.color=a[t].color,n.style.backgroundColor=a[t]["background-color"],d.push(t)):n.innerText="❓UNREGISTERED TAG x",n.addEventListener("click",(o=>{o.preventDefault(),function(o){const e=o.target,r=d.findIndex((o=>o===e.innerText.slice(0,-2)));d.splice(r,1),e.remove()}(o)})),o.appendChild(n),""}}e=document.querySelector(".scrollbarButton"),r=document.querySelector(".progressbar"),t=document.querySelector(".scrollWrapper"),n=document.querySelector("body"),function(){const o=window.innerHeight/document.documentElement.getBoundingClientRect().height;if(o>=1)t.style.display="none";else{const r=o*window.innerHeight+"px";e.style.height=r,e.style.top=o*window.innerHeight/2+"px"}}(),document.addEventListener("scroll",(function(o){i(-n.getBoundingClientRect().top/(n.getBoundingClientRect().height-document.documentElement.clientHeight))})),t.addEventListener("mousedown",(function(o){e.classList.add("no-animation"),r.classList.add("no-animation"),c=!0;const n=l(o);e.tabIndex=-1,e.style.outline="none",e.focus(),i(n),s(n)})),document.addEventListener("mousemove",(function(o){if(c){const e=l(o);i(e),s(e)}})),document.addEventListener("mouseup",(function(o){e.classList.remove("no-animation"),r.classList.remove("no-animation"),c=!1,document.activeElement===e&&document.activeElement.blur()})),function(){const e=document.getElementById("drawer");if(null===e)throw Error("missing Drawer");!function(e,r){(function(o,e){const r=document.querySelector(".drawer-button.open"),n=document.querySelector(".drawer-button.close");if(null===r||null===n)throw Error("missing Drawer");void 0===e.drawer||"open"===e.drawer?(r.style.display="none",o.classList.remove("close"),o.classList.add("open")):(r.style.display="inline",o.classList.remove("open"),o.classList.add("close"))})(e,r),function(e){const r=document.querySelector(".drawer-button.open"),n=document.querySelector(".drawer-button.close");if(null===r||null===n)throw Error("missing Drawer");r.onclick=()=>{r.style.display="none",e.classList.remove("close"),e.classList.add("open");const n=o();n.drawer="open",sessionStorage.setItem("drawer_status",JSON.stringify(n))},n.onclick=()=>{r.style.display="inline",e.classList.remove("open"),e.classList.add("close");const n=o();n.drawer="close",sessionStorage.setItem("drawer_status",JSON.stringify(n))}}(e),function(o,e){o.querySelectorAll("ul.category-list > li").forEach((o=>{!function(o,e){const r=o.querySelector("a.category-drop-down");if(null===r)return;const n=o.querySelector("span.category-link"),t=o.querySelector("ul.child-category-list");void 0===e[n.innerText]||"up"===e[n.innerText]?(r.innerText="▶",t.style.display="none"):(r.innerText="▼",t.style.display="list-item")}(o,e),function(o,e){const r=o.querySelector("a.category-drop-down"),n=o.querySelector("span.category-link"),t=o.querySelector("ul.child-category-list");null!==n&&n.addEventListener("click",(()=>{void 0===e[n.innerText]||"up"===e[n.innerText]?(r.innerText="▼",t.style.display="list-item",e[n.innerText]="down"):(r.innerText="▶",t.style.display="none",e[n.innerText]="up"),sessionStorage.setItem("drawer_status",JSON.stringify(e))}))}(o,e)}))}(e,r),function(){const o=JSON.parse(window.localStorage.getItem("recents")??"[]");for(let e=1;e<=o.length;e+=1){const r=o[e-1],n=r.title,t=r.url,c=document.querySelector("a#recent-"+(o.length+1-e));c.innerText=n,c.href=t}}()}(e,o())}(),function(){const o=document.getElementById("search-box"),e=document.getElementById("search-wrapper"),r=e.querySelector("#tag-holder");e.querySelector(".inner-search").addEventListener("click",(()=>{(o.classList.contains("no-query")||o.classList.contains("inputted"))&&n.dispatchEvent(new Event("submit"))}));const n=document.getElementById("search-form");o.addEventListener("focusin",(()=>{o.classList.contains("no-query")||(o.placeholder='Prefix "#" to add Tag.')})),o.addEventListener("focusout",(()=>{o.placeholder=""})),o.addEventListener("input",(()=>{o.value.length>0?o.classList.add("inputted"):o.classList.remove("inputted"),o.value=o.value.replaceAll(/#([^# ]+) /g,g(r))})),o.addEventListener("keydown",(e=>{(function(o,e){return document.activeElement===o&&"Backspace"===e.code&&""===o.value})(o,e)&&function(o){d.pop(),o.hasChildNodes()&&o.removeChild(o.lastChild)}(r)})),n.addEventListener("submit",(n=>{n.preventDefault(),""!==o.value||0!==d.length?function(o,e){o.value=o.value.replaceAll(/#([^# ]+)/g,g(e));let r=`search.html?query=${o.value}`;if(d.length>0){r+="&tags=";for(const o of d)r+=`${o}|`;r=r.slice(0,-1)}d=[],window.location.replace(r)}(o,r):function(o,e){const r=o.placeholder;o.placeholder="No Query!",o.classList.add("no-query"),e.classList.add("no-query"),setTimeout((()=>{o.placeholder=r,o.classList.remove("no-query"),e.classList.remove("no-query")}),800)}(o,e)})),e.addEventListener("click",(()=>{o.focus()}))}()})();