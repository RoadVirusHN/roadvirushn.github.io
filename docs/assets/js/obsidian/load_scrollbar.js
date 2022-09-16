let scrollbarButton;
let progressbar;
let scrollbar;
let body;
let scrollWrapper;
let isScrollClicked = false;
const SCREENYOFFSET = window.outerHeight - document.documentElement.clientHeight;
const MAX_LENGTH = 97;
export default function loadScrollbar() {
    queryElements();
    document.addEventListener("scroll", scrollEvent);
    scrollWrapper.addEventListener("mousedown", clickScroll);
    document.addEventListener("mousemove", dragScroll);
    document.addEventListener("mouseup", reliseScroll);
}
function queryElements() {
    scrollbarButton = document.querySelector(".scrollbarButton");
    progressbar = document.querySelector(".progressbar");
    scrollbar = document.querySelector(".scrollbar");
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
    const progressPercentage = (Math.min(window.innerHeight, event.screenY - SCREENYOFFSET) /
        window.innerHeight) *
        MAX_LENGTH;
    return progressPercentage;
}
function focusScrollbarButton() {
    scrollbarButton.tabIndex = -1;
    scrollbarButton.style.outline = "none";
    scrollbarButton.focus();
}
function reliseScroll(_event) {
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
    const ScrollPos = (progressPercentage *
        (body.getBoundingClientRect().height -
            document.documentElement.clientHeight)) /
        MAX_LENGTH;
    window.scrollTo(0, ScrollPos);
}
function scrollEvent(_event) {
    const scrollDistance = -body.getBoundingClientRect().top;
    const progressPercentage = (scrollDistance /
        (body.getBoundingClientRect().height -
            document.documentElement.clientHeight)) *
        MAX_LENGTH;
    changeProgress(progressPercentage);
}
function changeProgress(progressPercentage) {
    if (progressPercentage < 0) {
        progressbar.style.height = "0%";
        scrollbarButton.style.top = "0%";
    }
    else {
        progressbar.style.height = `${progressPercentage}%`;
        scrollbarButton.style.top = `${progressPercentage}%`;
    }
}
//# sourceMappingURL=load_scrollbar.js.map