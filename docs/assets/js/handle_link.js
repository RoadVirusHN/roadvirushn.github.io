"use strict";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("load", linkLoad, false);
function linkLoad() {
    var _a;
    const [externObserver, internObserver] = CreateObserver();
    const externalLinks = document.querySelectorAll(".wikilink.externallink");
    const internalLinks = document.querySelectorAll(".wikilink:not(.externallink)");
    for (let i = 0; i < internalLinks.length; i++) {
        const preview = internalLinks[i].nextElementSibling;
        if (preview !== null) {
            preview.style.display = "block";
            const body = (_a = preview.contentWindow) === null || _a === void 0 ? void 0 : _a.document.querySelector("body");
            if (body.hasChildNodes()) {
                const header = body.querySelector("header");
                const footer = body.querySelector("footer");
                body.removeChild(header);
                body.removeChild(footer);
                internObserver.observe(preview);
            }
            else {
                const warningText = document.createElement("span");
                warningText.style.color = "white";
                warningText.style.backgroundColor = "grey";
                warningText.innerText =
                    "netsted iframe cannot render page! visit this page!";
                body.appendChild(warningText);
            }
        }
    }
    for (let i = 0; i < externalLinks.length; i++) {
        externalLinks[i].addEventListener("click", clickExternalLink);
        const warningText = externalLinks[i].nextElementSibling;
        if (warningText !== null) {
            if (window.location !== window.parent.location) {
                warningText.innerHTML =
                    '<div style="background-color: grey; color: white;">nested iframe cannot access external link! visit this page!</div>';
            }
            externObserver.observe(warningText);
        }
    }
}
function CreateObserver() {
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0.95, 0.05],
    };
    return [
        new IntersectionObserver(handleExternIntersect, options),
        new IntersectionObserver(handleInternIntersect, options),
    ];
}
function handleInternIntersect(entries, observer) {
    entries.forEach((entry) => {
        const target = entry.target;
        const previewWrapper = target.parentElement;
        if (previewWrapper === null || previewWrapper === undefined)
            throw Error("no wrapper!");
        const aTag = previewWrapper.querySelector("a");
        if (aTag === null || aTag === undefined)
            throw Error("no aTag!");
        const rect = aTag.getBoundingClientRect();
        if (entry.isIntersecting) {
            if (rect.top > center.y) {
                target.style.transform = `translate(-50%, calc(-100% - ${previewWrapper.offsetHeight}px))`;
            }
            else {
                target.style.transform = "translate(-50% , 0%)";
            }
        }
    });
}
function handleExternIntersect(entries, observer) {
    entries.forEach((entry) => {
        const target = entry.target;
        const rect = target.getBoundingClientRect();
        if (entry.isIntersecting) {
            const left = target.offsetWidth - entry.intersectionRect.width;
            if (rect.left > center.x) {
                target.style.marginRight = `${left * 6}px`;
            }
            else if (rect.left < center.x) {
                target.style.marginLeft = `${left * 6}px`;
            }
            if (rect.top < center.y) {
                target.style.bottom = "-380%";
            }
            else {
                target.style.bottom = "100%";
            }
        }
    });
}
function clickExternalLink(e) {
    e.preventDefault();
}
//# sourceMappingURL=handle_link.js.map