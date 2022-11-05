const lunr = require("lunr");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const S = require("string");

const documents = {};
const baseUrl = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "/_config.yml"))
).baseurl;

const files = glob.sync(path.join(__dirname, "/_posts/**/*.md"));
files.forEach((file) => {
  const fileString = fs.readFileSync(file).toString();
  const content = fileString.split("---");
  const frontMatter = yaml.safeLoad(content[1]);
  const fileData = {
    title: frontMatter.title,
    category: frontMatter.category,
    author: frontMatter.author,
    content: S(content[2]).escapeHTML().stripTags().stripPunctuation().s,
    url: `${baseUrl}/${file.substring(
      file.lastIndexOf("/") + 1,
      file.lastIndexOf(".")
    )}/`,
  };
  documents[file.substring(file.lastIndexOf("/") + 1, file.lastIndexOf("."))] =
    fileData;
});

const builder = new lunr.Builder();
builder.ref("id");
builder.field("title", { boost: 10 });
builder.field("author");
builder.field("category", { boost: 5 });
builder.field("content", { boost: 15 });
builder.metadataWhitelist = ["position"];

builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);

builder.searchPipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);

for (var key in documents) {
  // Add the data to lunr
  builder.add({
    id: key,
    title: documents[key].title,
    author: documents[key].author,
    category: documents[key].category,
    content: documents[key].content,
  });
}
const index = builder.build();
const index_data = `var search_index = ${JSON.stringify(index, null, 4)};`;
const documents_data = `var store = ${JSON.stringify(documents, null, 4)};`;
fs.writeFileSync(
  path.join(__dirname, "/assets/js/document-store.js"),
  documents_data
);
fs.writeFileSync(
  path.join(__dirname, "/assets/js/search-index.js"),
  index_data
);
