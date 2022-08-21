// Convert markdown TOC tag([TOC]) to html index part.
type SettingType = {
  title: string;
  listStyle: string;
  variedStyle: boolean;
  minHeaderDepth: number;
  maxHeaderDepth: number;
};

const settings: SettingType = {
  title: "**목차**",
  listStyle: "number",
  variedStyle: true,
  minHeaderDepth: 2,
  maxHeaderDepth: 3,
};

function convertTOCs(document: Document) {
  buildTOC(document, settings);
  getTOCTagsFromView(document);

  return document;
}

function buildTOC(document: Document, settings: SettingType) {


  
}


function getTOCTagsFromView(document: Document) {
  document.getElementsByClassName("language-toc");

  return;
}

export default convertTOCs;
