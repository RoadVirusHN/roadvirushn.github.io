var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default function loadCallout() {
    const arrayOfCallout = document.querySelectorAll(".callout");
    for (const callout of arrayOfCallout) {
        const collapse = callout.querySelector("button.collapse");
        if (collapse === null)
            continue;
        const calloutId = callout.id;
        const card = callout.querySelector(".card");
        if (card === null || calloutId === undefined)
            throw new Error(`No card in ${calloutId !== null && calloutId !== void 0 ? calloutId : ""} here`);
        const copyButton = card.querySelector(".copy");
        setCalloutAnim(calloutId, card);
        card.style.display = collapse.innerText === "🔼" ? "block" : "none";
        collapse.addEventListener("click", toggleCard);
        copyButton.addEventListener("click", copyContent);
    }
}
function setCalloutAnim(calloutId, card) {
    var _a;
    const style = document.createElement("style");
    style.id = calloutId;
    const randomId = calloutId + Math.random().toString(16).slice(2);
    const height = card.offsetHeight;
    style.innerHTML = `\
        div#${calloutId} div.card.animate-expand {
          animation: expand-card-${randomId} 0.5s ease-out;
        }
        div#${calloutId} div.card.animate-shirink {
          animation: shirink-card-${randomId} 0.5s ease-out;
        }
        @keyframes expand-card-${randomId}\
         { 0% { max-height: 0px; } 100% { max-height: ${height + 10}px; }}
        @keyframes shirink-card-${randomId}\
        { 0% { max-height: ${height + 10}px; } 100% { max-height: 0px; }}
        `;
    (_a = document.querySelector("article.post")) === null || _a === void 0 ? void 0 : _a.appendChild(style);
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
    card.style.overflow = "hidden";
    card.addEventListener("animationend", function shirinkCard() {
        card.classList.remove("animate-shirink");
        card.removeEventListener("animationend", shirinkCard);
        card.style.display = "none";
    });
}
function expandCallout(card) {
    card.style.overflow = "hidden";
    card.style.display = "block";
    card.classList.add("animate-expand");
    card.addEventListener("animationend", function expandCard() {
        card.classList.remove("animate-expand");
        card.removeEventListener("animationend", expandCard);
        card.style.overflow = "visible";
    });
}
function copyContent(event) {
    var _a, _b;
    const target = event.target;
    const content = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.children.namedItem("content");
    void (() => __awaiter(this, void 0, void 0, function* () {
        yield navigator.clipboard.writeText(content.innerText);
    }))();
    const copyDiv = (_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.querySelectorAll(".copy-check:not(.animate)");
    if (copyDiv !== undefined) {
        playCopyAnimation(copyDiv);
    }
}
function playCopyAnimation(copyDiv) {
    for (const element of copyDiv) {
        element.classList.add("animate");
        element.addEventListener("animationend", () => {
            element.classList.remove("animate");
        });
    }
}
//# sourceMappingURL=load_callout.js.map