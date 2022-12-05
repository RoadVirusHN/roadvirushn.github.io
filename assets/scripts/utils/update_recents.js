function updateRecents() {
    let recents = JSON.parse(window.localStorage.getItem("recents") ?? "[]");
    const Title = document.querySelector("h1.article-title.a-name");
    const recentTitle = Title.innerText;
    const uUrl = document.querySelector(".u-url");
    const recentUrl = uUrl.href;
    const recentInfo = { title: recentTitle, url: recentUrl };
    const isAlreadySeen = recents.map((e) => e.title === recentTitle && e.url === recentUrl);
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
        const targetAnchor = document.querySelector(`a#recent-${recents.length + 1 - i}`);
        targetAnchor.innerText = recentTitle;
        targetAnchor.href = recentUrl;
    }
}
if (window.location === window.parent.location) {
    setTimeout(updateRecents, 0);
}
export {};
//# sourceMappingURL=update_recents.js.map