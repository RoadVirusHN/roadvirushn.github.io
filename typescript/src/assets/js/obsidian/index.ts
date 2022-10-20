import loadCallout from "./components/init_callout";
import loadExternalLink from "./components/init_external_link";
import loadInternaLink from "./components/init_internal_link";

window.addEventListener("load", () => {
  loadCallout();
  loadInternaLink();
  loadExternalLink();
});
