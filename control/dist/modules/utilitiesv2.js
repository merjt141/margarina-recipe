import { validateInputElements } from "../utilities.js";
var Library = /** @class */ (function () {
    function Library() {
    }
    Library.getInputElement = function (object) {
        return document.getElementById(object);
    };
    Library.refrescoSuma = function (object) {
        var sumaTMG = 0;
        var sumaBalanza = 0;
        validateInputElements(object.ingredientsDOM[0]);
        object.ingredientsDOM[0].forEach(function (item, i) {
            sumaTMG += Number(item.value);
        });
        Library.getInputElement(object.recipeInputList.resume[0][1]).value = sumaTMG.toString();
        Library.getInputElement(object.recipeInputList.resume[1][1]).value = sumaTMG.toString();
        validateInputElements(object.ingredientsDOM[1]);
        object.ingredientsDOM[1].forEach(function (item, i) {
            sumaBalanza += Number(item.value);
        });
        Library.getInputElement(object.recipeInputList.resume[1][4]).value = sumaBalanza.toString();
    };
    Library.saveTemporalData = function () {
    };
    return Library;
}());
export { Library };
