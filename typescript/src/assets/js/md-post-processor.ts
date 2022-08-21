// Postprocess jeykell's output html.
import convertTOCs from "./utils/tocconverter"

function init(document:Document){
    convertTOCs(document)
}