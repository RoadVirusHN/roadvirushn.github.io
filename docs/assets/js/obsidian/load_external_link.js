import CreateObserver from "./create_observer";
export default function loadExternalLink() {
    const externObserver = CreateObserver(handleExternIntersect);
    const externalLinks = document.querySelectorAll(".wikilink.externallink");
    for (let i = 0; i < externalLinks.length; i++) {
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
function handleExternIntersect(entries, _observer) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
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
//# sourceMappingURL=load_external_link.js.map