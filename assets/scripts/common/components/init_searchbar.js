import tagJson from "../../../../_data/json/tags.json";
const tagData = tagJson;
let queryTags = [];
export default function initSearchbar() {
    const searchBar = document.getElementById("search-box");
    const searchWrapper = document.getElementById("search-wrapper");
    const tagHolder = searchWrapper.querySelector("#tag-holder");
    const magnifier = searchWrapper.querySelector(".inner-search");
    magnifier.addEventListener("click", () => {
        form.dispatchEvent(new Event("submit"));
    });
    const form = document.getElementById("search-form");
    searchBar.addEventListener("focusin", () => {
        if (!searchBar.classList.contains("no-query"))
            searchBar.placeholder = 'Prefix "#" to add Tag.';
    });
    searchBar.addEventListener("focusout", () => {
        searchBar.placeholder = "";
    });
    searchBar.addEventListener("input", () => {
        if (searchBar.value.length > 0) {
            searchBar.classList.add("inputted");
        }
        else {
            searchBar.classList.remove("inputted");
        }
        searchBar.value = searchBar.value.replaceAll(/#([^# ]+) /g, replaceTagToElement(tagHolder));
    });
    searchBar.addEventListener("keydown", (e) => {
        if (isTryToDeleteTag(searchBar, e)) {
            removeLastTag(tagHolder);
        }
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (searchBar.value === "" && queryTags.length === 0) {
            playNoQueryAnim(searchBar, searchWrapper);
            return;
        }
        goToSearchpage(searchBar, tagHolder);
    });
    searchWrapper.addEventListener("click", () => {
        searchBar.focus();
    });
}
export function playNoQueryAnim(searchBar, searchWrapper) {
    const beforePlaceholder = searchBar.placeholder;
    searchBar.placeholder = "No Query!";
    searchBar.classList.add("no-query");
    searchWrapper.classList.add("no-query");
    setTimeout(() => {
        searchBar.placeholder = beforePlaceholder;
        searchBar.classList.remove("no-query");
        searchWrapper.classList.remove("no-query");
    }, 800);
}
function isTryToDeleteTag(searchBar, e) {
    return (document.activeElement === searchBar &&
        e.code === "Backspace" &&
        searchBar.value === "");
}
function removeLastTag(tagHolder) {
    queryTags.pop();
    if (tagHolder.hasChildNodes()) {
        tagHolder.removeChild(tagHolder.lastChild);
    }
}
function goToSearchpage(searchBar, tagHolder) {
    searchBar.value = searchBar.value.replaceAll(/#([^# ]+)/g, replaceTagToElement(tagHolder));
    let url = `search.html?query=${searchBar.value}`;
    if (queryTags.length > 0) {
        url += "&tags=";
        for (const tag of queryTags) {
            url += `${tag}|`;
        }
        url = url.slice(0, -1);
    }
    queryTags = [];
    window.location.replace(url);
}
function clickToDeleteTag(e) {
    const tag = e.target;
    const removeTarget = queryTags.findIndex((e) => e === tag.innerText.slice(0, -2));
    queryTags.splice(removeTarget, 1);
    tag.remove();
}
export function replaceTagToElement(tagHolder) {
    return (_str, tagName) => {
        const tagLink = document.createElement("a");
        const tag = tagName.toUpperCase();
        tagLink.innerText = tag + " x";
        tagLink.classList.add("tag-link");
        tagLink.classList.add("for-search");
        if (tagData[tag] !== undefined) {
            tagLink.style.color = tagData[tag].color;
            tagLink.style.backgroundColor = tagData[tag]["background-color"];
            queryTags.push(tag);
        }
        else {
            tagLink.innerText = "❓UNREGISTERED TAG x";
        }
        tagLink.addEventListener("click", (e) => {
            e.preventDefault();
            clickToDeleteTag(e);
        });
        tagHolder.appendChild(tagLink);
        return "";
    };
}
//# sourceMappingURL=init_searchbar.js.map