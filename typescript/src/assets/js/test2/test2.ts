let TOCRaw : null | string = document.getElementsByClassName("language-toc")[0].textContent;
if (!TOCRaw) return;

let ArrayOfTOCRaw = TOCRaw.split(/: |\n/);
ArrayOfTOCRaw.pop();
let TOCSettings: { [settingName: string]: string };

for (const i in ArrayOfTOCRaw) {
    let parsedI: number = parseInt(i)

    if (!(parsedI & 1)) {
        let settingValue = TOCRaw[parsedI + 1];
        TOCSettings[ArrayOfTOCRaw[parsedI]] = settingValue
    };
}

console.log(TOCSettings);