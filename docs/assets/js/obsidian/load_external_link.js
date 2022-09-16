import CreateObserver from "./create_observer";
export default function loadExternalLink() {
    var _a;
    const externObserver = CreateObserver(handleExternIntersect);
    const externalLinks = document.querySelectorAll(".wikilink.externallink");
    for (let i = 0; i < externalLinks.length; i++) {
        const warningText = externalLinks[i].nextElementSibling;
        const pTag = (_a = externalLinks[i].parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        const aTag = externalLinks[i];
        aTag.addEventListener("click", (e) => {
            e.preventDefault();
            warningText.style.display = "block";
        });
        aTag.addEventListener("mouseover", (_e) => {
            pTag.style.whiteSpace = "nowrap";
        });
        pTag.addEventListener("mouseleave", (_e) => {
            pTag.style.whiteSpace = "normal";
        });
        if (warningText !== null) {
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
        var _a, _b;
        if (entry.isIntersecting) {
            const target = entry.target;
            const rect = target.getBoundingClientRect();
            const aTag = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector("a");
            const left = rect.width - entry.intersectionRect.width;
            let [_matched, translateX, translateY] = (_b = target.style.transform.match(/translate\(calc\(50% \+ (-?\d*.?\d*)px\), (.*?\)?)\)/)) !== null && _b !== void 0 ? _b : ["", "0", "-100%"];
            const OVERLAP_PORTION_WIDTH = rect.width / entry.intersectionRect.width;
            const OVERLAP_PORTION_HEIGHT = rect.height / entry.intersectionRect.height;
            if (OVERLAP_PORTION_WIDTH > 1.02) {
                if (rect.left > center.x) {
                    translateX = `${Number(translateX) - left}`;
                }
                else if (rect.left < center.x) {
                    translateX = `${Number(translateX) + left}`;
                }
            }
            if (OVERLAP_PORTION_HEIGHT > 1.02) {
                if (rect.top < center.y) {
                    translateY = `calc(-100% + ${aTag.getBoundingClientRect().height}px)`;
                }
                else {
                    translateY = "0%";
                }
            }
            target.style.transform = `translate(calc(50% + ${translateX}px), ${translateY})`;
        }
    });
}
//# sourceMappingURL=load_external_link.js.map