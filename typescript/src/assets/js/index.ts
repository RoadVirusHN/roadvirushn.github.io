import loadCallout from "./obsidian/load_callout";
import loadExternalLink from "./obsidian/load_external_link";
import loadInternaLink from "./obsidian/load_internal_link";
import loadScrollbar from "./obsidian/load_scrollbar";

window.addEventListener("load", () => {
  loadCallout();
  loadInternaLink();
  loadExternalLink();
  loadScrollbar();
});
