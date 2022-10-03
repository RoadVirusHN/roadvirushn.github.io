"use strict";
let url = "https://luminous-bubblegum-8e9be4.netlify.app";
if (window.location.href.match(url) === null &&
    window.sessionStorage.getItem("refused") === null) {
    const redirection = document.querySelector(".redirection");
    const headTo = redirection.querySelector(".to");
    const counter = redirection.querySelector(".counter");
    const cancle = redirection.querySelector(".cancle");
    const overlay = document.querySelector(".overlay");
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
    headTo.innerText = `${url.slice(0, 30)}...`;
    headTo.href = url;
    redirection.classList.add("show");
    overlay.classList.add("show");
    let timer = 10;
    const countDown = setInterval(() => {
        counter.innerText = `${timer}`;
        timer -= 1;
        if (timer < 0) {
            const match = window.location.href.match(/:\/\/[^/]+(\/.+)/);
            redirection.classList.remove("show");
            overlay.classList.remove("show");
            if (match !== null && match.length > 1) {
                url = url + match[1];
            }
            window.location.replace(url);
        }
    }, 1000);
    cancle.onclick = () => {
        clearInterval(countDown);
        body.style.overflow = "visible";
        window.sessionStorage.setItem("refused", "1");
        redirection.classList.remove("show");
        overlay.classList.remove("show");
    };
}
//# sourceMappingURL=redirection.js.map