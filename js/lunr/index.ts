import buildLunr from "./components/build_lunr_index";

globalThis.window.searchIndex = buildLunr();
