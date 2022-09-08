"use strict";
function hide_card(event) {
    var _a, _b;
    var target = event.target;
    var card = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
    if (!card)
        throw new Error(`No card in ${(_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.innerText} here`);
    if (card.style.display == "none") {
        card.style.display = "block";
        target.innerText = "🔼";
    }
    else {
        card.style.display = "none";
        target.innerText = "🔽";
    }
}
function copy_content(event) {
    var _a;
    var target = event.target;
    var content = (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.children.namedItem("content");
    navigator.clipboard.writeText(content.innerText);
    target.innerText = "✅";
    setTimeout(() => { target.innerText = "📋"; }, 500);
}
//# sourceMappingURL=handle_callout.js.map