const newWindow = window;
function updateRecents() {
    let recents = JSON.parse(window.localStorage.getItem("recents") ?? "[]");
    const uPath = document.querySelector(".u-path");
    const recentPath = uPath.innerText;
    if (recents.includes(recentPath)) {
        recents = recents
            .slice(0, recents.indexOf(recentPath))
            .concat(recents.slice(recents.indexOf(recentPath) + 1));
    }
    recents.push(recentPath);
    window.localStorage.setItem("recents", JSON.stringify(recents));
    for (let i = 1; i <= recents.length; i += 1) {
        const recentTitle = newWindow.store[recents[i - 1]].title;
        const recentUrl = newWindow.store[recents[i - 1]].url;
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