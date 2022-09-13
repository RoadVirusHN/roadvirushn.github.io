"use strict";
const externalLinks = document.querySelectorAll(".wikilink.externallink");
for (let i = 0; i < externalLinks.length; i++) {
    externalLinks[i].addEventListener("click", clickExternalLink);
}
function clickExternalLink(e) {
    e.preventDefault();
}
function hoverOutExternalLink(e) {
    e.target.querySelector("span.link-warning-text").style.visibility = "hidden";
}
//# sourceMappingURL=handle_link.js.map