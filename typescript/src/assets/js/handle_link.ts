const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("load", linkLoad, false);

function linkLoad(): void {
  const [externObserver, internObserver] = CreateObserver();
  const externalLinks = document.querySelectorAll(".wikilink.externallink");
  const internalLinks = document.querySelectorAll(
    ".wikilink:not(.externallink)"
  );
  for (let i = 0; i < internalLinks.length; i++) {
    const preview = internalLinks[i].nextElementSibling as HTMLIFrameElement;

    if (preview !== null) {
      preview.style.display = "block";
      const body = preview.contentWindow?.document.querySelector(
        "body"
      ) as HTMLElement;
      if (body.hasChildNodes()) {
        // remove unnecessary tags(header, footer etc..)
        // extract needed header part
        // make some function to warning text.
        const header = body.querySelector("header")!;
        const footer = body.querySelector("footer")!;
        body.removeChild(header);
        body.removeChild(footer);
        internObserver.observe(preview);
      } else {
        // fill body with warning text
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
function CreateObserver(): IntersectionObserver[] {
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
function handleInternIntersect(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
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
        target.style.transform = `translate(-50%, calc(-100% - ${previewWrapper.offsetHeight}px))`;
      } else {
        target.style.transform = "translate(-50% , 0%)";
      }
    }
  });
}
function handleExternIntersect(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
): void {
  entries.forEach((entry) => {
    const target = entry.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (entry.isIntersecting) {
      const left = target.offsetWidth - entry.intersectionRect.width;
      if (rect.left > center.x) {
        target.style.marginRight = `${left * 6}px`;
      } else if (rect.left < center.x) {
        target.style.marginLeft = `${left * 6}px`;
      }

      if (rect.top < center.y) {
        target.style.bottom = "-380%";
      } else {
        target.style.bottom = "100%";
      }
    }
  });
}

function clickExternalLink(e: Event): void {
  e.preventDefault();
}
