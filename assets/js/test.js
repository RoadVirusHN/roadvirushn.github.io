confirm('ghpage test')

document.search('[TOC]')


TOCRaw = document.getElementsByClassName("language-toc")[0].textContent;
TOCRaw = TOCRaw.split(/: |\n/);
TOCRaw.pop();
TOCSettings = {};

for (const i in TOCRaw) {
    if (!(i & 1)) {
        let settingValue = TOCRaw[parseInt(i) + 1];

        if (!isNaN(settingValue)) {
        } else {
            settingValue = parseInt(settingValue)
        }
        TOCSettings[TOCRaw[i]] = settingValue
    };
}

console.log(TOCSettings);