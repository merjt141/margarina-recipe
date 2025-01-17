export const ingredientsPropArray = ["x_ingred", "n_valor"];

export interface RecipeInputList {
    editable: {
        tmg: string[],
        balanza: string[],
        ipsa: string[],
        buttons: string[],
    },
    noneditable: {
        tmg: string[],
        balanza: string[],
        ipsa: string[],
    }
}

export interface IngredientTable {
    c_receta: string;
    x_receta: string;
    n_valor: string;
    x_comen1: string;
    x_comen2: string;
    c_ingred: string;
    x_ingred: string;
    x_unidad: string;
    t_ingred: string;
}

/**
 * Validate values in input fields
 * @param elementArray Array of HTMLInputElement to validate data
 */
export function validateInputElements(elementArray: HTMLInputElement[]): boolean {
    elementArray.forEach((item: HTMLInputElement, i: number) => {
        if (isNaN(Number(item.value))) {
            alert("Los valores no son correctos");
            return false;
        }
        if (Number(item.value) < 0) {
            alert("Los valores no pueden ser negativos");
            return false;
        } 
    })
    return true;
}