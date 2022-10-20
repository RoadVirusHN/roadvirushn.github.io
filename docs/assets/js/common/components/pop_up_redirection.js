"use strict";
function popUpRedirection() {
    let pluginSupportedURL = "https://luminous-bubblegum-8e9be4.netlify.app";
    if (window.location.href.match(pluginSupportedURL) === null &&
        window.sessionStorage.getItem("refused") === null) {
        const redirection = document.querySelector(".redirection");
        const headTo = redirection.querySelector(".to");
        const counter = redirection.querySelector(".counter");
        const cancle = redirection.querySelector(".cancle");
        const overlay = document.querySelector(".overlay");
        const body = document.querySelector("body");
        body.style.overflow = "hidden";
        headTo.innerText = `${pluginSupportedURL.slice(0, 30)}...`;
        headTo.href = pluginSupportedURL;
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
                    pluginSupportedURL = pluginSupportedURL + match[1];
                }
                window.location.replace(pluginSupportedURL);
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
}
popUpRedirection();
//# sourceMappingURL=pop_up_redirection.js.map