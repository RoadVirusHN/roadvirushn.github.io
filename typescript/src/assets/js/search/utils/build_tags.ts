import { NewWindow } from "../../types/lunr_types";

const storedWindow = window as NewWindow;

export function buildTagLink(tag: string, isEmphasis: boolean): HTMLElement {
  const tagLink = document.createElement("a");
  tagLink.classList.add("tag-link");
  tagLink.href = `/search.html?tags=${tag}`;
  tagLink.innerText = tag;
  if (isEmphasis) {
    tagLink.classList.add("emphasis");
  } else {
    tagLink.style.color = storedWindow.tags[tag].color;
    tagLink.style.backgroundColor = storedWindow.tags[tag]["background-color"];
  }
  return tagLink;
}
