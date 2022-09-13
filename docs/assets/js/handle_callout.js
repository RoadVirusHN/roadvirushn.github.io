"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.onload = function () {
    setCallout();
};
function setCallout() {
    const arrayOfCard = document.querySelectorAll(".callout");
    for (const callout of arrayOfCard) {
        const collapse = callout.querySelector("button.collapse");
        if (collapse === null)
            continue;
        const calloutId = callout.id;
        const card = callout.querySelector(".card");
        if (card === null || calloutId === undefined)
            throw new Error(`No card in ${calloutId !== null && calloutId !== void 0 ? calloutId : ""} here`);
        setCalloutAnim(calloutId, card);
        card.style.display = collapse.innerText === "🔼" ? "block" : "none";
    }
}
function setCalloutAnim(calloutId, card) {
    const style = document.createElement("style");
    style.id = calloutId;
    const height = card.offsetHeight;
    style.innerHTML = `\
        div#${calloutId} div.card.animate-expand {
          animation: expand-card-${calloutId} 0.3s ease-in;
        }
        div#${calloutId} div.card.animate-shirink {
          animation: shirink-card-${calloutId} 0.3s ease-in;
        }
        @keyframes expand-card-${calloutId}\
         { 0% { max-height: 0px; } 100% { max-height: ${height + 10}px; }}
        @keyframes shirink-card-${calloutId}\
        { 0% { max-height: ${height + 10}px; } 100% { max-height: 0px; }}
        `;
    document.getElementsByTagName("head")[0].appendChild(style);
}
function toggleCard(event) {
    var _a;
    const target = event.target;
    const card = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
    if (card.style.display === "none") {
        expandCallout(card);
        target.innerText = "🔼";
    }
    else {
        shirinkCallout(card);
        target.innerText = "🔽";
    }
}
function shirinkCallout(card) {
    card.classList.add("animate-shirink");
    card.addEventListener("animationend", function shirinkCard() {
        card.classList.remove("animate-shirink");
        card.removeEventListener("animationend", shirinkCard);
        card.style.display = "none";
    });
}
function expandCallout(card) {
    card.style.display = "block";
    card.classList.add("animate-expand");
    card.addEventListener("animationend", function expandCard() {
        card.classList.remove("animate-expand");
        card.removeEventListener("animationend", expandCard);
    });
}
function copyContent(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const target = event.target;
        const content = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.children.namedItem("content");
        yield navigator.clipboard.writeText(content.innerText);
        const copyDiv = (_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.querySelectorAll(".copy-check:not(.animate)");
        if (copyDiv !== undefined) {
            playCopyAnimation(copyDiv);
        }
    });
}
function playCopyAnimation(copyDiv) {
    for (const element of copyDiv) {
        element.classList.add("animate");
        element.addEventListener("animationend", () => {
            element.classList.remove("animate");
        });
    }
}
//# sourceMappingURL=handle_callout.js.map