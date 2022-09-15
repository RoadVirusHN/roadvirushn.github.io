import loadCallout, { copyContent, toggleCard } from "./obsidian/load_callout";
import loadExternalLink from "./obsidian/load_external_link";
import loadInternaLink from "./obsidian/load_internal_link";
export { toggleCard, copyContent };
window.toggleCard = toggleCard;
window.copyContent = copyContent;
window.addEventListener("load", () => {
  loadCallout();
  loadInternaLink();
  loadExternalLink();
});
