import lunr from "lunr";
import {
  MyMetadata,
  QueryMatchData,
  QueryResult,
  SearchSetting,
} from "../../types/search_types";
import { NewWindow } from "../../types/lunr_types";
import { playNoQueryAnim, replaceTagToElement } from "./init_searchbar.js";

const storedWindow = window as NewWindow;

function getQueryVariables(): {
  query: string;
  categories: string[];
} {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  let query = params.get("query");
  query = query !== null ? decodeURIComponent(query.replace(/\+/g, "%20")) : "";
  let categories = params
    .get("categories")
    ?.split("|")
    .map(decodeURIComponent)
    .map((v: string) => v.toUpperCase())
    .filter((v: string) => v.match(/[^ ]/) != null);
  categories = categories !== undefined ? categories : ([] as string[]);
  return {
    query,
    categories,
  };
}
function displaySearchResults(
  queryResults: QueryResult[],
  searchSetting: SearchSetting
): void {
  const queryResultsDisplay = document.getElementById(
    "query-results"
  ) as HTMLElement;
  const queryResultsTitle = queryResultsDisplay.querySelector(
    ".query-str"
  ) as HTMLElement;
  queryResultsTitle.innerHTML = `<mark>${searchSetting.query}</mark>`;

  const queryResultList = queryResultsDisplay.querySelector(
    ".post-list"
  ) as HTMLElement;

  const categoryResultsTitle = queryResultsDisplay.querySelector(
    ".query-categories"
  ) as HTMLElement;
  for (const category of searchSetting.categories) {
    const categoryLink = buildCategoryLink(
      category,
      searchSetting.categories.includes(category)
    );
    categoryResultsTitle.appendChild(categoryLink);
  }

  if (queryResults.length > 0) {
    queryResultList.innerHTML = "";
    for (const queryResult of queryResults) {
      queryResultList.append(
        buildPostItem(queryResult, searchSetting.categories)
      );
    }
  }
}

function buildPostItem(
  queryResult: QueryResult,
  queryCategories: string[]
): HTMLElement {
  const result = document.createElement("li") as HTMLElement;
  result.appendChild(buildPostMeta(queryResult.date));
  for (const category of queryResult.categories) {
    result.appendChild(
      buildCategoryLink(category, queryCategories.includes(category))
    );
  }

  result.appendChild(
    buildTitle(queryResult.titleMatchs, queryResult.title, queryResult.url)
  );
  result.appendChild(
    buildExcerpt(queryResult.contentMatchs, queryResult.content)
  );
  return result;
}

function buildExcerpt(
  matches: QueryMatchData[],
  postContent: string
): HTMLElement {
  const p = document.createElement("p");

  if (matches.length > 0) {
    const excerptStart = Math.max(matches[0].position[0][0] - 50, 0);
    const excerptEnd = Math.min(
      matches[0].position[0][0] + matches[0].position[0][1] + 150,
      postContent.length
    );

    postContent = postContent.substring(excerptStart, excerptEnd);
    for (const match of matches) {
      postContent = postContent.replaceAll(
        new RegExp(match.query, "gi"),
        (str: string) => `<mark>${str}</mark>`
      );
    }
    p.innerHTML = postContent + "...";
  } else {
    p.innerHTML = postContent.substring(0, 200) + "...";
  }
  return p;
}

function buildTitle(
  matches: QueryMatchData[],
  postTitle: string,
  postUrl: string
): HTMLElement {
  const title = document.createElement("h3") as HTMLElement;
  const titleLink = document.createElement("a");
  titleLink.classList.add("post-link");
  for (const match of matches) {
    postTitle = postTitle.replaceAll(
      new RegExp(match.query, "gi"),
      (str: string) => `<mark>${str}</mark>`
    );
  }
  titleLink.innerHTML = postTitle;
  titleLink.href = postUrl;
  title.appendChild(titleLink);
  return title;
}

function buildPostMeta(date: string): HTMLElement {
  const postMeta = document.createElement("span") as HTMLElement;
  postMeta.classList.add("post-meta");
  postMeta.innerText = date;
  return postMeta;
}

function buildCategoryLink(category: string, isEmphasis: boolean): HTMLElement {
  const categoryLink = document.createElement("a");
  categoryLink.classList.add("category-link");
  categoryLink.href = `/search.html?categories=${category}`;
  categoryLink.innerText = category;
  if (isEmphasis) {
    categoryLink.classList.add("emphasis");
  } else {
    categoryLink.style.color = storedWindow.categories[category].color;
    categoryLink.style.backgroundColor =
      storedWindow.categories[category]["background-color"];
  }
  return categoryLink;
}

function fillSearchBox(searchSetting: SearchSetting): void {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  const tagHolder = document.querySelector("#tag-holder") as HTMLInputElement;
  searchBox.value = `${searchSetting.query}`;
  for (const category of searchSetting.categories) {
    searchBox.value += ` #${category}`;
  }
  searchBox.value = searchBox.value.replaceAll(
    /#([^# ]+)/g,
    replaceTagToElement(tagHolder)
  );
  if (searchSetting.query.match(/[^ ]/) === null) {
    searchBox.value = "";
  }
  searchBox.dispatchEvent(new Event("input"));
  searchBox.dispatchEvent(new Event("focusin"));
}
function getQueryResults(searchSetting: SearchSetting): QueryResult[] {
  if (searchSetting.query === "")
    return queryByCategories(searchSetting.categories);

  const lunrResult =
    searchSetting.query !== ""
      ? window.searchIndex.search(searchSetting.query) // Get lunr to perform a search
      : ([] as lunr.Index.Result[]);

  const filteredLunrResult = filterCategories(lunrResult, searchSetting);
  const queryResult = formQueryResults(filteredLunrResult);
  return queryResult;
}

function formQueryResults(lunrResult: lunr.Index.Result[]): QueryResult[] {
  const queryResult = [];
  for (let i = 0; i < lunrResult.length; i++) {
    const item = storedWindow.store[lunrResult[i].ref];
    const metadata = lunrResult[i].matchData.metadata as MyMetadata;
    const querys = Object.keys(metadata);
    const titleMatchs = [];
    const contentMatchs = [];
    for (const query of querys) {
      if (metadata[query].content !== undefined) {
        contentMatchs.push({
          query,
          position: metadata[query].content!.position,
        });
      }
      if (metadata[query].title !== undefined) {
        titleMatchs.push({ query, position: metadata[query].title!.position });
      }
    }
    queryResult.push({
      url: item.url,
      date: item.date,
      categories: item.categories.map((v: string) => v.toUpperCase()),
      title: item.title,
      titleMatchs,
      content: item.content,
      contentMatchs,
    });
  }
  return queryResult;
}

function queryByCategories(categories: string[]): QueryResult[] {
  const result = [];
  for (const url of Object.keys(storedWindow.store)) {
    const item = storedWindow.store[url];
    let doubleBreak = false;
    for (const category of categories) {
      if (!item.categories.includes(category)) {
        doubleBreak = true;
        break;
      }
    }
    if (doubleBreak) continue;
    result.push({
      url,
      date: item.date,
      categories: item.categories.map((v: string) => v.toUpperCase()),
      title: item.title,
      titleMatchs: [],
      content: item.content,
      contentMatchs: [],
    });
  }
  return result;
}

function filterCategories(
  lunrResult: lunr.Index.Result[],
  searchSetting: SearchSetting
): lunr.Index.Result[] {
  return lunrResult.filter((result) => {
    for (const category of searchSetting.categories) {
      if (
        !storedWindow.store[result.ref].categories.includes(
          category.toUpperCase()
        )
      )
        return false;
    }
    return true;
  });
}

function initSearchpage(): void {
  const searchSetting = getQueryVariables();
  if (searchSetting.query === "" && searchSetting.categories.length === 0) {
    const postHeading = document.querySelector(
      ".post-list-heading"
    ) as HTMLElement;
    const searchBar = document.getElementById("search-box") as HTMLInputElement;
    const searchWrapper = document.getElementById(
      "search-wrapper"
    ) as HTMLElement;
    postHeading.innerHTML = "You entered No Query!";
    postHeading.style.color = "red";
    postHeading.style.fontSize = "xx-large";
    playNoQueryAnim(searchBar, searchWrapper);
    return;
  }
  fillSearchBox(searchSetting);

  const queryResults = getQueryResults(searchSetting);
  displaySearchResults(queryResults, searchSetting);
}

initSearchpage();
