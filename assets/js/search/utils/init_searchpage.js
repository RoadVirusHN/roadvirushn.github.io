import { playNoQueryAnim, replaceTagToElement, } from "../../common/components/init_searchbar.js";
import { buildTagLink } from "./build_tags";
const storedWindow = window;
function getQueryVariables() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    let query = params.get("query");
    query = query !== null ? decodeURIComponent(query.replace(/\+/g, "%20")) : "";
    let tags = params
        .get("tags")
        ?.split("|")
        .map(decodeURIComponent)
        .map((v) => v.toUpperCase())
        .filter((v) => v.match(/[^ ]/) != null);
    tags = tags !== undefined ? tags : [];
    return {
        query,
        tags,
    };
}
function displaySearchResults(queryResults, searchSetting) {
    const queryResultsDisplay = document.getElementById("query-results");
    const queryResultsTitle = queryResultsDisplay.querySelector(".query-str");
    queryResultsTitle.innerHTML = `<mark>${searchSetting.query}</mark>`;
    const queryResultList = queryResultsDisplay.querySelector(".post-list");
    const tagResultsTitle = queryResultsDisplay.querySelector(".query-tags");
    for (const tag of searchSetting.tags) {
        const tagLink = buildTagLink(tag, searchSetting.tags.includes(tag));
        tagResultsTitle.appendChild(tagLink);
    }
    if (queryResults.length > 0) {
        queryResultList.innerHTML = "";
        for (const queryResult of queryResults) {
            queryResultList.append(buildPostItem(queryResult, searchSetting.tags));
        }
    }
}
function buildPostItem(queryResult, queryTags) {
    const result = document.createElement("li");
    result.appendChild(buildPostMeta(queryResult.date));
    for (const tag of queryResult.tags) {
        result.appendChild(buildTagLink(tag, queryTags.includes(tag)));
    }
    result.appendChild(buildTitle(queryResult.titleMatchs, queryResult.title, queryResult.url));
    result.appendChild(buildExcerpt(queryResult.contentMatchs, queryResult.content));
    return result;
}
function buildExcerpt(matches, postContent) {
    const p = document.createElement("p");
    if (matches.length > 0) {
        const excerptStart = Math.max(matches[0].position[0][0] - 50, 0);
        const excerptEnd = Math.min(matches[0].position[0][0] + matches[0].position[0][1] + 150, postContent.length);
        postContent = postContent.substring(excerptStart, excerptEnd);
        for (const match of matches) {
            postContent = postContent.replaceAll(new RegExp(match.query, "gi"), (str) => `<mark>${str}</mark>`);
        }
        p.innerHTML = postContent + "...";
    }
    else {
        p.innerHTML = postContent.substring(0, 200) + "...";
    }
    return p;
}
function buildTitle(matches, postTitle, postUrl) {
    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.classList.add("post-link");
    for (const match of matches) {
        postTitle = postTitle.replaceAll(new RegExp(match.query, "gi"), (str) => `<mark>${str}</mark>`);
    }
    titleLink.innerHTML = postTitle;
    titleLink.href = postUrl;
    title.appendChild(titleLink);
    return title;
}
function buildPostMeta(date) {
    const postMeta = document.createElement("span");
    postMeta.classList.add("post-meta");
    postMeta.innerText = date;
    return postMeta;
}
function fillSearchBox(searchSetting) {
    const searchBox = document.getElementById("search-box");
    const tagHolder = document.querySelector("#tag-holder");
    searchBox.value = `${searchSetting.query}`;
    for (const tag of searchSetting.tags) {
        searchBox.value += ` #${tag}`;
    }
    searchBox.value = searchBox.value.replaceAll(/#([^# ]+)/g, replaceTagToElement(tagHolder));
    if (searchSetting.query.match(/[^ ]/) === null) {
        searchBox.value = "";
    }
    searchBox.dispatchEvent(new Event("input"));
    searchBox.dispatchEvent(new Event("focusin"));
}
function getQueryResults(searchSetting) {
    if (searchSetting.query === "")
        return queryByTags(searchSetting.tags);
    const lunrResult = searchSetting.query !== ""
        ? window.searchIndex.search(searchSetting.query)
        : [];
    const filteredLunrResult = filterTags(lunrResult, searchSetting);
    const queryResult = formQueryResults(filteredLunrResult);
    return queryResult;
}
function formQueryResults(lunrResult) {
    const queryResult = [];
    for (let i = 0; i < lunrResult.length; i++) {
        const item = storedWindow.store[lunrResult[i].ref];
        const metadata = lunrResult[i].matchData.metadata;
        const querys = Object.keys(metadata);
        const titleMatchs = [];
        const contentMatchs = [];
        for (const query of querys) {
            if (metadata[query].content !== undefined) {
                contentMatchs.push({
                    query,
                    position: metadata[query].content.position,
                });
            }
            if (metadata[query].title !== undefined) {
                titleMatchs.push({ query, position: metadata[query].title.position });
            }
        }
        queryResult.push({
            url: item.url,
            date: item.date,
            tags: item.tags.map((v) => v.toUpperCase()),
            title: item.title,
            titleMatchs,
            content: item.content,
            contentMatchs,
        });
    }
    return queryResult;
}
function queryByTags(tags) {
    const result = [];
    for (const url of Object.keys(storedWindow.store)) {
        const item = storedWindow.store[url];
        let doubleBreak = false;
        for (const tag of tags) {
            if (!item.tags.includes(tag)) {
                doubleBreak = true;
                break;
            }
        }
        if (doubleBreak)
            continue;
        result.push({
            url: item.url,
            date: item.date,
            tags: item.tags.map((v) => v.toUpperCase()),
            title: item.title,
            titleMatchs: [],
            content: item.content,
            contentMatchs: [],
        });
    }
    return result;
}
function filterTags(lunrResult, searchSetting) {
    return lunrResult.filter((result) => {
        for (const tag of searchSetting.tags) {
            if (!storedWindow.store[result.ref].tags.includes(tag.toUpperCase()))
                return false;
        }
        return true;
    });
}
export function initSearchpage() {
    const searchSetting = getQueryVariables();
    if (searchSetting.query === "" && searchSetting.tags.length === 0) {
        const postHeading = document.querySelector(".post-list-heading");
        const searchBar = document.getElementById("search-box");
        const searchWrapper = document.getElementById("search-wrapper");
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
//# sourceMappingURL=init_searchpage.js.map