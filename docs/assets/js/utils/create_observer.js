export default function CreateObserver(callback) {
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0.95, 0.05],
    };
    return new IntersectionObserver(callback, options);
}
//# sourceMappingURL=create_observer.js.map