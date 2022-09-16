import CreateObserver from "./create_observer";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
export default function loadInternaLink() {
    var _a, _b, _c;
    const internObserver = CreateObserver(handleInternIntersect);
    const internalLinks = document.querySelectorAll(".wikilink:not(.externallink)");
    for (let i = 0; i < internalLinks.length; i++) {
        const preview = internalLinks[i].nextElementSibling;
        internalLinks[i].addEventListener("mouseover", (e) => {
            e.preventDefault();
            preview.style.display = "block";
        });
        if (window.location === window.parent.location) {
            preview.addEventListener("load", (e) => {
                var _a;
                const iframe = e.target;
                const body = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.querySelector("body");
                const header = body.querySelector("header");
                const footer = body.querySelector("footer");
                body.removeChild(header);
                body.removeChild(footer);
                internObserver.observe(preview);
            });
            preview.src = (_a = preview.dataset.href) !== null && _a !== void 0 ? _a : "#";
        }
        else {
            if (preview !== null) {
                (_b = internalLinks[i].parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(preview);
                const warningText = document.createElement("span");
                warningText.style.color = "white";
                warningText.style.backgroundColor = "grey";
                warningText.innerText =
                    "netsted iframe cannot render page! visit this page!";
                (_c = internalLinks[i].parentElement) === null || _c === void 0 ? void 0 : _c.appendChild(warningText);
            }
        }
    }
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
                target.style.transform = `translate(-50%, calc(-100% - ${aTag.getBoundingClientRect().height}px))`;
            }
            else {
                target.style.transform = "translate(-50% , 0%)";
            }
        }
    });
}
//# sourceMappingURL=load_internal_link.js.map