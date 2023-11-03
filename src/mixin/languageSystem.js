const languageDict = {
    es: "spanish",
    en: "english",
    fr: "french"
}
const languageSystem = window.navigator.language.substring(0, 2);

export default function languageSystemHandler () {
    let languageContext;
    if (!languageDict[languageSystem]) {
        languageContext = languageDict.en
    } else {
        languageContext = languageDict[languageSystem]
    }
    return languageContext
}
