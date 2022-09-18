import CreateObserver from "./create_observer";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
export default function loadInternaLink() {
    var _a, _b, _c;
    const internObserver = CreateObserver(handleInternIntersect);
    const internalLinks = document.querySelectorAll(".wikilink:not(.externallink)");
    for (let i = 0; i < internalLinks.length; i++) {
        const aTag = internalLinks[i];
        const preview = aTag.nextElementSibling;
        aTag.addEventListener("mouseover", (e) => {
            e.preventDefault();
            preview.style.display = "block";
        });
        if (window.location === window.parent.location) {
            preview.addEventListener("load", (e) => {
                var _a;
                const iframe = e.target;
                const body = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.querySelector("body");
                internObserver.observe(preview);
                const header = body.querySelector("header");
                const footer = body.querySelector("footer");
                body.removeChild(header);
                body.removeChild(footer);
            });
            preview.src = (_a = preview.dataset.href) !== null && _a !== void 0 ? _a : "#";
        }
        else {
            if (preview !== null) {
                (_b = aTag.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(preview);
                const warningText = document.createElement("span");
                warningText.style.color = "white";
                warningText.style.backgroundColor = "grey";
                warningText.innerText =
                    "netsted iframe cannot render page! visit this page!";
                (_c = aTag.parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(warningText);
            }
        }
    }
}
function buildPreview(heading, newContent) {
    const additionalTop = newContent.querySelector("div.additional.top");
    const quotedSection = newContent.querySelector(".quoted-section");
    const additionalBottom = newContent.querySelector("div.additional.bottom");
    console.log(heading);
    let beforeElement = heading === null || heading === void 0 ? void 0 : heading.previousElementSibling;
    for (const _ of [Array(5).keys()]) {
        if (beforeElement === null || beforeElement === undefined) {
            break;
        }
        additionalTop === null || additionalTop === void 0 ? void 0 : additionalTop.prepend(beforeElement);
        beforeElement = beforeElement.previousElementSibling;
    }
    console.log(additionalTop);
    let targetElement = heading;
    quotedSection === null || quotedSection === void 0 ? void 0 : quotedSection.appendChild(targetElement);
    targetElement = targetElement.nextElementSibling;
    while (targetElement !== null && !isUpperHeading(heading, targetElement)) {
        console.log("targetElement", targetElement);
        console.log(targetElement === null);
        quotedSection === null || quotedSection === void 0 ? void 0 : quotedSection.appendChild(targetElement);
        targetElement = targetElement.nextElementSibling;
    }
    for (const _ of [Array(5).keys()]) {
        console.log("targetelement", targetElement);
        additionalBottom === null || additionalBottom === void 0 ? void 0 : additionalBottom.appendChild(targetElement);
        targetElement = targetElement === null || targetElement === void 0 ? void 0 : targetElement.nextElementSibling;
        if (targetElement === null || targetElement === undefined) {
            break;
        }
    }
    console.log(additionalBottom);
    return newContent;
}
function isUpperHeading(originHeading, targetHeading) {
    if (targetHeading.tagName in ["H1", "H2", "H3", "H4", "H5", "H6"]) {
        const originLevel = originHeading.tagName.match(/\d/);
        const targetLevel = originHeading.tagName.match(/\d/);
        console.log(originLevel, targetLevel);
        if (targetLevel <= originLevel) {
            return true;
        }
    }
    return false;
}
function convertStringToHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body;
}
function handleInternIntersect(entries, _observer) {
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
                target.style.transform = `translate(-50%, calc(-100% - ${aTag.offsetHeight}px))`;
            }
            else {
                target.style.transform = "translate(-50% , 0%)";
            }
        }
    });
}
//# sourceMappingURL=load_internal_link.js.map