confirm('ghpage test');
let TOCRaw = document.getElementsByClassName("language-toc")[0].textContent;
let ArrayOfTOCRaw = TOCRaw.split(/: |\n/);
ArrayOfTOCRaw.pop();
let TOCSettings;
for (const i in ArrayOfTOCRaw) {
    let parsedI = parseInt(i);
    if (!(parsedI & 1)) {
        let settingValue = TOCRaw[parsedI + 1];
        TOCSettings[ArrayOfTOCRaw[parsedI]] = settingValue;
    }
    ;
}
console.log(TOCSettings);
//# sourceMappingURL=test2.js.map