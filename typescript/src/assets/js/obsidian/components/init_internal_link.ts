import CreateObserver from "../../utils/create_observer";
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export default function initInternalLinks(): void {
  const internObserver = CreateObserver(handleInternIntersect);
  const internalLinks = document.querySelectorAll(
    ".wikilink:not(.externallink)"
  );
  //   const newContent = convertStringToHTML(`<div class="content-section">
  //   <div>...</div>
  //   <div class="additional top"></div>
  //   <div class="quoted-section"></div>
  //   <div class="additional bottom"></div>
  //   <div>...</div>
  //   <div>
  //     이외의 컨텐츠는 <a class="original-href" href="">이곳</a>을 확인해주세요.
  //   </div>
  //   <style>
  //     div.quoted-section {
  //       border-left: solid 8px greenyellow;
  //     }
  //   </style>
  // </div>
  // `);

  for (let i = 0; i < internalLinks.length; i++) {
    const aTag = internalLinks[i] as HTMLLinkElement;
    const preview = aTag.nextElementSibling as HTMLIFrameElement;
    aTag.addEventListener("mouseover", (e) => {
      e.preventDefault();
      preview.style.display = "block";
    });
    if (window.location === window.parent.location) {
      preview.addEventListener("load", (e) => {
        const iframe = e.target as HTMLIFrameElement;
        const body = iframe.contentWindow?.document.querySelector(
          "body"
        ) as HTMLElement;
        internObserver.observe(preview);
        const header = body.querySelector("header")!;
        const footer = body.querySelector("footer")!;
        body.removeChild(header);
        body.removeChild(footer);
        const drawer = body.querySelector("#drawer")!;
        const drawerButton = body.querySelector("button.drawer-button.open")!;
        body.querySelector("main")!.removeChild(drawer);
        body.querySelector("main")!.removeChild(drawerButton);
        // const regexResult = aTag.href.match(
        //   /#(?<id>[^#\s]+)$/
        // ) as RegExpMatchArray;
        // console.log(regexResult);

        // if (regexResult === null) {
        //   return;
        // }
        // const content = body.querySelector(
        //   "div.content-section"
        // ) as HTMLElement;

        // // const heading = content.querySelector(
        // //   `#${regexResult[1]}`
        // // ) as HTMLElement;
        // // if (heading === null) {
        // //   return;
        // // }
        // // newContent = buildPreview(heading, newContent);
        // // console.log(newContent);

        // body
        //   .querySelector("div.post-content.e-content")!
        //   .replaceChild(newContent, content);
      });
      preview.src = preview.dataset.href ?? "#";
    } else {
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

function buildPreview(
  heading: HTMLElement,
  newContent: HTMLElement
): HTMLElement {
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
  targetElement = targetElement.nextElementSibling as HTMLElement;
  while (targetElement !== null && !isUpperHeading(heading, targetElement)) {
    quotedSection?.appendChild(targetElement);
    targetElement = targetElement.nextElementSibling as HTMLElement;
  }

  for (const _ of [Array(5).keys()]) {
    additionalBottom?.appendChild(targetElement);
    targetElement = targetElement?.nextElementSibling as HTMLElement;
    if (targetElement === null || targetElement === undefined) {
      break;
    }
  }

  return newContent;
}
function isUpperHeading(
  originHeading: HTMLElement,
  targetHeading: HTMLElement
): boolean {
  if (targetHeading.tagName in ["H1", "H2", "H3", "H4", "H5", "H6"]) {
    const originLevel = originHeading.tagName.match(/\d/)!;
    const targetLevel = originHeading.tagName.match(/\d/)!;
    if (targetLevel <= originLevel) {
      return true;
    }
  }
  return false;
}

function convertStringToHTML(str: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body;
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
        target.style.transform = `translate(-50%, calc(-100% - ${aTag.offsetHeight}px))`;
      } else {
        target.style.transform = "translate(-50% , 0%)";
      }
    }
  });
}
