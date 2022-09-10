import { SearchData, MyMetadata, NewWindow } from "./lunr_types";

(function () {
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
        appendString += `<li><a href="${item.url}"><h4>${item.title}</h4></a>`;
        const query = Object.keys(
          results[i].matchData.metadata as MyMetadata
        )[0];
        const matchPositions = (results[i].matchData.metadata as MyMetadata)[
          query
        ].content.position;
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

  const searchTerm = getQueryVariable("query");

  document.getElementById("search-box")?.setAttribute("value", searchTerm);
  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  const storedWindow = window as NewWindow;

  // @ts-expect-error; Get lunr function from html script tag.
  const idx = lunr(function () {
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
})();
