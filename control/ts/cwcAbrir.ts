import { WebCCSimulator } from "./simulation.js"
import { ComboBoxRecipe, PLCAgent, SQLAgent } from "./objects.js";
import { IngredientTable, RecipeInputList } from "./utilities.js";
import { validateInputElements } from "./utilities.js";

export class CWCAbrir {
    recipeData: string;                 // Recipe data obtained through WinCC query
    recipeJsonData: IngredientTable[][];
    ingredientsHeadArray = ["x_ingred", "n_valor", "x_unidad", "x_comen1", "x_comen2"];
    numberFields: HTMLInputElement[];

    editionDisabled: boolean;
    recipeInputList: RecipeInputList;

    sqlAgent: SQLAgent;                 // SQL Sever agent for query control
    plcAgent: PLCAgent;                 // PLC Agent for write tags value
    recipeComboBox: ComboBoxRecipe;     // ComboBox object instance for recipe app 

    webCCSimulator: WebCCSimulator;

    copsa: boolean;

    constructor() {
        this.recipeData = "";
        this.recipeJsonData = [[],[],[],[],[]];
        this.numberFields = [];

        this.editionDisabled = true;
        this.recipeInputList = {
            editable: {
                tmg: [],
                balanza: [],
                ipsa: [],
                buttons: ["button-modify-tmg", "button-modify-balanza", "button-modify-ipsa"],
            },
            noneditable: {
                tmg: [],
                balanza: [],
                ipsa: [],
            }
        };
        this.buildInputList();

        this.sqlAgent = new SQLAgent();
        this.plcAgent = new PLCAgent();
        this.recipeComboBox = new ComboBoxRecipe("cbRecipes", this);

        this.webCCSimulator = new WebCCSimulator(this);

        this.copsa = false;
    }

    sqlQueryResponseHandler(response: string) {
        let packet = JSON.parse(response);

        if (packet.action == "table") {
            this.recipeJsonData = [[],[],[],[],[]];

            let data = JSON.parse(JSON.stringify(packet.data)) as IngredientTable[];
            data.forEach((item: IngredientTable, index: number) => {
                this.recipeJsonData[Number(item.t_ingred)-1].push(item);
            })

            this.recipeData = JSON.stringify(this.recipeJsonData);
            this.writeRecipeData(this.recipeData);
        }

    }

    plcWriteResponseHandler(response: string) {

    }

    buildInputList(){
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

    /**
     * Populate CWCAbrir data of selected recipe
     * @param jsonString String data to parse table data
     */
    writeRecipeData(jsonString: string) {
        this.clearInputFields();
        this.recipeData = jsonString;
        const data = JSON.parse(this.recipeData) as IngredientTable[][];
        let sumaTMG = 0;
        (document.getElementById("idCodeRecipe") as HTMLInputElement).value = data[0][0].c_receta;
        // Hot ingredients
        data[0].forEach((item: IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof IngredientTable = element as keyof IngredientTable;
                (document.getElementById(`h${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.numberFields.push(document.getElementById(`h${i + 1}2`) as HTMLInputElement);
            sumaTMG += Number(item.n_valor);
        });
        // Cold ingredients
        data[1].forEach((item: IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof IngredientTable = element as keyof IngredientTable;
                (document.getElementById(`c${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.numberFields.push(document.getElementById(`c${i + 1}2`) as HTMLInputElement);
            sumaTMG += Number(item.n_valor);
        });
        (document.getElementById("sumatmg") as HTMLInputElement).value = sumaTMG.toString();
        // Ingredients
        let sumaBalanza = 0;
        data[2].forEach((item: IngredientTable, i: number) => {
            this.ingredientsHeadArray.forEach((element: string, j: number) => {
                const dynamicKey: keyof IngredientTable = element as keyof IngredientTable;
                (document.getElementById(`i${i + 1}${j + 1}`) as HTMLInputElement).value = item[dynamicKey] || "";
            });
            this.numberFields.push(document.getElementById(`i${i + 1}2`) as HTMLInputElement);
            sumaBalanza += Number(item.n_valor);
        });
        (document.getElementById("icantidad") as HTMLInputElement).value = sumaBalanza.toString();
        // IPSA parameters
        data[3].forEach((item: IngredientTable, i:number) => {
            const inputLabel = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            item.n_valor == "" ? inputLabel.value = "0" : inputLabel.value = item.n_valor;
            //inputLabel.value = item.n_valor;
            this.numberFields.push(document.getElementById(`ipsa${i + 1}`) as HTMLInputElement);
        });
    }

    tagDatabaseWrite(line: number) {
        let apiJson = {
            action: "write",
            data: [{}],
        };
        let originalData = JSON.parse(this.recipeData);

        apiJson.data.pop();
        let hSize = originalData[0] as IngredientTable[];
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
        let cSize = originalData[1] as IngredientTable[];
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
        let iSize = originalData[2] as IngredientTable[];
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
        this.plcAgent.write(this, JSON.stringify(apiJson));
    }

    cmdGuardarClickEvent() {
        let recipeId = this.recipeComboBox.domObject.options[this.recipeComboBox.domObject.selectedIndex].id;
        if (!recipeId) {
            alert("No se seleccionó receta");
            return;
        }
        
        if (!validateInputElements(this.numberFields)) {
            return;
        }
    
        let originalData = JSON.parse(this.recipeData);

        let hSize = originalData[0] as IngredientTable[];
        for (let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`h${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`h${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${hSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString);
        }
        let cSize = originalData[1] as IngredientTable[];
        for (let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`c${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`c${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${cSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString);
        }
        let iSize = originalData[2] as IngredientTable[];
        for (let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`) as HTMLInputElement;
            let x_comen1 = document.getElementById(`i${i + 1}4`) as HTMLInputElement;
            let x_comen2 = document.getElementById(`i${i + 1}5`) as HTMLInputElement;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${iSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString);
        }
        let ipsaSize = originalData[3] as IngredientTable[];
        for (let i = 0; i < ipsaSize.length; i++) {
            let n_value = document.getElementById(`ipsa${i + 1}`) as HTMLInputElement;
            let value: any;
            n_value.value == "0" ? value = null : value = n_value.value;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${value} where c_receta = '${recipeId}' and c_ingred = '${ipsaSize[i]["c_ingred"]}';`
            this.sqlAgent.execute(this, queryString);
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

    }

    cmdEliminarClick() {

    }

    cmdTransferirClick() {
        window.open("./views/tansfer.html", "PopopWindow", "width=600,height=400,scrollbars=yes,resizable=yes");
    }

    cmdImprimirClick() {

    }

    cmdSalirClick() {

    }

    cmdTransferirAction(line: number) {
        this.tagDatabaseWrite(line);
    }
}