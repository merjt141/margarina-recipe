import { WebCCSimulator } from '../simulation/simulation';
import * as Library from '../../modules/utilities';
import { App } from '../../modules/manager';

/**
 * Clase para el control de la carga y modificación de recetas
 * para las líneas de producción
 */
export class CWCAbrir {

    formSaveAs: Window | null;

    recipeJsonData: Library.IngredientTable[][];    // Raw table of recipe ingredients from SQL Server
    ingredientsHeadArray: string[];                 // List of ingredients table header
    
    ingredientsDOM: HTMLInputElement[][];           // DOM references to used ingredients field
    parametersDOM: HTMLInputElement[];              // DOM references to used parameters field

    editionDisabled: boolean;                       // Lock edition of fields
    recipeInputList: Library.RecipeInputList;

    app: App;
    recipeComboBox: Library.ComboBoxRecipe;         // ComboBox object instance for recipe app

    copsa: boolean;                                 // Area of production
    skipMessage: boolean;                           // Skip confirmation messages
    refreshCalculation: boolean;                    // Refresh calculated fields

    constructor(manager: App) {
        this.recipeJsonData = [[],[],[],[],[]];
        this.ingredientsHeadArray = ["x_ingred", "n_valor", "x_unidad", "x_comen1", "x_comen2"];

        this.ingredientsDOM = [[],[]];
        this.parametersDOM = [];
        
        this.editionDisabled = true;
        this.recipeInputList = {
            editable: {
                tmg: [],
                balanza: [],
                ipsa: [],
                buttons: ["button-modify-tmg", "button-modify-balanza", "button-modify-ipsa"],
            },
            resume: [["idCodeRecipe","sumatmg"],
            ["itmg","icantidad","iunidad","idescripcion","sumabalanza"]]
        };

        this.app = manager;
        this.recipeComboBox = new Library.ComboBoxRecipe("cbRecipes", this, this.app);

        this.copsa = false;
        this.skipMessage = false;
        this.refreshCalculation = false;

        this.formSaveAs = null;

        this.buildInputListAndInitializeComboBox();
    }

    /**
     * Guarda en memoria el listado de todos los inputs del formulario
     * separado por categorías e inicializa los valores de receta
     * en el combobox
     */
    private async buildInputListAndInitializeComboBox(): Promise<void> {
        // Emulsificantes fríos y calientes
        for (let i = 1; i <= 5; i++) {
            [2,4,5].forEach((j: number) => {
                this.recipeInputList.editable.tmg.push(`c${i}${j}`);        //Ingredientes fríos
                this.recipeInputList.editable.tmg.push(`h${i}${j}`);        // Ingredientes calientes
            });
        }
        // Ingredientes de balanza
        for (let i = 1; i <= 17; i++) {
            [2,4,5].forEach((j: number) => {
                this.recipeInputList.editable.balanza.push(`i${i}${j}`);    // Ingredientes balanza
            });
        }
        // Parámetros IPSA
        for (let i = 1; i <= 30; i++) {
            this.recipeInputList.editable.ipsa.push(`ipsa${i}`)             // Parámetros
        }

        // Llenar combobox con lista de recetas de base de datos
        await Library.listaCodigos(this.copsa, this.app);

        // Selecciona el primer elemento del combobox
        this.recipeComboBox.select();
    }

    /**
     * Habilita o deshabilita la edición de los ingredientes de la receta seleccionada
     * @param editionDisabled Deshabilitar edición
     */
    private enableInputs(editionDisabled: boolean): void {
        // Deshabilitar/habilitar emulsificantes calientes y fríos
        this.recipeInputList.editable.tmg.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });

        // Deshabilitar/habilitar ingredientes de balanza
        this.recipeInputList.editable.balanza.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });

        // Deshabilitar/habilitar parámetros IPSA
        this.recipeInputList.editable.ipsa.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });

        // Animar boton de deshabilitado de edición
        this.recipeInputList.editable.buttons.forEach((item: string) => {
            (document.getElementById(item) as HTMLButtonElement).style.color = editionDisabled ? "black" : "blue";
        });
    }

    /**
     * Limpiar todos los campos de entrada del formulario
     */
    private clearInputFields(): void {
        // Limpiar código de receta
        (document.getElementById("idCodeRecipe") as HTMLInputElement).value = "";
        
        // Limpiar emulsificantes fríos y calientes
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                (document.getElementById(`c${i}${j}`) as HTMLInputElement).value = "";
                (document.getElementById(`h${i}${j}`) as HTMLInputElement).value = "";
            }
        }

        // Limpiar suma de emulsificantes fríos y calientes
        (document.getElementById(`sumatmg`) as HTMLInputElement).value = "";
        
        // Limpier ingredientes de balanza
        for (let i = 1; i <= 17; i++) {
            for (let j = 1; j <= 5; j++) {
                (document.getElementById(`i${i}${j}`) as HTMLInputElement).value = "";
            }
        }

        // Limpiar totalizados de ingredientes de balanza
        (document.getElementById(`itmg`) as HTMLInputElement).value = "";           // TMG
        (document.getElementById(`icantidad`) as HTMLInputElement).value = "";      // Cantidad
        (document.getElementById(`iunidad`) as HTMLInputElement).value = "";        // Unidad
        (document.getElementById(`idescripcion`) as HTMLInputElement).value = "";   // Descripción
        (document.getElementById(`sumabalanza`) as HTMLInputElement).value = "";    // Total
        
        // Limpiar parámetros IPSA
        for (let i = 1; i <= 30; i++) {
            (document.getElementById(`ipsa${i}`) as HTMLInputElement).value = "";
        }
    }

    /**
     * Escribe todos los valores de los ingredientes en el formulario de receta
     * @param jsonString Listado de ingredientes de la receta en formato IngredientTable[]
     */
    writeRecipeData(jsonString: string): void {

        // Inicialización de variable de memoria local de receta
        this.recipeJsonData = [[],[],[],[],[]];

        // Extraer listado de recetas en formaro IngredientTable[]
        let dataJson = JSON.parse(jsonString) as Library.IngredientTable[];
        
        // Separar los ingredientes por tipo de ingrediente t_ingred 1, 2, 3, 4 y 5
        // 1: Emulsificantes calientes
        // 2: Emulsificantes fríos
        // 3: Ingredientes de balanza
        // 4: Parámetros IPSA
        dataJson.forEach((item: Library.IngredientTable, index: number) => {
            this.recipeJsonData[Number(item.t_ingred)-1].push(item);
        })

        // Limpiar campos de entrada antes de escribir
        this.clearInputFields();

        // Crear copia de receta cargada en memoria
        const data = this.recipeJsonData;

        // Guardar valores en memoria para posterior comparación y totalizado
        this.ingredientsDOM = [[],[]];
        this.parametersDOM = [];
        
        // Escribir código de receta en formulario
        (document.getElementById("idCodeRecipe") as HTMLInputElement).value = this.recipeComboBox.domObject().value;


        // Emulsificantes calientes
        data[0].forEach((item: Library.IngredientTable, i: number) => {
            // Iterar por la cabezera de datos de los ingrdientes y extraer los valores
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                // Convertir string en indice para extraer valor de IngredientTable
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;

                // Asignar valor de la receta o vacío de no existir
                (document.getElementById(`h${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });

            // Guardar valor en memoria local
            this.ingredientsDOM[0].push(Library.getInputElement(`h${i + 1}2`));
        });

        // Emulsificantes fríos
        data[1].forEach((item: Library.IngredientTable, i: number) => {
            // Iterar por la cabezera de datos de los ingrdientes y extraer los valores
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                // Convertir string en indice para extraer valor de IngredientTable
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;

                // Asignar valor de la receta o vacío de no existir
                (document.getElementById(`c${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });

            // Guardar valor en memoria local
            this.ingredientsDOM[0].push(Library.getInputElement(`c${i + 1}2`));
        });

        // Ingredientes de balanza
        data[2].forEach((item: Library.IngredientTable, i: number) => {
            // Iterar por la cabezera de datos de los ingrdientes y extraer los valores
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                // Convertir string en indice para extraer valor de IngredientTable
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;

                // Asignar valor de la receta o vacío de no existir
                (document.getElementById(`i${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });

            // Guardar valor en memoria local
            this.ingredientsDOM[1].push(Library.getInputElement(`i${i + 1}2`));
        });

        // Escribir valores estáticos de formulario
        Library.getInputElement("itmg").value = "Total Emulsificantes";
        Library.getInputElement("iunidad").value = "%";
        Library.getInputElement("idescripcion").value = "Emulsif. Calientes y Fríos";

        // Parámetros IPSA
        data[3].forEach((item: Library.IngredientTable, i:number) => {
            // Extraer objeto del formulario
            const inputLabel = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            
            // Si el valor es vacio escribir vacío sino escribir el valor correspondiente
            item.n_valor == "" ? inputLabel.value = "" : inputLabel.value = item.n_valor;

            // Guardar valor en memoria local
            this.parametersDOM.push(document.getElementById(`ipsa${i + 1}`) as HTMLInputElement);
        });

        // Actualizar suma de valores de receta
        Library.refrescoSuma(this);

        // Guardar valores en memoria temporal
        Library.saveTemporalData(1);
    }

    /**
     * Realiza el guardado de los cambios de la receta en la base de datos
     * @returns Salida de la función
     */
    async cmdGuardarClickEvent(): Promise<void> {
        // Extraer ID actual de receta
        let recipeId = this.recipeComboBox.selectedIndex;

        // Cancelar si no se seleccionó receta
        if (!recipeId) {
            alert("No se seleccionó receta");
            return;
        }
        
        // 
        if (!Library.validateInputElements(this.ingredientsDOM[0])) {
            return;
        }
        if (!Library.validateInputElements(this.ingredientsDOM[1])) {
            return;
        }
        if (!Library.validateInputElements(this.parametersDOM)) {
            return;
        }
    
        let originalData = this.recipeJsonData;

        let hSize = originalData[0] as Library.IngredientTable[];

        // Creación de consulta UPDATE SQL
        let queryString = "Use ENV_MARG; update dr set dr.n_valor = v.n_valor, dr.x_comen1 = v.x_comen1, dr.x_comen2 = v.x_comen2 from DETALLE_RECETA dr join ( values ";

        for (let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`h${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`h${i + 1}5`) as HTMLInputElement;
            //let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${hSize[i]["c_ingred"]}';`
            
            queryString += `('${recipeId}', '${hSize[i]["c_ingred"]}', ${n_value.value}, '${x_comen1.value}', '${x_comen2.value}'),`
            
            //this.app.pidManager.execute(queryString, 2);
        }

        let cSize = originalData[1] as Library.IngredientTable[];
        
        for (let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`c${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`c${i + 1}5`) as HTMLInputElement;
            //let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${cSize[i]["c_ingred"]}';`
            
            queryString += `('${recipeId}', '${cSize[i]["c_ingred"]}', ${n_value.value}, '${x_comen1.value}', '${x_comen2.value}'),`
            
            //this.app.pidManager.execute(queryString, 2);
        }

        let iSize = originalData[2] as Library.IngredientTable[];
        
        for (let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`i${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`i${i + 1}5`) as HTMLInputElement;
            //let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${iSize[i]["c_ingred"]}';`
            
            queryString += `('${recipeId}', '${iSize[i]["c_ingred"]}', ${n_value.value}, '${x_comen1.value}', '${x_comen2.value}'),`
            
            //this.app.pidManager.execute(queryString, 2);
        }

        let ipsaSize = originalData[3] as Library.IngredientTable[];
        
        for (let i = 0; i < ipsaSize.length; i++) {
            let n_value = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            let value: any;
            ((n_value.value == "0") || (n_value.value == "")) ? value = null : value = n_value.value;
            //let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${value} where c_receta = '${recipeId}' and c_ingred = '${ipsaSize[i]["c_ingred"]}';`
            
            queryString += `('${recipeId}', '${ipsaSize[i]["c_ingred"]}', ${value}, '', ''),`
            
            //this.app.pidManager.execute(queryString, 2);
        }

        queryString = queryString.slice(0, -1);
        queryString += `) as v(c_receta, c_ingred, n_valor, x_comen1, x_comen2) on dr.c_receta = v.c_receta and dr.c_ingred = v.c_ingred;`;

        this.app.pidManager.execute(queryString, 2);
    }

    /**
     * Change visible tab on recipe control
     * @param {string} tabId - Tab to show on screen
     */
    cmdShowTabClick(tabId: string) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
    
        document.getElementById(tabId)?.classList.add('active');
    }

    cmdModificarClick() {
        this.editionDisabled = !this.editionDisabled;
        this.enableInputs(this.editionDisabled);

    }

    cmdActualizarClick() {
        this.recipeComboBox.select();
    }

    cmdGuardarClick() {
        this.cmdGuardarClickEvent();
    }

    cmdComoClick() {
        let recipe = this.recipeComboBox.selectedIndex;

        if (recipe = "") {
            alert("Seleccione una receta para guardar");
            return;
        }
        if (!Library.valoresOk(this)) {
            return;
        }
        if (!this.copsa) {
            if (!Library.parametrosTanquesOk()) {
                return;
            }
        }
        this.formSaveAs = window.open("./public/modules/saveas.html", "PopopWindow", "width=600,height=240,scrollbars=no,resizable=no");
    }

    async cmdEliminarClick() {
        let value = this.recipeComboBox.domObject().value;
        if (value == "") {
            alert("Seleccione la receta a eliminar");
            return;
        }
        let userConfirmation = confirm("¿Está seguro de eliminar la receta?");
        let queryString: string;
        if (userConfirmation) {
            queryString = `Use ENV_MARG; delete from DETALLE_RECETA where c_receta = '${value}';`;
            
            await this.app.pidManager.execute(queryString, 7);
            
            queryString = `Use ENV_MARG; delete from RECETA where c_receta = '${value}';`;
            this.app.pidManager.execute(queryString, 7);

            console.log("Receta eliminada con éxito");
            this.clearInputFields();
            await Library.listaCodigos(this.copsa, this.app);
            this.recipeComboBox.select();
        }
    }
    
    /**
     * Invocar popup de transferencia de receta a PLC
     */
    async cmdTransferirClick() {

        // Extraer contenido de archivo transfer.html para popup
        let content: string = "";
        await fetch('./public/modules/transfer.html')
            .then(response => response.text())
            .then(html => {
                content = html;
            })
            .catch(error => console.error("Error cargando el popup"));

        // Creación de popup de transfer.html con contenido cargado
        let transferPopup : HTMLDivElement = document.getElementById("transfer-popup") as HTMLDivElement;

        if (!transferPopup) {
            transferPopup = Library.createFloatingPopup({
                title: "Transferencia de Recetas",
                id: "transfer-popup",
                width: 560,
                height: 240,
                left: 300,
                top: 200,
                content: content,
                onClose: () => { console.log("Popup cerrado"); },
            });
        } else {
            console.log("Ya hay un popup abierto con ese ID.");
        }

        // Actualizar titulo de popup
        (document.getElementById("lblEtiqueta") as HTMLLabelElement).textContent = `Transferencia a Planta ${this.copsa ? "COPSA" : "IPSA"}`;
        
        // Actualizar nombre de receta
        (document.getElementById("recipeCode") as HTMLInputElement).value = this.recipeComboBox.text;
        
        // Deshabilitar/habilitar botones de líneas usadas
        (document.getElementById("linea1") as HTMLButtonElement).disabled = this.copsa;
        (document.getElementById("linea2") as HTMLButtonElement).disabled = this.copsa;
        (document.getElementById("linea3") as HTMLButtonElement).disabled = this.copsa;
        (document.getElementById("linea4") as HTMLButtonElement).disabled = !this.copsa;
        (document.getElementById("linea5") as HTMLButtonElement).disabled = !this.copsa;

        // Agregar evento de cierre de popup a boton cancelar
        (document.getElementById("transfer-cerrar") as HTMLButtonElement).addEventListener("click", () => {
            transferPopup.remove();
        });
    }

    cmdImprimirClick() {

    }

    cmdSalirClick() {

    }

    /**
     * Cargar valores de receta a línea de producción en PLC
     * @param line Linea de producción a cargar receta
     * @returns 
     */
    async cmdTransferirAction(line: number) {

        // Animación de estado de carga
        const transferMsg = document.getElementById("transferMsg") as HTMLButtonElement;
        const transferProgress = document.getElementById("transferProgress") as HTMLProgressElement;
        
        transferMsg.style.display = 'none';
        transferProgress.value = 0;

        // Falta implementar validación de guardado de receta previa carga si se han hecho modificaciones

        // Secuencia de confirmación de carga de receta
        let userConfirmation = confirm(`¿Está seguro de transferir la receta seleccionada a la línea ${line}?`);
        if (!userConfirmation) return;

        // Iniciar barra de progreso
        transferProgress.style.display = 'block';

        // Inicio de cuenta de tiempo de ejecución
        const start = performance.now();

        // Formato de JSON para comandar escritura de TAGS en PLC
        let dataJson = [{}];

        // Obtener valores actuales de receta de la interfaz gráfica
        let originalData = this.recipeJsonData;

        // Limpieza de último elemento de array para iniciar escritura
        dataJson.pop();

        transferProgress.value += 5;

        // Grupos de tags de ingredientes
        let groupNameTag = "TN_" + (this.copsa ? "COPSA" : "IPSA") + line.toString();
        let groupValueTag = "TV_" + (this.copsa ? "COPSA" : "IPSA") + line.toString();

        // Crear copia de estructura de datos
        let fdsCopy = JSON.parse(JSON.stringify(this.app.FDS.groups));

        // Extraer data de Ingredientes Calientes
        let hSize = originalData[0] as Library.IngredientTable[];

        // Iterar TAGS de Ingredientes Calientes
        for ( let i = 0; i < hSize.length; i++) {
            // Extraer nombre y valor de ingrediente
            let x_comen1 = document.getElementById(`h${i + 1}4`) as HTMLInputElement;
            let n_value = document.getElementById(`h${i + 1}2`) as HTMLInputElement;
            
            // Extraer número de código de ingrediente (P01, C01, R01, etc...)
            let c_ingred = Number(hSize[i].c_ingred.slice(1));

            // Actualizar valores de FDS
            fdsCopy[groupNameTag]["L"+line.toString()+"_NOMBRE_P"+c_ingred] = x_comen1.value;
            fdsCopy[groupValueTag]["L"+line.toString()+"P"+c_ingred] = n_value.value;
        }

        transferProgress.value += 5;

        // Extraer data de Ingredientes Fríos
        let cSize = originalData[1] as Library.IngredientTable[];

        // Iterar TAGS de Ingredientes Fríos
        for ( let i = 0; i < cSize.length; i++) {
            // Extraer nombre y valor de ingredientes
            let x_comen1 = document.getElementById(`c${i + 1}4`) as HTMLInputElement;
            let n_value = document.getElementById(`c${i + 1}2`) as HTMLInputElement;
            
            // Extraer número de código de ingrediente (P01, C01, R01, etc...)
            let c_ingred = Number(cSize[i].c_ingred.slice(1));

            // Actualizar valores de FDS
            fdsCopy[groupNameTag]["L"+line.toString()+"_NOMBRE_P"+c_ingred] = x_comen1.value;
            fdsCopy[groupValueTag]["L"+line.toString()+"P"+c_ingred] = n_value.value;
        }

        transferProgress.value += 5;

        // Extraer data de Ingredientes Balanza / Emulsión
        let iSize = originalData[2] as Library.IngredientTable[];

        // Iterar TAGS de Balanza / Emulsión
        for ( let i = 0; i < iSize.length; i++) {
            // Extraer nombre y valor de ingredientes
            let x_comen1 = document.getElementById(`i${i + 1}4`) as HTMLInputElement;
            let n_value = document.getElementById(`i${i + 1}2`) as HTMLInputElement;
            
            // Extraer número de código de ingrediente (P01, C01, R01, etc...)
            let c_ingred = Number(iSize[i].c_ingred.slice(1));

            // Actualizar valores de FDS
            fdsCopy[groupNameTag]["L"+line.toString()+"_NOMBRE_P"+c_ingred] = x_comen1.value;
            fdsCopy[groupValueTag]["L"+line.toString()+"P"+c_ingred] = n_value.value;
        }

        transferProgress.value += 5;

        // Grupo de tags de parámetros
        let groupParamTag = "TV_PARAM" + line.toString();

        if (line > 0 && line < 4) {

            // Extraer data de Parámetros
            let ipsaSize = originalData[3] as Library.IngredientTable[];

            for ( let i = 0; i < ipsaSize.length; i++) {
                // Extraer valor de parámetro
                let n_value = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;

                // Extraer número de código de ingrediente (P01, C01, R01, etc...)
                let c_ingred = Number(ipsaSize[i].c_ingred.slice(1));

                // Actualizar valores de FDS
                if (line == 1 || c_ingred <= 26) {
                    fdsCopy[groupParamTag]["L"+line.toString()+"R"+c_ingred] = n_value.value;
                }
            }
        }

        transferProgress.value += 5;

        // Añadir TAGS a JSON para escribir en PLC: Nombre Ingredientes
        for (const [key, value] of Object.entries(fdsCopy[groupNameTag])) {
            dataJson.push({
                name: key,
                value: value
            });
        }

        transferProgress.value += 5;

        // Añadir TAGS a JSON para escribir en PLC: Cantidad Ingredientes
        for (const [key, value] of Object.entries(fdsCopy[groupValueTag])) {
            dataJson.push({
                name: key,
                value: value
            });
        }

        transferProgress.value += 5;

        // Añadir TAGS a JSON para escribir en PLC: Parámetros IPSA
        if (line > 0 && line < 4) {
            for (const [key, value] of Object.entries(fdsCopy[groupParamTag])) {
                dataJson.push({
                    name: key,
                    value: value
                });
            }
        }

        transferProgress.value += 5;

        // Escribir nombre de receta
        dataJson.push({
            name: "RECETA_LINEA" + line.toString(),
            value: this.recipeComboBox.text
        });

        transferProgress.value += 5;

        // Invocar API para escribir valores en PLC
        await this.app.pidManager.execute(JSON.stringify(dataJson), 21);

        transferProgress.value += 55;

        // Fin de cuenta de tiempo de ejecución
        const end = performance.now();

        // Informar carga de receta a PLC
        transferMsg.style.display = 'block';
        transferMsg.innerText = `Receta transferida al PLC en ${((end - start)/1000).toFixed(3)} segundos`;
    }

    async cmdComoAction(name:string) {
        if (name == "") {
            alert("Ingrese el nombre de la nueva receta");
            return;
        }

        let isRepeated = await Library.nombreDuplicado(this.copsa, name, this.app);
        if (isRepeated) {
            alert("El nombre ingresado ya existe");
        }
        let field = this.copsa ? "C" : "P";
        let value = await Library.buscaNuevoCodigo(this.copsa, this.app);
        
        if (value < 10) {
            field += "0";
        }

        let c_receta: string = field + value.toString();
        
        let queryString = `Use ENV_MARG; insert into RECETA(c_receta, x_receta) values('${c_receta}', '${name}');`;
        
        this.app.pidManager.execute(queryString, 5);

        let insertString = `Use ENV_MARG; insert into DETALLE_RECETA(c_receta, c_ingred, n_valor, x_comen1, x_comen2) values `;
        this.recipeJsonData[0].forEach((item: Library.IngredientTable, index: number) => {
            let c_ingred = item.c_ingred;
            let n_valor = Library.getInputElement(`h${index + 1}2`).value;
            let x_comen1 = Library.getInputElement(`h${index + 1}4`).value;
            let x_comen2 = Library.getInputElement(`h${index + 1}5`).value;
            insertString += `('${c_receta}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}'), `;
        });
        this.recipeJsonData[1].forEach((item: Library.IngredientTable, index: number) => {
            let c_ingred = item.c_ingred;
            let n_valor = Library.getInputElement(`c${index + 1}2`).value;
            let x_comen1 = Library.getInputElement(`c${index + 1}4`).value;
            let x_comen2 = Library.getInputElement(`c${index + 1}5`).value;
            insertString += `('${c_receta}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}'), `;
        });
        this.recipeJsonData[2].forEach((item: Library.IngredientTable, index: number) => {
            let c_ingred = item.c_ingred;
            let n_valor = Library.getInputElement(`i${index + 1}2`).value;
            let x_comen1 = Library.getInputElement(`i${index + 1}4`).value;
            let x_comen2 = Library.getInputElement(`i${index + 1}5`).value;
            insertString += `('${c_receta}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}'), `;
        });

        if (!this.copsa) {
            for (let i = 1; i <= 30; i++) {
                let c_ingred =  i < 10 ? `R0${i}` : `R${i}`;
                let n_valor = Library.getInputElement(`ipsa${i}`).value;
                insertString += `('${c_receta}', '${c_ingred}', '${n_valor}', '', ''), `;
            }
        }

        insertString = insertString.slice(0, -2);
        insertString += `;`;
        this.app.pidManager.execute(insertString, 6);

        console.log("Receta guardada con éxito");
        this.clearInputFields();
        await Library.listaCodigos(this.copsa, this.app);
        this.recipeComboBox.domObject().value = c_receta;
        this.recipeComboBox.select();
    }
}