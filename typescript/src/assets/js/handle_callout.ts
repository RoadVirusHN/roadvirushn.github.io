/* eslint-disable @typescript-eslint/no-unused-vars */
function toggleCard(event: PointerEvent): void {
  const target = event.target as HTMLElement;
  const card = target.parentElement?.nextElementSibling as HTMLElement;
  if (card === undefined)
    throw new Error(`No card in ${target.parentElement?.innerText ?? ""} here`);

  if (card.style.display === "none") {
    expandCallout(card);
    target.innerText = "🔼";
  } else {
    shirinkCallout(card);
    target.innerText = "🔽";
  }
}

function shirinkCallout(card: HTMLElement): void {
  card.classList.add("animate-shirink");
  card.addEventListener("animationend", function shirinkCard() {
    card.classList.remove("animate-shirink");
    card.removeEventListener("animationend", shirinkCard);
    card.style.display = "none";
  });
}

function expandCallout(card: HTMLElement): void {
  card.style.display = "block";
  card.classList.add("animate-expand");
  card.addEventListener("animationend", function expandCard() {
    card.classList.remove("animate-expand");
    card.removeEventListener("animationend", expandCard);
  });
}

async function copyContent(event: PointerEvent): Promise<void> {
  const target = event.target as HTMLElement;
  const content = target.parentElement?.children.namedItem(
    "content"
  ) as HTMLElement;

  await navigator.clipboard.writeText(content.innerText);
  const copyDiv = target.parentElement?.querySelectorAll(
    ".copy-check:not(.animate)"
  );
  if (copyDiv !== undefined) {
    playCopyAnimation(copyDiv);
  }
}

function playCopyAnimation(copyDiv: NodeListOf<Element>): void {
  for (const element of copyDiv) {
    element.classList.add("animate");
    element.addEventListener("animationend", () => {
      element.classList.remove("animate");
    });
  }
}
