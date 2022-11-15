(()=>{"use strict";const o=JSON.parse('{"DB":{"background-color":"rgb(14, 246, 246)","color":"rgb(241, 9, 99)"},"CS":{"background-color":"rgb(207, 73, 73)","color":"rgb(48, 182, 8)"},"CSS":{"background-color":"rgb(27, 206, 206)","color":"rgb(228, 49, 148)"},"FRONTEND":{"background-color":"rgb(160, 169, 169)","color":"rgb(95, 86, 142)"},"HTML":{"background-color":"rgb(36, 59, 59)","color":"rgb(219, 196, 224)"},"SQL":{"background-color":"rgb(36, 60, 60)","color":"rgb(219, 195, 41)"},"DJANGO":{"background-color":"rgb(171, 38, 38)","color":"rgb(84, 217, 94)"},"PYTHON":{"background-color":"rgb(205, 79, 79)","color":"rgb(50, 176, 73)"},"BACKEND":{"background-color":"rgb(20, 131, 131)","color":"rgb(235, 124, 13)"},"JAVASCRIPT":{"background-color":"rgb(57, 126, 126)","color":"rgb(198, 129, 33)"},"NODEJS":{"background-color":"rgb(124, 219, 219)","color":"rgb(131, 36, 129)"},"알고리즘":{"background-color":"rgb(228, 57, 57)","color":"rgb(27, 198, 137)"},"요약":{"background-color":"rgb(230, 210, 210)","color":"rgb(25, 45, 88)"},"AWS":{"background-color":"rgb(158, 60, 60)","color":"rgb(97, 195, 113)"},"CLOUD":{"background-color":"rgb(32, 179, 179)","color":"rgb(223, 76, 92)"},"DOCKER":{"background-color":"rgb(129, 51, 51)","color":"rgb(126, 204, 233)"},"CICD":{"background-color":"rgb(209, 71, 71)","color":"rgb(46, 184, 19)"},"MATH":{"background-color":"rgb(0, 249, 249)","color":"rgb(255, 6, 26)"},"MATH,":{"background-color":"rgb(205, 180, 180)","color":"rgb(50, 75, 234)"},"EXPRESSJS":{"background-color":"rgb(72, 207, 207)","color":"rgb(183, 48, 77)"},"JS":{"background-color":"rgb(235, 93, 93)","color":"rgb(20, 162, 8)"},"GIT":{"background-color":"rgb(197, 81, 81)","color":"rgb(58, 174, 149)"},"FLASK":{"background-color":"rgb(25, 221, 221)","color":"rgb(230, 34, 218)"},"GRAPHQL":{"background-color":"rgb(191, 50, 50)","color":"rgb(64, 205, 31)"},"ENG":{"background-color":"rgb(107, 69, 69)","color":"rgb(148, 186, 88)"},"OS":{"background-color":"rgb(138, 156, 156)","color":"rgb(117, 99, 155)"},"컴퓨터_구조":{"background-color":"rgb(113, 168, 168)","color":"rgb(142, 87, 19)"},"NOTAG":{"background-color":"rgb(146, 179, 179)","color":"rgb(109, 76, 200)"},"CRUDE":{"background-color":"rgb(62, 183, 183)","color":"rgb(193, 72, 144)"},"HIDE":{"background-color":"rgb(187, 30, 30)","color":"rgb(68, 225, 197)"},"NETWORK":{"background-color":"rgb(143, 252, 252)","color":"rgb(112, 3, 143)"},"BLOG_TEST":{"background-color":"rgb(223, 22, 22)","color":"rgb(32, 233, 34)"},"컴퓨터구조":{"background-color":"rgb(219, 68, 68)","color":"rgb(36, 187, 253)"}}'),r=o;let e=[];const t=o;function n(o,r){const e=document.createElement("a");return e.classList.add("tag-link"),e.href=`/search.html?tags=${o}`,e.innerText=o,r?e.classList.add("emphasis"):(e.style.color=t[o].color,e.style.backgroundColor=t[o]["background-color"]),e}const c=window;function l(o,r){const e=document.createElement("li");e.appendChild(function(o){const r=document.createElement("span");return r.classList.add("post-meta"),r.innerText=o,r}(o.date));for(const t of o.tags)e.appendChild(n(t,r.includes(t)));return e.appendChild(function(o,r,e){const t=document.createElement("h3"),n=document.createElement("a");n.classList.add("post-link");for(const e of o)r=r.replaceAll(new RegExp(e.query,"gi"),(o=>`<mark>${o}</mark>`));return n.innerHTML=r,n.href=e,t.appendChild(n),t}(o.titleMatchs,o.title,o.url)),e.appendChild(function(o,r){const e=document.createElement("p");if(o.length>0){const t=Math.max(o[0].position[0][0]-50,0),n=Math.min(o[0].position[0][0]+o[0].position[0][1]+150,r.length);r=r.substring(t,n);for(const e of o)r=r.replaceAll(new RegExp(e.query,"gi"),(o=>`<mark>${o}</mark>`));e.innerHTML=r+"..."}else e.innerHTML=r.substring(0,200)+"...";return e}(o.contentMatchs,o.content)),e}!function(){const o=function(){const o=window.location.search,r=new URLSearchParams(o);let e=r.get("query");e=null!==e?decodeURIComponent(e.replace(/\+/g,"%20")):"";let t=r.get("tags")?.split("|").map(decodeURIComponent).map((o=>o.toUpperCase())).filter((o=>null!=o.match(/[^ ]/)));return t=void 0!==t?t:[],{query:e,tags:t}}();if(""===o.query&&0===o.tags.length){const o=document.querySelector(".post-list-heading"),r=document.getElementById("search-box"),e=document.getElementById("search-wrapper");return o.innerHTML="You entered No Query!",o.style.color="red",o.style.fontSize="xx-large",void function(o,r){const e=o.placeholder;o.placeholder="No Query!",o.classList.add("no-query"),r.classList.add("no-query"),setTimeout((()=>{o.placeholder=e,o.classList.remove("no-query"),r.classList.remove("no-query")}),800)}(r,e)}!function(o){const t=document.getElementById("search-box"),n=document.querySelector("#tag-holder");t.value=`${o.query}`;for(const r of o.tags)t.value+=` #${r}`;t.value=t.value.replaceAll(/#([^# ]+)/g,function(o){return(t,n)=>{const c=document.createElement("a"),l=n.toUpperCase();return c.innerText=l+" x",c.classList.add("tag-link"),c.classList.add("for-search"),void 0!==r[l]?(c.style.color=r[l].color,c.style.backgroundColor=r[l]["background-color"],e.push(l)):c.innerText="❓UNREGISTERED TAG x",c.addEventListener("click",(o=>{o.preventDefault(),function(o){const r=o.target,t=e.findIndex((o=>o===r.innerText.slice(0,-2)));e.splice(t,1),r.remove()}(o)})),o.appendChild(c),""}}(n)),null===o.query.match(/[^ ]/)&&(t.value=""),t.dispatchEvent(new Event("input")),t.dispatchEvent(new Event("focusin"))}(o),function(o,r){const e=document.getElementById("query-results");e.querySelector(".query-str").innerHTML=`<mark>${r.query}</mark>`;const t=e.querySelector(".post-list"),c=e.querySelector(".query-tags");for(const o of r.tags){const e=n(o,r.tags.includes(o));c.appendChild(e)}if(o.length>0){t.innerHTML="";for(const e of o)t.append(l(e,r.tags))}}(function(o){if(""===o.query)return function(o){const r=[];for(const e of Object.keys(c.store)){const t=c.store[e];let n=!1;for(const r of o)if(!t.tags.includes(r)){n=!0;break}n||r.push({url:t.url,date:t.date,tags:t.tags.map((o=>o.toUpperCase())),title:t.title,titleMatchs:[],content:t.content,contentMatchs:[]})}return r}(o.tags);const r=function(o,r){return o.filter((o=>{for(const e of r.tags)if(!c.store[o.ref].tags.includes(e.toUpperCase()))return!1;return!0}))}(""!==o.query?window.searchIndex.search(o.query):[],o);return function(o){const r=[];for(let e=0;e<o.length;e++){const t=c.store[o[e].ref],n=o[e].matchData.metadata,l=Object.keys(n),a=[],s=[];for(const o of l)void 0!==n[o].content&&s.push({query:o,position:n[o].content.position}),void 0!==n[o].title&&a.push({query:o,position:n[o].title.position});r.push({url:t.url,date:t.date,tags:t.tags.map((o=>o.toUpperCase())),title:t.title,titleMatchs:a,content:t.content,contentMatchs:s})}return r}(r)}(o),o)}()})();