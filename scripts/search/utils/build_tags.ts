// @ts-expect-error: ooh! you suck TS!
import tagJson from "../../../../_data/json/tags.json";
import { TagInfo } from "../../types/search_types";

const tagData = tagJson as TagInfo;

export function buildTagLink(tag: string, isEmphasis: boolean): HTMLElement {
  const tagLink = document.createElement("a");
  tagLink.classList.add("tag-link");
  tagLink.href = `/search.html?tags=${tag}`;
  tagLink.innerHTML = `<strong>${tag}</strong>`;
  if (isEmphasis) {
    tagLink.classList.add("emphasis");
  } else {
    tagLink.style.color = "white";
    tagLink.style.backgroundColor = "grey";
  }
  return tagLink;
}
