export const ingredientsPropArray = ["x_ingred", "n_valor"];
import { CWCAbrir } from "../model/abrir/cwcAbrir.js"
import { App } from "./manager.js";

export interface RecipeInputList {
    editable: {
        tmg: string[],
        balanza: string[],
        ipsa: string[],
        buttons: string[],
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

export interface IngredientList {
    c_ingred: string,
    x_ingred: string,
}

export interface RecipeTable {
    c_receta: string,
    x_receta: string,
}

/**
 * Tipo de ingrediente de la receta en base de datos
 */
export enum IngrType{
    Caliente,
    Frio,
    Balanza,
    IPSA,
    Copsa
}

export interface PopupOptions {
  title?: string;
  id?: string,
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  content?: string | HTMLElement;
  onClose?: () => void;
} 

export class ComboBoxRecipe {
    domId: string;

    object: CWCAbrir;
    manager: App;
    selectedIndex: string;
    text: string;

    constructor(domId: string, object: CWCAbrir, manager: App) {
        this.domId = domId;
        this.object = object;
        this.manager = manager;
        this.selectedIndex = "";
        this.text = "";

        this.domObject().addEventListener('change', () => {
            this.select();
        })
    }

    domObject(): HTMLSelectElement {
        return document.getElementById(this.domId) as HTMLSelectElement;
    }

    /**
     * Update combo box data
     * @param {string} data 
     */
    update(data: string) {
        const obj = JSON.parse(typeof(data) == "string" ? data : JSON.stringify(data));
        this.domObject().textContent = '';
        for (let i = 0; i < obj.length; i++){
            let option = document.createElement("option") as HTMLOptionElement;
            option.value = obj[i].c_receta;
            option.innerHTML = obj[i].x_receta;
            this.domObject().appendChild(option);
        }
    }

    /**
     * Selecciona un elemento del combobox y carga la receta en el formulario
     */
    async select(): Promise<void> {
        // Extrae código de receta seleccionado
        this.selectedIndex = this.domObject().value;
        
        // Extrae texto de receta seleccionado
        this.text = this.domObject().options[this.domObject().selectedIndex].text;
        
        // Coonstrucción de consulta para base de datos
        let queryString = `Use ENV_MARG; select r.c_receta, r.x_receta, d.n_valor, d.x_comen1, d.x_comen2, i.c_ingred, i.x_ingred, i.x_unidad, i.t_ingred 
        from RECETA r inner join DETALLE_RECETA d on r.c_receta = d.c_receta inner join INGREDIENTES i on d.c_ingred = i.c_ingred 
        where r.c_receta = '${this.selectedIndex}' order by c_ingred;`;

        // Espera respuesta de base de datos por la receta seleccionada
        let response = await this.manager.pidManager.execute(queryString, 1);

        // Escribir la receta en el formulario
        this.object.writeRecipeData(response);
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

let MemoryData: RecipeData[] = [JSON.parse(JSON.stringify(DataTable)), 
    JSON.parse(JSON.stringify(DataTable))];

let MenorCodigo: number = 1;

/**
 * Valida los valores de los campos de entrada
 * @param inputElementArray Lista de HTMLInputElement para validar valores
 */
export function validateInputElements(inputElementArray: HTMLInputElement[]): boolean {
    inputElementArray.forEach((item: HTMLInputElement, i: number) => {
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
 * Crear un popup flotante en la ventana principal
 * @param options Configuracion del popup
 * @returns 
 */
export function createFloatingPopup(options: PopupOptions = {}): HTMLDivElement {
    const {
        title = "Título del Popup",
        id = "popup",
        width = 300,
        height = 200,
        left = 100,
        top = 100,
        content = "",
        onClose = () => {},
    } = options;

    const popup = document.createElement("div");
    popup.id = id;
    popup.className = "floating-popup";
    popup.style.width = `${width}px`;
    popup.style.height = `${height}px`;
    popup.style.position = "fixed";
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    popup.innerHTML = `
        <div class="floating-popup-header">
        <span class="floating-popup-title">${title}</span>
        <svg class="floating-popup-close" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
            <g>
            <rect x="0" y="2" width="26" height="26" fill="transparent"></rect>
            <path d="M7 9 L19 21 M7 21 L19 9" stroke="black" stroke-width="1" fill="none"/>
            </g>
        </svg>
        </div>
        <div class="floating-popup-body"></div>
    `;

    const body = popup.querySelector(".floating-popup-body") as HTMLDivElement;
    if (typeof content === "string") {
        body.innerHTML = content;
    } else {
        body.appendChild(content);
    }

    document.body.appendChild(popup);

    const header = popup.querySelector(".floating-popup-header") as HTMLElement;
    let offsetX = 0, offsetY = 0, isDragging = false;

    header.addEventListener("mousedown", (e: MouseEvent) => {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
    });

    document.addEventListener("mousemove", (e: MouseEvent) => {
        if (isDragging) {
        popup.style.left = `${e.clientX - offsetX}px`;
        popup.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    popup.addEventListener("mousedown", (e) => {
        popup.style.backgroundColor = "rgba(125,204,246,1)";
        e.stopPropagation();
    });

    document.addEventListener("mousedown", (e) => {
        if (!popup.contains(e.target as Node)) {
        popup.style.backgroundColor = "rgba(145,147,154,1)";
        }
    });

    const closeBtn = popup.querySelector(".floating-popup-close") as SVGElement;
    closeBtn.addEventListener("click", () => {
        popup.remove();
        onClose();
    });

    return popup;
}

/**
 * Obtener el campo de entrada mediante el Id
 * @param id Id del HTMLInputElement
 * @returns Objeto DOM
 */
export function getInputElement(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
}

/**
 * Actualiza el valor de totalizado del formulario
 * @param object Custom Web Control Abrir
 */
export function refrescoSuma(object: CWCAbrir): void {
    // Inicializar los valores de suma
    let sumaTMG: number = 0;
    let sumaBalanza: number = 0;

    // Validación de valores en los campos de entrada
    validateInputElements(object.ingredientsDOM[0])

    // Sumar emulsificantes fríos y calientes
    object.ingredientsDOM[0].forEach((item: HTMLInputElement, i: number) => {
        sumaTMG += Number(item.value);
    });

    // Corregir imprecisiones de punto flotante en suma
    sumaTMG = Number(sumaTMG.toFixed(6));

    // Escribir en totalizado de emulsificantes y TMG
    getInputElement(object.recipeInputList.resume[0][1]).value = sumaTMG.toString();
    getInputElement(object.recipeInputList.resume[1][1]).value = sumaTMG.toString();

    // Validación de los campos de entrada
    validateInputElements(object.ingredientsDOM[1])

    // Sumar ingredientes de balanza
    object.ingredientsDOM[1].forEach((item: HTMLInputElement, i: number) => {
        sumaBalanza += Number(item.value);
    });

    // Corregir imprecisiones de punto flotante en suma
    sumaBalanza += sumaTMG;
    sumaBalanza = Number(sumaBalanza.toFixed(6));

    // Escribitir en totalizado de ingredientes balanza
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
 * Vlida los parámetros IPSA
 * @returns Parametros IPSA OK
 */
export function parametrosTanquesOk(): boolean {
    // Valida parámetros obligatorios
    for (let i = 1; i <= 8; i++) {
        let value = getInputElement(`ipsa${i}`).value;

        // Validar que el valor existe
        if (isNaN(Number(value)) || value == "") {
            alert("El valor de los parámetros marcados con \"*\" deben ser numéricos mayor a cero");
            return false;
        }

        // Validar que no es 0 o negativo
        if (Number(value) <= 0) {
            alert("El valor de los parámetros marcados con \"*\" deben ser mayor a cero");
            return false;
        }
    }

    // Valida parámetros opcionales
    for (let i = 9; i <= 30; i++) {
        let value = getInputElement(`ipsa${i}`).value;

        // Validar que el valor existe
        if (isNaN(Number(value)) ) {
            alert("El valor de los parámetros marcados con \"*\" deben ser numéricos mayor a cero");
            return false;
        }

        // Validar que no es negativo
        if (Number(value) < 0) {
            alert("El valor de los parámetros marcados con \"*\" deben ser mayor o igual a cero");
            return false;
        }
    }

    return true;
}

/**
 * Valida los valores de los ingredientes
 * @param object Formulario abrir
 */
export function valoresOk(object: CWCAbrir): boolean {

    // Ingredientes de balanza
    object.ingredientsDOM[1].forEach((item: HTMLInputElement, index: number) => {
        let value = item.value;

        // Validar que es un número
        if (isNaN(Number(value)) || value == "") {
            let ingredient = getInputElement(`i${index + 1}1`).value;
            console.log(`El valor del ingrediente ${ingredient} debe ser numérico`);
            return false;
        }

        // Validar que no es menor a 0
        if (Number(value) <= 0) {
            let ingredient = getInputElement(`i${index + 1}1`).value;
            console.log(`El valor del ingrediente ${ingredient} debe ser mayor a cero`);
            return false;
        }
    });

    return true;
}

/**
 * Consulta a la base de datos por el listado de recetas y actualiza el combobox
 * @param planta 1: COPSA o 0: IPSA
 * @param object Referencia a la aplicación
 */
export async function listaCodigos(planta: boolean, object: App): Promise<void> {
    // Consulta para listado de recetas
    let queryString: string = `Use ENV_MARG; select x_receta, c_receta from RECETA where left(c_receta, 1) = '${planta ? 'C' : 'P'}' order by c_receta;`;
    
    // Espera respuesta de WinCC/Base de Datos
    let response = await object.pidManager.execute(queryString, 0);

    // Actualiza combobox
    object.formAbrir?.recipeComboBox.update(response);
}
/**
 * Retorna un nuevo código disponible de la base de datos para nueva receta
 * @param planta 1: COPSA, 0: IPSA
 * @param object Formulario Abrir
 * @returns Nuevo código para receta
 */
export async function buscaNuevoCodigo(planta: boolean, object: App): Promise<number> {
    // Consulta el máximo valor de los códigos guardados
    let queryString: string = `Use ENV_MARG; select top(1) x_receta, c_receta from RECETA where left(c_receta, 1) = '${planta ? 'C' : 'P'}' order by c_receta desc;`;
    
    // Espera respuesta de WinCC/SQL
    let response = await object.pidManager.execute(queryString, 4);

    // Estructura la respuesta en JSON
    let dataJson = JSON.parse(response);

    // Si existe al menos un elemento ejecutar
    if (Boolean(dataJson[0])) {
        // Aumenta el código en 1 y retorna
        let code = dataJson[0].c_receta;
        return Number(code.slice(1,3)) + 1;
    }

    // Si base de datos vacía retorna el menor código permitido (1)
    return MenorCodigo;
}

/**
 * Validar con la base de datos si existe el nombre ingresado
 * @param planta 1: COPSA / 0: IPSA
 * @param name NOmbre de receta buscado
 * @param object Formulario Abrir
 * @returns 
 */
export async function nombreDuplicado(planta: boolean, name: string, object: App): Promise<boolean> {
    // Consulta de busqueda por duplicidad
    let queryString: string = `Use ENV_MARG; select * from RECETA where left(c_receta, 1) = '${planta ? 'C' : 'P'}' and x_receta = '${name}' order by c_receta;`;
    
    // Esperar respuesta
    let response = await object.pidManager.execute(queryString, 3);
    
    // Validar si existe coincidencia con una o más filas
    let dataJson = JSON.parse(response);
    if (Boolean(dataJson[0])) {
        // Retorna true si encuentra duplicidad
        return true;
    }

    // Retorna false si no existe duplicidad
    return false;
}

export function message(son: boolean, msg: string, titulo: string, icono: number, modo: number) {

}

export function darFormato() {
    
}

export function menu() {

}