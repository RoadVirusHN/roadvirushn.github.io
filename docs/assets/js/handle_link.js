"use strict";
var _a;
const wikilinks = document.querySelectorAll(".wikilink.externallink");
for (let i = 0; i < wikilinks.length; i++) {
    wikilinks[i].addEventListener("click", clickLink);
    (_a = wikilinks[i].parentElement) === null || _a === void 0 ? void 0 : _a.addEventListener("mouseleave", hoverOut);
}
function clickLink(e) {
    e.preventDefault();
    e.target.nextElementSibling.style.visibility = "visible";
}
function hoverOut(e) {
    e.target.querySelector("span.link-warning-text").style.visibility = "hidden";
}
//# sourceMappingURL=handle_link.js.map