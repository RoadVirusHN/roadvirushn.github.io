let scrollbarButton: HTMLElement;
let progressbar: HTMLElement;
let body: HTMLElement;
let scrollWrapper: HTMLElement;
let isScrollClicked = false;

export default function initScrollbar(): void {
  queryElements();
  setScrollbarLength();
  document.addEventListener("scroll", scrollEvent);
  scrollWrapper.addEventListener("mousedown", clickScroll);
  document.addEventListener("mousemove", dragScroll);
  document.addEventListener("mouseup", releseScroll);
}

function setScrollbarLength(): void {
  const screenArticleRatio =
    window.innerHeight /
    document.documentElement.getBoundingClientRect().height;

  if (screenArticleRatio >= 1) {
    scrollWrapper.style.display = "none";
  } else {
    const startProgress = `${screenArticleRatio * window.innerHeight}px`;
    scrollbarButton.style.height = startProgress;
    scrollbarButton.style.top = `${
      (screenArticleRatio * window.innerHeight) / 2
    }px`;
  }
}

function queryElements(): void {
  scrollbarButton = document.querySelector(".scrollbarButton") as HTMLElement;
  progressbar = document.querySelector(".progressbar") as HTMLElement;
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

  const progressPercentage = Math.min(event.clientY / window.innerHeight, 1);
  return progressPercentage;
}

function focusScrollbarButton(): void {
  scrollbarButton.tabIndex = -1;
  scrollbarButton.style.outline = "none";
  scrollbarButton.focus();
}

function releseScroll(_event: MouseEvent): void {
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
    progressPercentage *
    (body.getBoundingClientRect().height -
      document.documentElement.clientHeight);
  window.scrollTo(0, ScrollPos);
}

function scrollEvent(_event: Event): void {
  const scrollDistance = -body.getBoundingClientRect().top;
  const progressPercentage =
    scrollDistance /
    (body.getBoundingClientRect().height -
      document.documentElement.clientHeight);

  changeProgress(progressPercentage);
}

function changeProgress(progressPercentage: number): void {
  const clampedVal = `calc(100% * ${progressPercentage} - ${scrollbarButton.style.height} * ${progressPercentage} + ${scrollbarButton.style.height}/2)`;
  progressbar.style.height = `clamp(${scrollbarButton.style.height}/2,${clampedVal},calc(100% - ${scrollbarButton.style.height}/2))`;
  scrollbarButton.style.top = `clamp(${scrollbarButton.style.height}/2,${clampedVal},calc(100% - ${scrollbarButton.style.height}/2))`;
}
