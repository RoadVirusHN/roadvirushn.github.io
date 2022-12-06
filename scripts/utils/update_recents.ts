import { RecentPageInfo } from "../types/storage_types";

function updateRecents(): void {
  let recents = JSON.parse(
    window.localStorage.getItem("recents") ?? "[]"
  ) as RecentPageInfo[];
  const Title = document.querySelector(
    "h1.article-title.a-name"
  ) as HTMLElement;
  const recentTitle = Title.innerText;
  const uUrl = document.querySelector(".u-url") as HTMLAnchorElement;

  const recentUrl = uUrl.href;
  const recentInfo = { title: recentTitle, url: recentUrl };
  const isAlreadySeen = recents.map(
    (e) => e.title === recentTitle && e.url === recentUrl
  );

  if (isAlreadySeen.includes(true)) {
    recents = recents
      .slice(0, isAlreadySeen.indexOf(true))
      .concat(recents.slice(isAlreadySeen.indexOf(true) + 1));
  }
  recents.push(recentInfo);

  if (recents.length > 5) {
    recents.shift();
  }
  window.localStorage.setItem("recents", JSON.stringify(recents));

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

if (window.location === window.parent.location) {
  setTimeout(updateRecents, 0);
}
