(function () {
    var _a;
    function displaySearchResults(results, store) {
        const searchResults = document.getElementById("search-results");
        if (searchResults === null) {
            throw Error("No search-results tag founded");
        }
        if (results.length !== 0) {
            let appendString = "";
            for (let i = 0; i < results.length; i++) {
                const item = store[results[i].ref];
                appendString += `<li><a href="${item.url}"><h4>${item.title}</h4></a>`;
                const query = Object.keys(results[i].matchData.metadata)[0];
                const matchPositions = results[i].matchData.metadata[query].content.position;
                const resultNum = matchPositions.length;
                const matchStart = matchPositions[0][0];
                const matchEnd = matchStart + matchPositions[0][1];
                const startPos = Math.max(matchStart - 50, 0);
                const endPos = Math.min(startPos + 150, item.content.length);
                appendString += `<p>${item.content.substring(startPos, matchStart)}<mark>${item.content.substring(matchStart, matchEnd)}</mark>${item.content.substring(matchEnd, endPos)}...</p></li>`;
                if (resultNum - 1 > 0)
                    appendString += `<p>...그리고 ${resultNum - 1}개의 추가 일치들</p>`;
            }
            searchResults.innerHTML = appendString;
        }
        else {
            searchResults.innerHTML = "<li>검색 결과가 없습니다.</li>";
        }
    }
    function getQueryVariable(variable) {
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
    (_a = document.getElementById("search-box")) === null || _a === void 0 ? void 0 : _a.setAttribute("value", searchTerm);
    const storedWindow = window;
    const idx = lunr(function () {
        this.field("id");
        this.field("title", { boost: 10 });
        this.field("content");
        this.metadataWhitelist = ["position"];
        for (const key in storedWindow.store) {
            this.add({
                id: key,
                title: storedWindow.store[key].title,
                content: storedWindow.store[key].content,
            });
        }
    });
    const results = idx.search(searchTerm);
    displaySearchResults(results, storedWindow.store);
})();
export {};
//# sourceMappingURL=search.js.map