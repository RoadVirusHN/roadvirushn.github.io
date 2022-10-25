let scrollbarButton;
let progressbar;
let body;
let scrollWrapper;
let isScrollClicked = false;
export default function initScrollbar() {
    queryElements();
    setScrollbarLength();
    document.addEventListener("scroll", scrollEvent);
    scrollWrapper.addEventListener("mousedown", clickScroll);
    document.addEventListener("mousemove", dragScroll);
    document.addEventListener("mouseup", releseScroll);
}
function setScrollbarLength() {
    const screenArticleRatio = window.innerHeight /
        document.documentElement.getBoundingClientRect().height;
    if (screenArticleRatio >= 1) {
        scrollWrapper.style.display = "none";
    }
    else {
        const startProgress = `${screenArticleRatio * window.innerHeight}px`;
        scrollbarButton.style.height = startProgress;
        scrollbarButton.style.top = `${(screenArticleRatio * window.innerHeight) / 2}px`;
    }
}
function queryElements() {
    scrollbarButton = document.querySelector(".scrollbarButton");
    progressbar = document.querySelector(".progressbar");
    scrollWrapper = document.querySelector(".scrollWrapper");
    body = document.querySelector("body");
}
function clickScroll(event) {
    scrollbarButton.classList.add("no-animation");
    progressbar.classList.add("no-animation");
    isScrollClicked = true;
    const progressPercentage = getProgress(event);
    focusScrollbarButton();
    changeProgress(progressPercentage);
    moveScreenYTo(progressPercentage);
}
function getProgress(event) {
    event.preventDefault();
    const progressPercentage = Math.min(event.clientY / window.innerHeight, 1);
    return progressPercentage;
}
function focusScrollbarButton() {
    scrollbarButton.tabIndex = -1;
    scrollbarButton.style.outline = "none";
    scrollbarButton.focus();
}
function releseScroll(_event) {
    scrollbarButton.classList.remove("no-animation");
    progressbar.classList.remove("no-animation");
    isScrollClicked = false;
    outfocusScrollbarButton();
}
function outfocusScrollbarButton() {
    if (document.activeElement === scrollbarButton) {
        document.activeElement.blur();
    }
}
function dragScroll(event) {
    if (isScrollClicked) {
        const progressPercentage = getProgress(event);
        changeProgress(progressPercentage);
        moveScreenYTo(progressPercentage);
    }
}
function moveScreenYTo(progressPercentage) {
    const ScrollPos = progressPercentage *
        (body.getBoundingClientRect().height -
            document.documentElement.clientHeight);
    window.scrollTo(0, ScrollPos);
}
function scrollEvent(_event) {
    const scrollDistance = -body.getBoundingClientRect().top;
    const progressPercentage = scrollDistance /
        (body.getBoundingClientRect().height -
            document.documentElement.clientHeight);
    changeProgress(progressPercentage);
}
function changeProgress(progressPercentage) {
    const clampedVal = `calc(100% * ${progressPercentage} - ${scrollbarButton.style.height} * ${progressPercentage} + ${scrollbarButton.style.height}/2)`;
    progressbar.style.height = `clamp(${scrollbarButton.style.height}/2,${clampedVal},calc(100% - ${scrollbarButton.style.height}/2))`;
    scrollbarButton.style.top = `clamp(${scrollbarButton.style.height}/2,${clampedVal},calc(100% - ${scrollbarButton.style.height}/2))`;
}
//# sourceMappingURL=init_scrollbar.js.map