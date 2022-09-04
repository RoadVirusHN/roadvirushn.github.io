"use strict";
function hide_card(event) {
    var _a;
    var target = event.target;
    var card = (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.nextSibling;
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