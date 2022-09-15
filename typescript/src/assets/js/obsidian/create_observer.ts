export default function CreateObserver(
  callback: IntersectionObserverCallback
): IntersectionObserver {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: [0.95, 0.05],
  };
  return new IntersectionObserver(callback, options);
}
