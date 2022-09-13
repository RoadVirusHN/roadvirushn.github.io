const externalLinks = document.querySelectorAll(".wikilink.externallink");

for (let i = 0; i < externalLinks.length; i++) {
  externalLinks[i].addEventListener("click", clickExternalLink);
}

function clickExternalLink(e: Event): void {
  e.preventDefault();
}

function hoverOutExternalLink(e: Event): void {
  (
    (e.target as HTMLElement).querySelector(
      "span.link-warning-text"
    ) as HTMLElement
  ).style.visibility = "hidden";
}
