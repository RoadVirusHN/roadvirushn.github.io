const storedWindow = window;
let queryCategories = [];
function initSearchbar() {
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
        if (searchBar.value === "" && queryCategories.length === 0) {
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
    queryCategories.pop();
    if (tagHolder.hasChildNodes()) {
        tagHolder.removeChild(tagHolder.lastChild);
    }
}
function goToSearchpage(searchBar, tagHolder) {
    searchBar.value = searchBar.value.replaceAll(/#([^# ]+)/g, replaceTagToElement(tagHolder));
    let url = `search.html?query=${searchBar.value}`;
    if (queryCategories.length > 0) {
        url += "&categories=";
        for (const category of queryCategories) {
            url += `${category}|`;
        }
        url = url.slice(0, -1);
    }
    queryCategories = [];
    window.location.replace(url);
}
function clickToDeleteTag(e) {
    const tag = e.target;
    const removeTarget = queryCategories.findIndex((e) => e === tag.innerText.slice(0, -2));
    queryCategories.splice(removeTarget, 1);
    tag.remove();
}
initSearchbar();
export function replaceTagToElement(tagHolder) {
    return (_str, tagName) => {
        const categoryLink = document.createElement("a");
        const category = tagName.toUpperCase();
        categoryLink.innerText = category + " x";
        categoryLink.classList.add("category-link");
        categoryLink.classList.add("for-search");
        if (storedWindow.categories[category] !== undefined) {
            categoryLink.style.color = storedWindow.categories[category].color;
            categoryLink.style.backgroundColor =
                storedWindow.categories[category]["background-color"];
            queryCategories.push(category);
        }
        else {
            categoryLink.innerText = "❓UNREGISTERED TAG x";
        }
        categoryLink.addEventListener("click", (e) => {
            e.preventDefault();
            clickToDeleteTag(e);
        });
        tagHolder.appendChild(categoryLink);
        return "";
    };
}
//# sourceMappingURL=init_searchbar.js.map