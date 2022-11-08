import tagJson from "../../../../_data/json/tags.json";
const tagData = tagJson;
export function buildTagLink(tag, isEmphasis) {
    const tagLink = document.createElement("a");
    tagLink.classList.add("tag-link");
    tagLink.href = `/search.html?tags=${tag}`;
    tagLink.innerText = tag;
    if (isEmphasis) {
        tagLink.classList.add("emphasis");
    }
    else {
        tagLink.style.color = tagData[tag].color;
        tagLink.style.backgroundColor = tagData[tag]["background-color"];
    }
    return tagLink;
}
//# sourceMappingURL=build_tags.js.map