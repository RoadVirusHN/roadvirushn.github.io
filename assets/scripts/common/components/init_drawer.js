export default function initDrawer() {
    const drawer = document.getElementById("drawer");
    if (drawer === null) {
        throw Error("missing Drawer");
    }
    const drawerStatus = getDrawerStatus();
    renderDrawerByStatus(drawer, drawerStatus);
}
function getDrawerStatus() {
    const drawerStatusString = sessionStorage.getItem("drawer_status");
    let drawerStatus;
    if (drawerStatusString == null) {
        drawerStatus = {};
    }
    else {
        drawerStatus = JSON.parse(drawerStatusString);
    }
    return drawerStatus;
}
function renderDrawerByStatus(drawer, drawerStatus) {
    renderDrawerButton(drawer, drawerStatus);
    setDrawerButtonEV(drawer);
    renderCategories(drawer, drawerStatus);
    updateRecentViews();
}
function renderDrawerButton(drawer, drawerStatus) {
    const openButton = document.querySelector(".drawer-button.open");
    const closeButton = document.querySelector(".drawer-button.close");
    if (openButton === null || closeButton === null) {
        throw Error("missing Drawer");
    }
    if (drawerStatus.drawer === undefined || drawerStatus.drawer === "open") {
        openButton.style.display = "none";
        drawer.classList.remove("close");
        drawer.classList.add("open");
    }
    else {
        openButton.style.display = "inline";
        drawer.classList.remove("open");
        drawer.classList.add("close");
    }
}
function setDrawerButtonEV(drawer) {
    const openButton = document.querySelector(".drawer-button.open");
    const closeButton = document.querySelector(".drawer-button.close");
    if (openButton === null || closeButton === null) {
        throw Error("missing Drawer");
    }
    openButton.onclick = () => {
        openButton.style.display = "none";
        drawer.classList.remove("close");
        drawer.classList.add("open");
        const drawerStatus = getDrawerStatus();
        drawerStatus.drawer = "open";
        sessionStorage.setItem("drawer_status", JSON.stringify(drawerStatus));
    };
    closeButton.onclick = () => {
        openButton.style.display = "inline";
        drawer.classList.remove("open");
        drawer.classList.add("close");
        const drawerStatus = getDrawerStatus();
        drawerStatus.drawer = "close";
        sessionStorage.setItem("drawer_status", JSON.stringify(drawerStatus));
    };
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
function renderCategories(drawer, drawerStatus) {
    drawer.querySelectorAll("ul.category-list > li").forEach((category) => {
        renderCategoryByStatus(category, drawerStatus);
        setCategoryButtonEV(category, drawerStatus);
    });
}
function setCategoryButtonEV(category, drawerStatus) {
    const categoryDropDown = category.querySelector("a.category-drop-down");
    const categoryLink = category.querySelector("span.category-link");
    const childCategory = category.querySelector("ul.child-category-list");
    if (categoryLink !== null) {
        categoryLink.addEventListener("click", () => {
            if (drawerStatus[categoryLink.innerText] === undefined ||
                drawerStatus[categoryLink.innerText] === "up") {
                categoryDropDown.innerText = "▼";
                childCategory.style.display = "list-item";
                drawerStatus[categoryLink.innerText] = "down";
            }
            else {
                categoryDropDown.innerText = "▶";
                childCategory.style.display = "none";
                drawerStatus[categoryLink.innerText] = "up";
            }
            sessionStorage.setItem("drawer_status", JSON.stringify(drawerStatus));
        });
    }
}
function renderCategoryByStatus(category, drawerStatus) {
    const categoryDropDown = category.querySelector("a.category-drop-down");
    if (categoryDropDown === null)
        return;
    const categoryLink = category.querySelector("span.category-link");
    const childCategory = category.querySelector("ul.child-category-list");
    if (drawerStatus[categoryLink.innerText] === undefined ||
        drawerStatus[categoryLink.innerText] === "up") {
        categoryDropDown.innerText = "▶";
        childCategory.style.display = "none";
    }
    else {
        categoryDropDown.innerText = "▼";
        childCategory.style.display = "list-item";
    }
}
//# sourceMappingURL=init_drawer.js.map