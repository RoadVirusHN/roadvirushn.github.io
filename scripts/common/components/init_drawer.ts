import { RecentPageInfo } from "../../types/storage_types";

interface drawerStatus {
  [setting: string]: string;
}

export default function initDrawer(): void {
  const drawer = document.getElementById("drawer");
  if (drawer === null) {
    throw Error("missing Drawer");
  }
  const drawerStatus: drawerStatus = getDrawerStatus();
  renderDrawerByStatus(drawer, drawerStatus);
}

function getDrawerStatus(): drawerStatus {
  const drawerStatusString = sessionStorage.getItem("drawer_status");
  let drawerStatus: drawerStatus;
  if (drawerStatusString == null) {
    drawerStatus = {};
  } else {
    drawerStatus = JSON.parse(drawerStatusString) as drawerStatus;
  }
  return drawerStatus;
}

function renderDrawerByStatus(
  drawer: HTMLElement,
  drawerStatus: drawerStatus
): void {
  renderDrawerButton(drawer, drawerStatus);
  setDrawerButtonEV(drawer);
  renderCategories(drawer, drawerStatus);
  updateRecentViews();
}

function renderDrawerButton(
  drawer: HTMLElement,
  drawerStatus: drawerStatus
): void {
  const openButton = document.querySelector(
    ".drawer-button.open"
  ) as HTMLElement;
  const closeButton = document.querySelector(
    ".drawer-button.close"
  ) as HTMLElement;
  if (openButton === null || closeButton === null) {
    throw Error("missing Drawer");
  }
  if (drawerStatus.drawer === undefined || drawerStatus.drawer === "open") {
    openButton.style.display = "none";
    drawer.classList.remove("close");
    drawer.classList.add("open");
  } else {
    openButton.style.display = "inline";
    drawer.classList.remove("open");
    drawer.classList.add("close");
  }
}

function setDrawerButtonEV(drawer: HTMLElement): void {
  const openButton = document.querySelector(
    ".drawer-button.open"
  ) as HTMLElement;
  const closeButton = document.querySelector(
    ".drawer-button.close"
  ) as HTMLElement;
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

export function updateRecentViews(): void {
  const recents = JSON.parse(
    window.localStorage.getItem("recents") ?? "[]"
  ) as RecentPageInfo[];

  for (let i = 1; i <= recents.length; i += 1) {
    const info = recents[i - 1];
    const recentTitle = info.title;
    const recentUrl = info.url;

    const targetAnchor = document.querySelector(
      `a#recent-${recents.length + 1 - i}`
    ) as HTMLAnchorElement;
    targetAnchor.innerText = recentTitle;
    targetAnchor.href = recentUrl;
  }
}

function renderCategories(
  drawer: HTMLElement,
  drawerStatus: drawerStatus
): void {
  drawer.querySelectorAll("ul.category-list > li").forEach((category) => {
    renderCategoryByStatus(category as HTMLElement, drawerStatus);
    setCategoryButtonEV(category as HTMLElement, drawerStatus);
  });
}

function setCategoryButtonEV(
  category: HTMLElement,
  drawerStatus: drawerStatus
): void {
  const categoryDropDown = category.querySelector(
    "span.category-drop-down"
  ) as HTMLElement;
  const categoryLink = category.querySelector(
    "a.category-link"
  ) as HTMLAnchorElement;
  const childCategory = category.querySelector(
    "ul.child-category-list"
  ) as HTMLUListElement;
  if (categoryDropDown !== null) {
    categoryDropDown.addEventListener("click", (e) => {
      const button = e.target as HTMLElement;
      if (
        drawerStatus[categoryLink.innerText] === undefined ||
        drawerStatus[categoryLink.innerText] === "up"
      ) {
        button.innerText = "▼";
        childCategory.style.display = "list-item";
        drawerStatus[categoryLink.innerText] = "down";
      } else {
        button.innerText = "▶";
        childCategory.style.display = "none";
        drawerStatus[categoryLink.innerText] = "up";
      }
      sessionStorage.setItem("category_status", JSON.stringify(drawerStatus));
    });
  }
}

function renderCategoryByStatus(
  category: HTMLElement,
  drawerStatus: drawerStatus
): void {
  const categoryDropDown = category.querySelector(
    "span.category-drop-down"
  ) as HTMLElement;
  if (categoryDropDown === null) return;
  const categoryLink = category.querySelector(
    "a.category-link"
  ) as HTMLAnchorElement;
  const childCategory = category.querySelector(
    "ul.child-category-list"
  ) as HTMLUListElement;

  if (
    drawerStatus[categoryLink.innerText] === undefined ||
    drawerStatus[categoryLink.innerText] === "up"
  ) {
    categoryDropDown.innerText = "▶";
    childCategory.style.display = "none";
  } else {
    categoryDropDown.innerText = "▼";
    childCategory.style.display = "list-item";
  }
}
