import tagJson from "../../../../_data/json/tags.json";
const tagData = tagJson;
export function buildTagLink(tag, isEmphasis) {
    const tagLink = document.createElement("a");
    tagLink.classList.add("tag-link");
    tagLink.href = `/search.html?tags=${tag}`;
    tagLink.innerHTML = `<strong>${tag}</strong>`;
    if (isEmphasis) {
        tagLink.classList.add("emphasis");
    }
    else {
        tagLink.style.color = "white";
        tagLink.style.backgroundColor = "grey";
    }
    return tagLink;
}
//# sourceMappingURL=build_tags.js.map