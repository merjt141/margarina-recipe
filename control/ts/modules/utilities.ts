export const ingredientsPropArray = ["x_ingred", "n_valor"];
import { CWCAbrir } from "../cwcAbrir.js"
import { WebCCSimulator } from "../simulation.js";

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
    },
    resume: string[][]
}

export interface RecipeData {
    tmg: {
        value: string[],
        description: string[],
        comment: string[],
    },
    balanza: {
        value: string[],
        description: string[],
        comment: string[],
    }
    parameters: string[],
}

export interface IngredientTable {
    c_receta: string,
    x_receta: string,
    n_valor: string,
    x_comen1: string,
    x_comen2: string,
    c_ingred: string,
    x_ingred: string,
    x_unidad: string,
    t_ingred: string,
}

export interface RecipeTable {
    c_receta: string,
    x_receta: string,
}

export interface SQLObject {
    sqlAgent: SQLAgent;
    webCCSimulator: WebCCSimulator;
    sqlQueryResponseHandler: (response: string) => void;
}

export interface PLCObject {
    plcAgent: PLCAgent;
    webCCSimulator: WebCCSimulator;
    plcWriteResponseHandler: (response: string) => void;
}

export class ComboBoxRecipe {
    domObject: HTMLSelectElement;
    object: SQLObject;

    constructor(domId: string, object: SQLObject) {
        this.domObject = document.getElementById(domId) as HTMLSelectElement;
        this.object = object;

        this.domObject.addEventListener('change', () => {
            this.select();
        })
    }

    /**
     * Update combo box data
     * @param {string} data 
     */
    update(data: string) {
        const obj = JSON.parse(typeof(data) == "string" ? data : JSON.stringify(data));
        this.domObject.textContent = '';
        for (let i = 0; i < obj.length; i++){
            let option = document.createElement("option") as HTMLOptionElement;
            option.id = obj[i].c_receta;
            option.innerHTML = obj[i].x_receta;
            this.domObject.appendChild(option);
        }
    }

    /**
     * Select element from combo box
     */
    select() {
        let selectedBox = this.domObject.options[this.domObject.selectedIndex].id;

        let queryString = `Use ENV_MARG; select r.c_receta, r.x_receta, d.n_valor, d.x_comen1, d.x_comen2, i.c_ingred, i.x_ingred, i.x_unidad, i.t_ingred `;
        queryString += `from RECETA r inner join DETALLE_RECETA d on r.c_receta = d.c_receta inner join INGREDIENTES i on d.c_ingred = i.c_ingred `;
        queryString += `where r.c_receta = '${selectedBox}';`;

        this.object.sqlAgent.execute(this.object, queryString, "selectTable");
    }
}

export class SQLAgent {
    constructor() {

    }

    execute(object:SQLObject, queryString: string, action: string) {
        console.log(queryString);

        try {
            WebCC.Events.fire('executeQuery', queryString, action);
        } catch (error) {
            console.log("Not access to WebCC API: Go Simulation");
            object.webCCSimulator.executeQuery(queryString, action);
        }
    }

    response(object: SQLObject, response: string) {
        object.sqlQueryResponseHandler(response);
    }
}

export class PLCAgent {
    constructor() {

    }

    write(object:PLCObject, writeCommand: string, action: string) {
        console.log(writeCommand);

        try {
            WebCC.Events.fire('writePLC', writeCommand, action);
        } catch (error) {
            console.log("Not access to WebCC API");
            object.webCCSimulator.writePLC(writeCommand);
        }
    }

    response(object: PLCObject, response: string) {
        object.plcWriteResponseHandler(response);
    }
}

let DataTable: RecipeData = {
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
}

let MemoryData: RecipeData[] = [{...DataTable}, {...DataTable}];

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

/**
 * Get HTMLInputElement from id
 * @param object Id of HTMLInputElement
 * @returns DOM object
 */
export function getInputElement(object: string): HTMLInputElement {
    return document.getElementById(object) as HTMLInputElement;
}

/**
 * Update the total value
 * @param object Custom Web Control Abrir
 */
export function refrescoSuma(object: CWCAbrir) {
    let sumaTMG: number = 0;
    let sumaBalanza: number = 0;

    validateInputElements(object.ingredientsDOM[0])
    object.ingredientsDOM[0].forEach((item: HTMLInputElement, i: number) => {
        sumaTMG += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[0][1]).value = sumaTMG.toString();
    getInputElement(object.recipeInputList.resume[1][1]).value = sumaTMG.toString();

    validateInputElements(object.ingredientsDOM[1])
    object.ingredientsDOM[1].forEach((item: HTMLInputElement, i: number) => {
        sumaBalanza += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[1][4]).value = sumaBalanza.toString();
}

/**
 * Save temporal data of input fields
 * @param index Number of memory to save data
 */
export function saveTemporalData(index: number) {
    for (let i = 1; i <= 5; i++) {
        MemoryData[index].tmg.value[i-1] = getInputElement(`h${i}2`).value;
        MemoryData[index].tmg.description[i-1] = getInputElement(`h${i}4`).value;
        MemoryData[index].tmg.comment[i-1] = getInputElement(`h${i}5`).value;
    }
    for (let i = 6; i <= 10; i++) {
        MemoryData[index].tmg.value[i-1] = getInputElement(`c${i-5}2`).value;
        MemoryData[index].tmg.description[i-1] = getInputElement(`c${i-5}4`).value;
        MemoryData[index].tmg.comment[i-1] = getInputElement(`c${i-5}5`).value;
    }
    for (let i = 1; i <= 17; i++) {
        MemoryData[index].balanza.value[i-1] = getInputElement(`i${i}2`).value;
        MemoryData[index].balanza.description[i-1] = getInputElement(`i${i}4`).value;
        MemoryData[index].balanza.comment[i-1] = getInputElement(`i${i}5`).value;
    }
    for (let i = 1; i <= 30; i++) {
        MemoryData[index].parameters[i-1] = getInputElement(`ipsa${i}`).value;
    }
    console.log(index);
    console.log(MemoryData);
}

/**
 * Check if values of memory are the same
 * @returns Check if values of memory are the same
 */
export function sonIguales() {
    return JSON.stringify(MemoryData[0]) == JSON.stringify(MemoryData[1]);
}

/**
 * Check parameters value
 * @returns Parameters value are ok
 */
export function parametrosTanquesOk() {
    for (let i = 1; i <= 8; i++) {
        let value = getInputElement(`ipsa${i}`).value;
        if (isNaN(Number(value)) || value == "") {
            alert("El valor de los parámetros marcados con \"*\" deben ser numéricos mayor a cero");
            return false;
        }
        if (Number(value) <= 0) {
            alert("El valor de los parámetros marcados con \"*\" deben ser mayor a cero");
            return false;
        }
    }
    for (let i = 9; i <= 30; i++) {
        let value = getInputElement(`ipsa${i}`).value;
        if (isNaN(Number(value)) ) {
            alert("El valor de los parámetros marcados con \"*\" deben ser numéricos mayor a cero");
            return false;
        }
        if (Number(value) < 0) {
            alert("El valor de los parámetros marcados con \"*\" deben ser mayor a cero");
            return false;
        }
    }
    return true;
}

/**
 * Check if values of Ingreidents are ok
 * @param object Custom Web Control Abrir
 */
export function valoresOk(object: CWCAbrir) {
    object.ingredientsDOM[1].forEach((item: HTMLInputElement, index: number) => {
        let value = item.value;
        if (isNaN(Number(value)) || value == "") {
            let ingredient = getInputElement(`i${index + 1}1`).value;
            console.log(`El valor del ingrediente ${ingredient} debe ser numérico`);
            return false;
        }
        if (Number(value) <= 0) {
            let ingredient = getInputElement(`i${index + 1}1`).value;
            console.log(`El valor del ingrediente ${ingredient} debe ser mayor a cero`);
            return false;
        }
        return true;
    });
}


export function listaCodigos(planta: boolean, object: SQLObject) {
    let queryString: string = `Use ENV_MARG; select x_receta, c_receta from RECETA where left(c_receta, 1) = '${planta ? 'C' : 'P'}' order by c_receta;`;
    object.sqlAgent.execute(object, queryString, "selectCombo");
}

export function listaCodigosCallback(jsonString: string, object: CWCAbrir) {
    object.recipeComboBox.update(jsonString);
}