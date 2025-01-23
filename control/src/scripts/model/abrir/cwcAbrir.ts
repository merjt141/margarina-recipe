import { WebCCSimulator } from '../simulation/simulation';
import * as Library from '../../modules/utilities';

export class CWCAbrir implements Library.SQLObject, Library.PLCObject {

    formTransfer: Window | null;
    formSaveAs: Window | null;

    recipeJsonData: Library.IngredientTable[][];    // Raw table of recipe ingredients from SQL Server
    ingredientsHeadArray: string[];                 // List of ingredients table header
    
    ingredientsDOM: HTMLInputElement[][];           // DOM references to used ingredients field
    parametersDOM: HTMLInputElement[];              // DOM references to used parameters field

    editionDisabled: boolean;                       // Lock edition of fields
    recipeInputList: Library.RecipeInputList;

    sqlAgent: Library.SQLAgent;                     // SQL Sever agent for query control
    plcAgent: Library.PLCAgent;                     // PLC Agent for write tags value
    recipeComboBox: Library.ComboBoxRecipe;         // ComboBox object instance for recipe app

    webCCSimulator: WebCCSimulator;                 // For simulation in developer environment

    copsa: boolean;                                 // Area of production
    skipMessage: boolean;                           // Skip confirmation messages
    refreshCalculation: boolean;                    // Refresh calculated fields

    pid: any[][];                                   // Attribute to handle async functions

    constructor() {
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

        this.sqlAgent = new Library.SQLAgent();
        this.plcAgent = new Library.PLCAgent();
        this.recipeComboBox = new Library.ComboBoxRecipe("cbRecipes", this);

        this.webCCSimulator = new WebCCSimulator(this);

        this.copsa = false;
        this.skipMessage = false;
        this.refreshCalculation = false;

        this.pid = [[false,""], [false,""], [false,""], [false,""], [false,""], [false,""], [false,""], [false,""]];

        this.formTransfer = null;
        this.formSaveAs = null;

        this.buildInputList();
    }

    sqlQueryResponseHandler(response: string) {
        let packet = JSON.parse(response);
        switch(packet.action) {
            case "selectCombo":
                this.pid[0][1] = packet.data;
                this.pid[0][0] = true;
                break;
            case "selectTable":
                this.pid[1][1] = packet.data;
                this.pid[1][0] = true;
                break;
            case "updateTable":
                // Just update data, do not receive
                console.log("Received update SQL confirmation");
                break;
            case "duplicadoPeek":
                this.pid[3][1] = packet.data;
                this.pid[3][0] = true;
                break;
            case "selectComboPeek":
                this.pid[4][1] = packet.data;
                this.pid[4][0] = true;
                break;
            case "insertReceta":
                break;
            case "insertDetalle":
                break;
            case "deleteRecipe":
                this.pid[7][1] = "";
                this.pid[7][1] = true;
                break;
        }
    }

    plcWriteResponseHandler(response: string) {

    }

    async buildInputList(){
        // Hot and cold ingredients
        for (let i = 1; i <= 5; i++) {
            [2,4,5].forEach((j: number) => {
                this.recipeInputList.editable.tmg.push(`c${i}${j}`);
                this.recipeInputList.editable.tmg.push(`h${i}${j}`);
            });
        }
        // General ingredients
        for (let i = 1; i <= 17; i++) {
            [2,4,5].forEach((j:number) => {
                this.recipeInputList.editable.balanza.push(`i${i}${j}`)
            });
        }
        // IPSA parameters
        for (let i = 1; i <= 30; i++) {
            this.recipeInputList.editable.ipsa.push(`ipsa${i}`)
        }

        await Library.listaCodigos(this.copsa, this, this.pid[0]);
        this.recipeComboBox.select();
    }

    enableInputs(editionDisabled: boolean) {
        this.recipeInputList.editable.tmg.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });
        this.recipeInputList.editable.balanza.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });
        this.recipeInputList.editable.ipsa.forEach((item: string) => {
            (document.getElementById(item) as HTMLInputElement).disabled = editionDisabled;
        });
        this.recipeInputList.editable.buttons.forEach((item: string) => {
            (document.getElementById(item) as HTMLButtonElement).style.color = editionDisabled ? "black" : "blue";
        });
    }

    clearInputFields() {
        (document.getElementById("idCodeRecipe") as HTMLInputElement).value = "";
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                (document.getElementById(`c${i}${j}`) as HTMLInputElement).value = "";
                (document.getElementById(`h${i}${j}`) as HTMLInputElement).value = "";
            }
        }
        (document.getElementById(`sumatmg`) as HTMLInputElement).value = "";
        for (let i = 1; i <= 17; i++) {
            for (let j = 1; j <= 5; j++) {
                (document.getElementById(`i${i}${j}`) as HTMLInputElement).value = "";
            }
        }
        (document.getElementById(`itmg`) as HTMLInputElement).value = "";
        (document.getElementById(`icantidad`) as HTMLInputElement).value = "";
        (document.getElementById(`iunidad`) as HTMLInputElement).value = "";
        (document.getElementById(`idescripcion`) as HTMLInputElement).value = "";
        (document.getElementById(`sumabalanza`) as HTMLInputElement).value = "";
        for (let i = 1; i <= 30; i++) {
            (document.getElementById(`ipsa${i}`) as HTMLInputElement).value = "";
        }
    }

    writeRecipeData(jsonString: string) {

        this.recipeJsonData = [[],[],[],[],[]];
        let dataJson = JSON.parse(jsonString) as Library.IngredientTable[];
        dataJson.forEach((item: Library.IngredientTable, index: number) => {
            this.recipeJsonData[Number(item.t_ingred)-1].push(item);
        })

        this.clearInputFields();

        const data = this.recipeJsonData;

        this.ingredientsDOM = [[],[]];
        this.parametersDOM = [];
        
        (document.getElementById("idCodeRecipe") as HTMLInputElement).value = this.recipeComboBox.domObject().value;
        // Hot ingredients
        data[0].forEach((item: Library.IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;
                (document.getElementById(`h${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(Library.getInputElement(`h${i + 1}2`));
        });
        // Cold ingredients
        data[1].forEach((item: Library.IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;
                (document.getElementById(`c${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(Library.getInputElement(`c${i + 1}2`));
        });
        // Ingredients
        data[2].forEach((item: Library.IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof Library.IngredientTable = element as keyof Library.IngredientTable;
                (document.getElementById(`i${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[1].push(Library.getInputElement(`i${i + 1}2`));
        });
        Library.getInputElement("itmg").value = "Total Emulsificantes";
        Library.getInputElement("iunidad").value = "%";
        Library.getInputElement("idescripcion").value = "Emulsif. Calientes y Fríos";
        // IPSA parameters
        data[3].forEach((item: Library.IngredientTable, i:number) => {
            const inputLabel = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            item.n_valor == "" ? inputLabel.value = "" : inputLabel.value = item.n_valor;
            this.parametersDOM.push(document.getElementById(`ipsa${i + 1}`) as HTMLInputElement);
        });
        Library.refrescoSuma(this);
        Library.saveTemporalData(1);
    }

    cmdGuardarClickEvent() {
        let recipeId = this.recipeComboBox.selectedIndex;
        if (!recipeId) {
            alert("No se seleccionó receta");
            return;
        }
        
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
        for (let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`h${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`h${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${hSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let cSize = originalData[1] as Library.IngredientTable[];
        for (let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`c${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`c${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${cSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let iSize = originalData[2] as Library.IngredientTable[];
        for (let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`i${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`i${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${iSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let ipsaSize = originalData[3] as Library.IngredientTable[];
        for (let i = 0; i < ipsaSize.length; i++) {
            let n_value = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            let value: any;
            n_value.value == "0" ? value = null : value = n_value.value;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${value} where c_receta = '${recipeId}' and c_ingred = '${ipsaSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
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
            this.sqlAgent.execute(this, queryString, "deleteRecipe");

            await Library.waitPID(this.pid[7]);
            
            queryString = `Use ENV_MARG; delete from RECETA where c_receta = '${value}';`;
            this.sqlAgent.execute(this, queryString, "deleteRecipe");

            console.log("Receta eliminada con éxito");
            this.clearInputFields();
            await Library.listaCodigos(this.copsa, this, this.pid[0]);
            this.recipeComboBox.select();
        }
    }

    async cmdTransferirClick() {
        this.formTransfer = window.open("./public/modules/tansfer.html", "PopopWindow", "width=600,height=240,scrollbars=no,resizable=no");

        await new Promise<void>((resolve) => {
            if (this.formTransfer?.document.readyState === "complete") {
                resolve();
            } else {
                (this.formTransfer as Window).onload = () => resolve();
            }
        });

        (this.formTransfer?.document.getElementById("lblEtiqueta") as HTMLLabelElement).textContent = `Transferencia a Planta ${this.copsa ? "COPSA" : "IPSA"}`;
        (this.formTransfer?.document.getElementById("recipeCode") as HTMLInputElement).value = this.recipeComboBox.domObject().options[this.recipeComboBox.domObject().selectedIndex].text;
        (this.formTransfer?.document.getElementById("linea1") as HTMLButtonElement).disabled = this.copsa;
        (this.formTransfer?.document.getElementById("linea2") as HTMLButtonElement).disabled = this.copsa;
        (this.formTransfer?.document.getElementById("linea3") as HTMLButtonElement).disabled = this.copsa;
        (this.formTransfer?.document.getElementById("linea4") as HTMLButtonElement).disabled = !this.copsa;
        (this.formTransfer?.document.getElementById("linea5") as HTMLButtonElement).disabled = !this.copsa;
    }

    cmdImprimirClick() {

    }

    cmdSalirClick() {

    }

    cmdTransferirAction(line: number) {

        let userConfirmation = confirm(`¿Está seguro de transferir la receta seleccionada a la línea ${line}?`);

        if (!userConfirmation) {
            return;
        }

        let apiJson = {
            action: "write",
            data: [{}],
        };
        let originalData = this.recipeJsonData;

        apiJson.data.pop();
        let hSize = originalData[0] as Library.IngredientTable[];
        for ( let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`h${i + 1}4`) as HTMLInputElement;
            let c_ingred = Number(hSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L"+line.toString()+"_NOMBRE_P"+c_ingred,
                value: x_comen1.value,
            }
            apiJson.data.push(tagData);
            tagData = {
                name: "L"+line.toString()+"P"+c_ingred,
                value: n_value.value,
            }
            apiJson.data.push(tagData);
        }
        let cSize = originalData[1] as Library.IngredientTable[];
        for ( let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`c${i + 1}4`) as HTMLInputElement;
            let c_ingred = Number(cSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L"+line.toString()+"_NOMBRE_P"+c_ingred,
                value: x_comen1.value,
            }
            apiJson.data.push(tagData);
            tagData = {
                name: "L"+line.toString()+"P"+c_ingred,
                value: n_value.value,
            }
            apiJson.data.push(tagData);
        }
        let iSize = originalData[2] as Library.IngredientTable[];
        for ( let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`i${i + 1}4`) as HTMLInputElement;
            let c_ingred = Number(iSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L"+line.toString()+"_NOMBRE_P"+c_ingred,
                value: x_comen1.value,
            }
            apiJson.data.push(tagData);
            tagData = {
                name: "L"+line.toString()+"P"+c_ingred,
                value: n_value.value,
            }
            apiJson.data.push(tagData);
        }
        this.plcAgent.write(this, JSON.stringify(apiJson), "writeRecipe");
    }

    async cmdComoAction(name:string) {
        if (name == "") {
            alert("Ingrese el nombre de la nueva receta");
            return;
        }

        let isRepeated = await Library.nombreDuplicado(this.copsa, name, this, this.pid[3]);
        if (isRepeated) {
            alert("El nombre ingresado ya existe");
        }
        let field = this.copsa ? "C" : "P";
        let value = await Library.buscaNuevoCodigo(this.copsa, this, this.pid[4]);
        
        if (value < 10) {
            field += "0";
        }

        let c_receta: string = field + value.toString();
        
        let queryString = `Use ENV_MARG; insert into RECETA(c_receta, x_receta) values('${c_receta}', '${name}');`;
        
        this.sqlAgent.execute(this, queryString, "insertReceta");

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
        this.sqlAgent.execute(this, insertString, "insertDetalle");

        console.log("Receta guardada con éxito");
        this.clearInputFields();
        await Library.listaCodigos(this.copsa, this, this.pid[0]);
        this.recipeComboBox.domObject().value = c_receta;
        this.recipeComboBox.select();
    }
}