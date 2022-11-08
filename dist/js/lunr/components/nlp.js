const lunr = window.lunr;
export function stemmerEnKo(token) {
    if (token.toString().match(/[가-힣ㄱ-ㅎ]/) !== null) {
        return token;
    }
    else {
        const result = lunr.stemmer(token);
        return result;
    }
}
export function filterSyntax(str) {
    const nonSpecials = str
        .replace(/^[^\w가-힣]+/, "")
        .replace(/[^\w가-힣]+$/, "");
    if (nonSpecials === "")
        return nonSpecials;
    const nonMarkdowns = nonSpecials.replace(/.*(?:(?:\[\[)|(?:\]\])|(?:\]\()|(?:\)\[)|(?:!\[\[)|(?:\.png\))|(?:\.jpg\))).*/, "");
    if (nonMarkdowns === "")
        return nonMarkdowns;
    const noMathjax = nonMarkdowns.replace(/.*(?:(?:\$\$)|(?:\^\{\S+\})|(?:_\{\S+\})|(?:\\sum)|(?:\\frac)).*/, "");
    if (noMathjax === "")
        return noMathjax;
    return noMathjax;
}
export function trimmerEnKo(token) {
    const result = token.update(filterSyntax);
    if (result.toString() !== "" && result.toString().length > 1) {
        return result;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=nlp.js.map