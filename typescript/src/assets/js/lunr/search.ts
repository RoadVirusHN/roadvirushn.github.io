import { SearchData, MyMetadata, NewWindow } from "./lunr_types";

import * as glob from "glob";
import * as path from "path";
import * as yaml from "js-yaml";
import * as string from "string";

const lunr = window.lunr;
type Token = lunr.Token;

function displaySearchResults(
  results: lunr.Index.Result[],
  store: SearchData
): void {
  const searchResults = document.getElementById("search-results");
  if (searchResults === null) {
    throw Error("No search-results tag founded");
  }
  if (results.length !== 0) {
    // Are there any results?
    let appendString = "";

    for (let i = 0; i < results.length; i++) {
      // Iterate over the results
      const item = store[results[i].ref];
      const metadata = results[i].matchData.metadata as MyMetadata;
      const query = Object.keys(metadata)[0];
      if (metadata[query].content !== undefined) {
        appendString += `<li><a href="${item.url}"><h4>${item.title}</h4></a>`;
        const matchPositions = metadata[query].content.position;
        const resultNum = matchPositions.length;
        const matchStart = matchPositions[0][0];
        const matchEnd = matchStart + matchPositions[0][1];
        const startPos = Math.max(matchStart - 50, 0);
        const endPos = Math.min(startPos + 150, item.content.length);
        appendString += `<p>${item.content.substring(
          startPos,
          matchStart
        )}<mark>${item.content.substring(
          matchStart,
          matchEnd
        )}</mark>${item.content.substring(matchEnd, endPos)}...</p></li>`;
        if (resultNum - 1 > 0)
          appendString += `<p>...그리고 ${resultNum - 1}개의 추가 일치들</p>`;
      } else {
        const matchPositions = metadata[query].title.position;
        const matchStart = matchPositions[0][0];
        const matchEnd = matchStart + matchPositions[0][1];
        const startPos = 0;
        const endPos = item.title.length;

        appendString += `<li><a href="${item.url}"><h4>${item.title.substring(
          startPos,
          matchStart
        )}<mark>${item.title.substring(
          matchStart,
          matchEnd
        )}</mark>${item.title.substring(matchEnd, endPos)}</h4></a>`;
      }
    }
    searchResults.innerHTML = appendString;
  } else {
    searchResults.innerHTML = "<li>검색 결과가 없습니다.</li>";
  }
}

function getQueryVariable(variable: string): string {
  const query = window.location.search.substring(1);
  const vars = query.split("&");

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
    }
  }
  throw new Error("no search query detected");
}

function stemmerEnKo(token: Token): Token {
  if (token.toString().match(/[가-힣ㄱ-ㅎ]/) !== null) {
    return token;
  } else {
    const result = lunr.stemmer(token);
    return result;
  }
}

function trimmerEnKo(token: Token): Token | null {
  const result = token.update(function (str) {
    const nonSpecials = str
      .replace(/^[^\w가-힣]+/, "")
      .replace(/[^\w가-힣]+$/, "");
    if (nonSpecials === "") return nonSpecials;
    const nonMarkdowns = nonSpecials.replace(
      /.*(?:(?:\[\[)|(?:\]\])|(?:\]\()|(?:\)\[)|(?:\!\[\[)|(?:\.png\))|(?:\.jpg\))).*/,
      ""
    );
    if (nonMarkdowns === "") return nonMarkdowns;
    const noMathjax = nonMarkdowns.replace(
      /.*(?:(?:\$\$)|(?:\^\{\S+\})|(?:\_\{\S+\})|(?:\\sum)|(?:\\frac)).*/,
      ""
    );
    if (noMathjax === "") return noMathjax;

    return noMathjax;
  });

  if (result.toString() !== "" && result.toString().length > 1) {
    return result;
  } else {
    return null;
  }
}

// function conditionalEnKoStemmer();

const searchTerm = getQueryVariable("query");

document.getElementById("search-box")?.setAttribute("value", searchTerm);
// Initalize lunr with the fields it will be searching on. I've given title
// a boost of 10 to indicate matches on this field are more important.
const storedWindow = window as NewWindow;

const idx = lunr(function () {
  lunr.Pipeline.registerFunction(trimmerEnKo, "trimmerEnKo");
  lunr.Pipeline.registerFunction(stemmerEnKo, "stemmerEnKo");

  this.pipeline.reset();
  this.pipeline.add(trimmerEnKo, stemmerEnKo); // delete stopwordfilter for querying stopwords.

  this.searchPipeline.reset();
  this.searchPipeline.add(trimmerEnKo, stemmerEnKo);
  this.field("id");
  this.field("title", { boost: 10 });
  this.field("content");
  this.metadataWhitelist = ["position"];

  for (const key in storedWindow.store) {
    // Add the data to lunr
    this.add({
      id: key,
      title: storedWindow.store[key].title,
      content: storedWindow.store[key].content,
    });
  }
});
const results = idx.search(searchTerm); // Get lunr to perform a search
displaySearchResults(results, storedWindow.store); // We'll write this in the next section
