let scrollbarButton: HTMLElement;
let progressbar: HTMLElement;
let scrollbar: HTMLElement;
let body: HTMLElement;
let scrollWrapper: HTMLElement;
let isScrollClicked = false;

const SCREENYOFFSET =
  window.outerHeight - document.documentElement.clientHeight;
const MAX_LENGTH = 97;

export default function loadScrollbar(): void {
  queryElements();
  document.addEventListener("scroll", scrollEvent);
  scrollWrapper.addEventListener("mousedown", clickScroll);
  document.addEventListener("mousemove", dragScroll);
  document.addEventListener("mouseup", reliseScroll);
}

function queryElements(): void {
  scrollbarButton = document.querySelector(".scrollbarButton") as HTMLElement;
  progressbar = document.querySelector(".progressbar") as HTMLElement;
  scrollbar = document.querySelector(".scrollbar") as HTMLElement;
  scrollWrapper = document.querySelector(".scrollWrapper") as HTMLElement;
  body = document.querySelector("body") as HTMLElement;
}

function clickScroll(event: MouseEvent): void {
  scrollbarButton.classList.add("no-animation");
  progressbar.classList.add("no-animation");
  isScrollClicked = true;
  const progressPercentage = getProgress(event);
  focusScrollbarButton();
  changeProgress(progressPercentage);
  moveScreenYTo(progressPercentage);
}

function getProgress(event: MouseEvent): number {
  event.preventDefault();
  const progressPercentage =
    (Math.min(window.innerHeight, event.screenY - SCREENYOFFSET) /
      window.innerHeight) *
    MAX_LENGTH;
  return progressPercentage;
}

function focusScrollbarButton(): void {
  scrollbarButton.tabIndex = -1;
  scrollbarButton.style.outline = "none";
  scrollbarButton.focus();
}

function reliseScroll(_event: MouseEvent): void {
  scrollbarButton.classList.remove("no-animation");
  progressbar.classList.remove("no-animation");
  isScrollClicked = false;
  outfocusScrollbarButton();
}

function outfocusScrollbarButton(): void {
  if (document.activeElement === scrollbarButton) {
    (document.activeElement as HTMLElement).blur();
  }
}

function dragScroll(event: MouseEvent): void {
  if (isScrollClicked) {
    const progressPercentage = getProgress(event);
    changeProgress(progressPercentage);
    moveScreenYTo(progressPercentage);
  }
}

function moveScreenYTo(progressPercentage: number): void {
  const ScrollPos =
    (progressPercentage *
      (body.getBoundingClientRect().height -
        document.documentElement.clientHeight)) /
    MAX_LENGTH;
  window.scrollTo(0, ScrollPos);
}

function scrollEvent(_event: Event): void {
  const scrollDistance = -body.getBoundingClientRect().top;
  const progressPercentage =
    (scrollDistance /
      (body.getBoundingClientRect().height -
        document.documentElement.clientHeight)) *
    MAX_LENGTH;

  changeProgress(progressPercentage);
}

function changeProgress(progressPercentage: number): void {
  if (progressPercentage < 0) {
    progressbar.style.height = "0%";
    scrollbarButton.style.top = "0%";
  } else {
    progressbar.style.height = `${progressPercentage}%`;
    scrollbarButton.style.top = `${progressPercentage}%`;
  }
}
