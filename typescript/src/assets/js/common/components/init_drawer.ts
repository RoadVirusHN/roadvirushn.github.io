import { buildTagLink } from "../../search/utils/build_tags";
import { NewWindow } from "../../types/lunr_types";
import { CategoryInfo } from "../../types/search_types";

const newWindow = window as NewWindow;
export default function initDrawer(): void {
  const drawer = document.getElementById("drawer");

  if (drawer === null) {
    throw Error("missing Drawer");
  }

  setButtonEvent(drawer);

  setCategories();

  updateRecentViews();
}

function setButtonEvent(drawer: HTMLElement): void {
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
    drawer.classList.add("open");
    drawer.classList.remove("close");
  };
  closeButton.onclick = () => {
    openButton.style.display = "inline";
    drawer.classList.add("close");
    drawer.classList.remove("open");
  };
}

function setCategories(): void {
  const categories = document.querySelector(
    ".drawer-content > .drawer-posts > .categories"
  ) as HTMLElement;
  if (categories === null) {
    throw Error("missing categories");
  }
  for (const category of categories.querySelectorAll(
    "ul.category-list>li>h4"
  )) {
    category.addEventListener("click", (e: Event) => {
      const eventTarget = e.target as HTMLElement;
      changePageToPostList(
        eventTarget.innerText,
        newWindow.categories.categories[eventTarget.innerText]
      );
    });
  }
}

function changePageToPostList(
  categoryName: string,
  categoryInfo: CategoryInfo
): void {
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
    folderAnchor.innerHTML = `📂 <strong>${category}</strong>(📄: ${
      categoryInfo.categories[category].posts.length
    }, 📂: ${
      Object.keys(categoryInfo.categories[category].categories).length
    })`;
    folderTitle.appendChild(folderAnchor);
    folderItem.appendChild(folderTitle);
    postList.appendChild(folderItem);
  }

  for (const post of categoryInfo.posts) {
    const postItem = document.createElement("li");
    const postMeta = document.createElement("span");
    postMeta.classList.add("post-meta");
    postMeta.innerText = newWindow.store[post].date;
    postItem.appendChild(postMeta);
    for (const tag of newWindow.store[post].tags) {
      const tagLink = buildTagLink(tag, false);
      postItem.appendChild(tagLink);
    }
    const postTitle = document.createElement("h3");
    const postLink = document.createElement("a");
    postLink.classList.add("post-link");
    postLink.href = newWindow.store[post].url;
    postLink.innerText = newWindow.store[post].title;
    postTitle.appendChild(postLink);
    postItem.appendChild(postTitle);
    postList.appendChild(postItem);
  }
  newDivHome.appendChild(postList);
  const wrapper = document.querySelector(
    "main.page-content div.wrapper"
  ) as HTMLElement;
  const oldDivHome = wrapper.querySelector("div.home");
  if (oldDivHome !== null) wrapper?.removeChild(oldDivHome);
  wrapper?.appendChild(newDivHome);
}

export function updateRecentViews(): void {
  const recents = JSON.parse(
    window.localStorage.getItem("recents") ?? "[]"
  ) as string[];

  for (let i = 1; i <= recents.length; i += 1) {
    const recentTitle = newWindow.store[recents[i - 1]].title;
    const recentUrl = newWindow.store[recents[i - 1]].url;

    const targetAnchor = document.querySelector(
      `a#recent-${recents.length + 1 - i}`
    ) as HTMLAnchorElement;
    targetAnchor.innerText = recentTitle;
    targetAnchor.href = recentUrl;
  }
}
