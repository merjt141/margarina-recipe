var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var ingredientsPropArray = ["x_ingred", "n_valor"];
var DataTable = {
    tmg: {
        value: new Array(10),
        description: new Array(10),
        comment: new Array(10),
    },
    balanza: {
        value: new Array(17),
        description: new Array(17),
        comment: new Array(17),
    },
    parameters: new Array(30)
};
var MemoryData = [__assign({}, DataTable), __assign({}, DataTable)];
/**
 * Validate values in input fields
 * @param elementArray Array of HTMLInputElement to validate data
 */
export function validateInputElements(elementArray) {
    elementArray.forEach(function (item, i) {
        if (isNaN(Number(item.value))) {
            alert("Los valores no son correctos");
            return false;
        }
        if (Number(item.value) < 0) {
            alert("Los valores no pueden ser negativos");
            return false;
        }
    });
    return true;
}
/**
 * Get HTMLInputElement from id
 * @param object Id of HTMLInputElement
 * @returns DOM object
 */
export function getInputElement(object) {
    return document.getElementById(object);
}
/**
 * Update the total value
 * @param object Custom Web Control Abrir
 */
export function refrescoSuma(object) {
    var sumaTMG = 0;
    var sumaBalanza = 0;
    validateInputElements(object.ingredientsDOM[0]);
    object.ingredientsDOM[0].forEach(function (item, i) {
        sumaTMG += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[0][1]).value = sumaTMG.toString();
    getInputElement(object.recipeInputList.resume[1][1]).value = sumaTMG.toString();
    validateInputElements(object.ingredientsDOM[1]);
    object.ingredientsDOM[1].forEach(function (item, i) {
        sumaBalanza += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[1][4]).value = sumaBalanza.toString();
}
/**
 * Save temporal data of input fields
 * @param index Number of memory to save data
 */
export function saveTemporalData(index) {
    for (var i = 1; i <= 5; i++) {
        MemoryData[index].tmg.value[i - 1] = getInputElement("h".concat(i, "2")).value;
        MemoryData[index].tmg.description[i - 1] = getInputElement("h".concat(i, "4")).value;
        MemoryData[index].tmg.comment[i - 1] = getInputElement("h".concat(i, "5")).value;
    }
    for (var i = 6; i <= 10; i++) {
        MemoryData[index].tmg.value[i - 1] = getInputElement("c".concat(i - 5, "2")).value;
        MemoryData[index].tmg.description[i - 1] = getInputElement("c".concat(i - 5, "4")).value;
        MemoryData[index].tmg.comment[i - 1] = getInputElement("c".concat(i - 5, "5")).value;
    }
    for (var i = 1; i <= 17; i++) {
        MemoryData[index].balanza.value[i - 1] = getInputElement("i".concat(i, "2")).value;
        MemoryData[index].balanza.description[i - 1] = getInputElement("i".concat(i, "4")).value;
        MemoryData[index].balanza.comment[i - 1] = getInputElement("i".concat(i, "5")).value;
    }
    for (var i = 1; i <= 30; i++) {
        MemoryData[index].parameters[i - 1] = getInputElement("ipsa".concat(i)).value;
    }
    console.log(index);
    console.log(MemoryData);
}
/**
 *
 * @returns Check if values of memory are the same
 */
export function sonIguales() {
    return JSON.stringify(MemoryData[0]) == JSON.stringify(MemoryData[1]);
}
