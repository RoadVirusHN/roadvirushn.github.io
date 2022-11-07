import { buildTagLink } from "../../search/utils/build_tags";
import postsJson from "../../../../_data/json/posts.json";
import categoriesJson from "../../../../_data/json/categories.json";
const categoriesData = categoriesJson;
const postsData = postsJson;
export default function initDrawer() {
    const drawer = document.getElementById("drawer");
    if (drawer === null) {
        throw Error("missing Drawer");
    }
    setButtonEvent(drawer);
    setCategories();
    updateRecentViews();
}
function setButtonEvent(drawer) {
    const openButton = document.querySelector(".drawer-button.open");
    const closeButton = document.querySelector(".drawer-button.close");
    if (openButton === null || closeButton === null) {
        throw Error("missing Drawer");
    }
    openButton.onclick = () => {
        openButton.style.display = "none";
        drawer.classList.add("open");
        drawer.classList.remove("close");
    };
    closeButton.onclick = () => {
        openButton.style.display = "inline";
        drawer.classList.add("close");
        drawer.classList.remove("open");
    };
}
function setCategories() {
    const categories = document.querySelector(".drawer-content .drawer-posts .categories");
    if (categories === null) {
        throw Error("missing categories");
    }
    for (const category of categories.querySelectorAll("ul.category-list>li>h3")) {
        const categoryName = category.innerText.replace(/[\s]/g, "");
        category.addEventListener("click", () => {
            const queryRes = document.querySelector("div#query-results");
            queryRes?.remove();
            changePageToPostList(categoryName, categoriesData.categories[categoryName]);
        });
        for (const childCategory of category.parentElement.querySelectorAll("ul.child-category-list>li>h4")) {
            const childCategoryName = childCategory.innerText.replace(/[\s]/g, "");
            childCategory.addEventListener("click", () => {
                const queryRes = document.querySelector("div#query-results");
                queryRes?.remove();
                changePageToPostList(childCategoryName, categoriesData.categories[categoryName].categories[childCategoryName]);
            });
        }
    }
}
function changePageToPostList(categoryName, categoryInfo) {
    const newDivHome = document.createElement("div");
    newDivHome.classList.add("home");
    const postListHeading = document.createElement("h2");
    postListHeading.classList.add("post-list-heading");
    postListHeading.innerText = categoryName;
    newDivHome.appendChild(postListHeading);
    const postList = document.createElement("ul");
    postList.classList.add("post-list");
    for (const category of Object.keys(categoryInfo.categories)) {
        const folderItem = document.createElement("li");
        const folderMeta = document.createElement("span");
        folderMeta.classList.add("post-meta");
        folderMeta.innerHTML = "┗ Subdirectory";
        folderItem.appendChild(folderMeta);
        folderItem.classList.add("folder-item");
        const folderTitle = document.createElement("h3");
        const folderAnchor = document.createElement("a");
        const fileNum = categoryInfo.categories[category].posts.length;
        const folderNum = Object.keys(categoryInfo.categories[category].categories).length;
        const insideInfo = fileNum + folderNum === 0
            ? "(Empty)"
            : `<span style="font-size: xx-small;">(${fileNum > 0 ? `📄: ${fileNum}` : ""}${folderNum > 0 ? `📂: ${folderNum}` : ""})</span>`;
        folderAnchor.innerHTML = `📂 <strong>${category}</strong>${insideInfo}`;
        folderTitle.appendChild(folderAnchor);
        folderItem.appendChild(folderTitle);
        postList.appendChild(folderItem);
    }
    const sortedPosts = categoryInfo.posts.sort((a, b) => {
        return -(new Date(postsData[a].date).getTime() -
            new Date(postsData[b].date).getTime());
    });
    for (const post of sortedPosts) {
        if (postsData[post].tags.includes("HIDE"))
            continue;
        const postItem = document.createElement("li");
        const postMeta = document.createElement("span");
        postMeta.classList.add("post-meta");
        postMeta.innerText = postsData[post].date;
        postItem.appendChild(postMeta);
        for (const tag of postsData[post].tags) {
            const tagLink = buildTagLink(tag, false);
            postItem.appendChild(tagLink);
        }
        const postTitle = document.createElement("h3");
        const postLink = document.createElement("a");
        postLink.classList.add("post-link");
        postLink.href = post;
        postLink.innerText = postsData[post].title;
        postTitle.appendChild(postLink);
        postItem.appendChild(postTitle);
        postList.appendChild(postItem);
    }
    newDivHome.appendChild(postList);
    const wrapper = document.querySelector("main.page-content div.wrapper");
    wrapper.innerHTML = "";
    wrapper?.appendChild(newDivHome);
}
export function updateRecentViews() {
    const recents = JSON.parse(window.localStorage.getItem("recents") ?? "[]");
    for (let i = 1; i <= recents.length; i += 1) {
        const info = recents[i - 1];
        const recentTitle = info.title;
        const recentUrl = info.url;
        const targetAnchor = document.querySelector(`a#recent-${recents.length + 1 - i}`);
        targetAnchor.innerText = recentTitle;
        targetAnchor.href = recentUrl;
    }
}
//# sourceMappingURL=init_drawer.js.map