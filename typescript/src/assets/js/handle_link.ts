const wikilinks = document.querySelectorAll(".wikilink.externallink");

for (let i = 0; i < wikilinks.length; i++) {
  wikilinks[i].addEventListener("click", clickLink);
  wikilinks[i].parentElement?.addEventListener("mouseleave", hoverOut);
}

function clickLink(e: Event): void {
  e.preventDefault();
  (
    (e.target as HTMLElement).nextElementSibling as HTMLElement
  ).style.visibility = "visible";
}

function hoverOut(e: Event): void {
  (
    (e.target as HTMLElement).querySelector(
      "span.link-warning-text"
    ) as HTMLElement
  ).style.visibility = "hidden";
}
