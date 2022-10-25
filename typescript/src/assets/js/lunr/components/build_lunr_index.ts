import { NewWindow } from "../../types/lunr_types";
import { trimmerEnKo, stemmerEnKo } from "./nlp";

const lunr = window.lunr;
const storedWindow = window as NewWindow;

export default function buildLunr(): lunr.Index {
  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  return lunr(function () {
    lunr.Pipeline.registerFunction(trimmerEnKo, "trimmerEnKo");
    lunr.Pipeline.registerFunction(stemmerEnKo, "stemmerEnKo");

    this.pipeline.reset();
    this.pipeline.add(trimmerEnKo, stemmerEnKo); // delete stopwordfilter for querying stopwords.

    this.searchPipeline.reset();
    this.searchPipeline.add(trimmerEnKo, stemmerEnKo);
    this.field("id");
    this.field("title", { boost: 10 });
    this.field("content");
    this.metadataWhitelist = ["position"];

    for (const postPath in storedWindow.store) {
      // Add the data to lunr
      this.add({
        id: postPath,
        title: storedWindow.store[postPath].title,
        content: storedWindow.store[postPath].content,
      });
    }
  });
}
