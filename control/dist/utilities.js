export var ingredientsPropArray = ["x_ingred", "n_valor"];
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
