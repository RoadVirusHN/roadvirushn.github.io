/* eslint-disable @typescript-eslint/no-unused-vars */
function hideCard(event: PointerEvent): void {
  const target = event.target as HTMLElement;
  const card = target.parentElement?.nextElementSibling as HTMLElement;
  if (card === undefined)
    throw new Error(`No card in ${target.parentElement?.innerText ?? ""} here`);

  if (card.style.display === "none") {
    card.style.display = "block";
    target.innerText = "🔼";
  } else {
    card.style.display = "none";
    target.innerText = "🔽";
  }
}

async function copyContent(event: PointerEvent): Promise<void> {
  const target = event.target as HTMLElement;
  const content = target.parentElement?.children.namedItem(
    "content"
  ) as HTMLElement;

  await navigator.clipboard.writeText(content.innerText);
  target.innerText = "✅";
  (target.nextElementSibling as HTMLElement).style.visibility = "";
  setTimeout(() => {
    target.innerText = "📋";
  }, 500);
}
