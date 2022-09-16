import CreateObserver from "./create_observer";

export default function loadExternalLink(): void {
  const externObserver = CreateObserver(handleExternIntersect);
  const externalLinks = document.querySelectorAll(".wikilink.externallink");

  for (let i = 0; i < externalLinks.length; i++) {
    const warningText = externalLinks[i].nextElementSibling as HTMLElement;
    const pTag = externalLinks[i].parentElement?.parentElement as HTMLElement;
    const aTag = externalLinks[i] as HTMLElement;
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

function handleExternIntersect(
  entries: IntersectionObserverEntry[],
  _observer: IntersectionObserver
): void {
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const aTag = target.parentElement?.querySelector("a") as HTMLElement;

      const left = rect.width - entry.intersectionRect.width;
      let [_matched, translateX, translateY] = target.style.transform.match(
        /translate\(calc\(50% \+ (-?\d*.?\d*)px\), (.*?\)?)\)/
      ) ?? ["", "0", "-100%"];

      const OVERLAP_PORTION_WIDTH = rect.width / entry.intersectionRect.width;
      const OVERLAP_PORTION_HEIGHT =
        rect.height / entry.intersectionRect.height;
      if (OVERLAP_PORTION_WIDTH > 1.02) {
        if (rect.left > center.x) {
          translateX = `${Number(translateX) - left}`;
        } else if (rect.left < center.x) {
          translateX = `${Number(translateX) + left}`;
        }
      }

      if (OVERLAP_PORTION_HEIGHT > 1.02) {
        if (rect.top < center.y) {
          translateY = `calc(-100% + ${aTag.getBoundingClientRect().height}px)`;
        } else {
          translateY = "0%";
        }
      }

      target.style.transform = `translate(calc(50% + ${translateX}px), ${translateY})`;
    }
  });
}
