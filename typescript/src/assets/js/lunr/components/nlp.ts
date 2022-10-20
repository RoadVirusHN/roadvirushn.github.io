type Token = lunr.Token;
const lunr = window.lunr;

export function stemmerEnKo(token: Token): Token {
  // todo: stemer for korean.
  if (token.toString().match(/[가-힣ㄱ-ㅎ]/) !== null) {
    return token;
  } else {
    const result = lunr.stemmer(token);
    return result;
  }
}
export function filterSyntax(str: string): string {
  const nonSpecials = str
    .replace(/^[^\w가-힣]+/, "")
    .replace(/[^\w가-힣]+$/, "");
  if (nonSpecials === "") return nonSpecials;
  const nonMarkdowns = nonSpecials.replace(
    /.*(?:(?:\[\[)|(?:\]\])|(?:\]\()|(?:\)\[)|(?:!\[\[)|(?:\.png\))|(?:\.jpg\))).*/,
    ""
  );
  if (nonMarkdowns === "") return nonMarkdowns;
  const noMathjax = nonMarkdowns.replace(
    /.*(?:(?:\$\$)|(?:\^\{\S+\})|(?:_\{\S+\})|(?:\\sum)|(?:\\frac)).*/,
    ""
  );
  if (noMathjax === "") return noMathjax;

  return noMathjax;
}
export function trimmerEnKo(token: Token): Token | null {
  const result = token.update(filterSyntax);

  if (result.toString() !== "" && result.toString().length > 1) {
    return result;
  } else {
    return null;
  }
}
