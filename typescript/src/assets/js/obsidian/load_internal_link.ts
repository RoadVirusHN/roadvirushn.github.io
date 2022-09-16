import CreateObserver from "./create_observer";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export default function loadInternaLink(): void {
  const internObserver = CreateObserver(handleInternIntersect);
  const internalLinks = document.querySelectorAll(
    ".wikilink:not(.externallink)"
  );
  for (let i = 0; i < internalLinks.length; i++) {
    const preview = internalLinks[i].nextElementSibling as HTMLIFrameElement;
    internalLinks[i].addEventListener("mouseover", (e) => {
      e.preventDefault();
      preview.style.display = "block";
    });
    if (window.location === window.parent.location) {
      preview.addEventListener("load", (e) => {
        const iframe = e.target as HTMLIFrameElement;
        const body = iframe.contentWindow?.document.querySelector(
          "body"
        ) as HTMLElement;
        // remove unnecessary tags(header, footer etc..)
        // extract needed header part
        // make some function to warning text.
        const header = body.querySelector("header")!;
        const footer = body.querySelector("footer")!;
        body.removeChild(header);
        body.removeChild(footer);
        internObserver.observe(preview);
      });
      preview.src = preview.dataset.href ?? "#";
    } else {
      if (preview !== null) {
        internalLinks[i].parentElement?.removeChild(preview);
        const warningText = document.createElement("span");
        warningText.style.color = "white";
        warningText.style.backgroundColor = "grey";
        warningText.innerText =
          "netsted iframe cannot render page! visit this page!";
        internalLinks[i].parentElement?.appendChild(warningText);
      }
    }
  }
}

function handleInternIntersect(
  entries: IntersectionObserverEntry[],
  _observer: IntersectionObserver
): void {
  entries.forEach((entry) => {
    const target = entry.target as HTMLElement;
    const previewWrapper = target.parentElement;
    if (previewWrapper === null || previewWrapper === undefined)
      throw Error("no wrapper!");
    const aTag = previewWrapper.querySelector("a");
    if (aTag === null || aTag === undefined) throw Error("no aTag!");
    const rect = aTag.getBoundingClientRect();
    if (entry.isIntersecting) {
      if (rect.top > center.y) {
        target.style.transform = `translate(-50%, calc(-100% - ${
          aTag.getBoundingClientRect().height
        }px))`;
      } else {
        target.style.transform = "translate(-50% , 0%)";
      }
    }
  });
}
