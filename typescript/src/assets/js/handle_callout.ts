/* eslint-disable @typescript-eslint/no-unused-vars */
window.onload = function () {
  setCallout();
};

function setCallout(): void {
  const arrayOfCard = document.querySelectorAll(".callout");

  for (const callout of arrayOfCard) {
    const collapse = callout.querySelector("button.collapse") as HTMLElement;
    if (collapse === null) continue;
    const calloutId = callout.id;
    const card = callout.querySelector(".card") as HTMLElement;
    if (card === null || calloutId === undefined)
      throw new Error(`No card in ${calloutId ?? ""} here`);
    setCalloutAnim(calloutId, card);
    card.style.display = collapse.innerText === "🔼" ? "block" : "none";
  }
}

function setCalloutAnim(calloutId: string, card: HTMLElement): void {
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

function toggleCard(event: PointerEvent): void {
  const target = event.target as HTMLElement;
  const card = target.parentElement?.nextElementSibling as HTMLElement;

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
