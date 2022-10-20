import CreateObserver from "../../utils/create_observer";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
export default function loadInternaLink() {
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
                const iframe = e.target;
                const body = iframe.contentWindow?.document.querySelector("body");
                internObserver.observe(preview);
                const header = body.querySelector("header");
                const footer = body.querySelector("footer");
                body.removeChild(header);
                body.removeChild(footer);
            });
            preview.src = preview.dataset.href ?? "#";
        }
        else {
            if (preview !== null) {
                aTag.parentElement?.removeChild(preview);
                const warningText = document.createElement("span");
                warningText.classList.add("blocked-preview");
                warningText.innerHTML =
                    'Security alert ❌<br/> <strong>Link in the nested iframe</strong><br/> visit <a href="#">this</a> page!';
                aTag.parentElement?.appendChild(warningText);
            }
        }
    }
}
function buildPreview(heading, newContent) {
    const additionalTop = newContent.querySelector("div.additional.top");
    const quotedSection = newContent.querySelector(".quoted-section");
    const additionalBottom = newContent.querySelector("div.additional.bottom");
    let beforeElement = heading?.previousElementSibling;
    for (const _ of [Array(5).keys()]) {
        if (beforeElement === null || beforeElement === undefined) {
            break;
        }
        additionalTop?.prepend(beforeElement);
        beforeElement = beforeElement.previousElementSibling;
    }
    let targetElement = heading;
    quotedSection?.appendChild(targetElement);
    targetElement = targetElement.nextElementSibling;
    while (targetElement !== null && !isUpperHeading(heading, targetElement)) {
        console.log("targetElement", targetElement);
        console.log(targetElement === null);
        quotedSection?.appendChild(targetElement);
        targetElement = targetElement.nextElementSibling;
    }
    for (const _ of [Array(5).keys()]) {
        additionalBottom?.appendChild(targetElement);
        targetElement = targetElement?.nextElementSibling;
        if (targetElement === null || targetElement === undefined) {
            break;
        }
    }
    return newContent;
}
function isUpperHeading(originHeading, targetHeading) {
    if (targetHeading.tagName in ["H1", "H2", "H3", "H4", "H5", "H6"]) {
        const originLevel = originHeading.tagName.match(/\d/);
        const targetLevel = originHeading.tagName.match(/\d/);
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
//# sourceMappingURL=init_internal_link.js.map