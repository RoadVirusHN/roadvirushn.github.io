import { trimmerEnKo, stemmerEnKo } from "./nlp";
const lunr = window.lunr;
const storedWindow = window;
export default function buildLunr() {
    return lunr(function () {
        lunr.Pipeline.registerFunction(trimmerEnKo, "trimmerEnKo");
        lunr.Pipeline.registerFunction(stemmerEnKo, "stemmerEnKo");
        this.pipeline.reset();
        this.pipeline.add(trimmerEnKo, stemmerEnKo);
        this.searchPipeline.reset();
        this.searchPipeline.add(trimmerEnKo, stemmerEnKo);
        this.field("id");
        this.field("title", { boost: 10 });
        this.field("content");
        this.metadataWhitelist = ["position"];
        for (const postPath in storedWindow.store) {
            this.add({
                id: postPath,
                title: storedWindow.store[postPath].title,
                content: storedWindow.store[postPath].content,
            });
        }
    });
}
//# sourceMappingURL=build_lunr_index.js.map