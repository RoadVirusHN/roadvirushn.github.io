import CreateObserver from "./create_observer";
export default function loadExternalLink() {
    const externObserver = CreateObserver(handleExternIntersect);
    const externalLinks = document.querySelectorAll(".wikilink.externallink");
    for (let i = 0; i < externalLinks.length; i++) {
        const aTag = externalLinks[i];
        const linkWarning = aTag.parentElement;
        const warningText = linkWarning.querySelector("span.link-warning-text");
        const linkTitle = linkWarning.querySelector("a.link-title");
        aTag.addEventListener("click", (e) => {
            e.preventDefault();
            linkTitle.focus();
        });
        linkTitle.addEventListener("click", (e) => {
            e.preventDefault();
        });
        linkTitle.innerText = aTag.innerText;
        linkTitle.style.display = "inline";
        if (warningText !== null) {
            warningText.style.display = "inline";
            if (window.location !== window.parent.location) {
                warningText.innerHTML =
                    '<div style="background-color: grey; color: white;">nested iframe cannot access external link! visit this page!</div>';
            }
            externObserver.observe(warningText);
        }
    }
}
function handleExternIntersect(entries, _observer) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    entries.forEach((entry) => {
        var _a;
        if (entry.isIntersecting) {
            const warningText = entry.target;
            const rect = warningText.getBoundingClientRect();
            const linkTitle = (_a = warningText.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector("a.link-title");
            const PADDING_SIZE = 10;
            const OVERLAP_PORTION_WIDTH = rect.width / entry.intersectionRect.width;
            const OVERLAP_PORTION_HEIGHT = rect.height / entry.intersectionRect.height;
            if (OVERLAP_PORTION_WIDTH > 1.02) {
                if (rect.left > center.x) {
                    warningText.style.left = `calc(-50% - ${PADDING_SIZE}px - ${linkTitle.innerText.length}ch)`;
                }
                else if (rect.left < center.x) {
                    warningText.style.left = `calc(150% + ${PADDING_SIZE}px + ${linkTitle.innerText.length}ch)`;
                }
            }
            if (OVERLAP_PORTION_HEIGHT > 1.02) {
                if (rect.top < center.y) {
                    warningText.style.top = `calc(150% + ${PADDING_SIZE}px + 1em + 1px)`;
                }
                else {
                    warningText.style.top = `calc(-100% - ${PADDING_SIZE}px - 1em - 1px)`;
                }
            }
        }
    });
}
//# sourceMappingURL=load_external_link.js.map