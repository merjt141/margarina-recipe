import { WebCCSimulator } from "../simulation/simulation.js";
import * as Library from "../../modules/utilities.js";
export class CWCAbrir {
    constructor() {
        this.ingredientsHeadArray = ["x_ingred", "n_valor", "x_unidad", "x_comen1", "x_comen2"];
        this.recipeData = "";
        this.recipeJsonData = [[], [], [], [], []];
        this.recipeList = "";
        this.ingredientsDOM = [[], []];
        this.parametersDOM = [];
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
            },
            resume: [["idCodeRecipe", "sumatmg"],
                ["itmg", "icantidad", "iunidad", "idescripcion", "sumabalanza"]]
        };
        this.sqlAgent = new Library.SQLAgent();
        this.plcAgent = new Library.PLCAgent();
        this.recipeComboBox = new Library.ComboBoxRecipe("cbRecipes", this);
        this.webCCSimulator = new WebCCSimulator(this);
        this.copsa = false;
        this.buildInputList();
        Library.listaCodigos(this.copsa, this);
    }
    sqlQueryResponseHandler(response) {
        let packet = JSON.parse(response);
        switch (packet.action) {
            case "selectCombo":
                Library.listaCodigosCallback(packet.data, this);
                break;
            case "selectTable":
                this.recipeJsonData = [[], [], [], [], []];
                let data = JSON.parse(JSON.stringify(packet.data));
                data.forEach((item, index) => {
                    this.recipeJsonData[Number(item.t_ingred) - 1].push(item);
                });
                this.recipeData = JSON.stringify(this.recipeJsonData);
                this.writeRecipeData(this.recipeData);
                break;
            case "updateTable":
                console.log("Received update SQL confirmation");
                break;
        }
    }
    plcWriteResponseHandler(response) {
    }
    buildInputList() {
        // Hot and cold ingredients
        for (let i = 1; i <= 5; i++) {
            [2, 4, 5].forEach((j) => {
                this.recipeInputList.editable.tmg.push(`c${i}${j}`);
                this.recipeInputList.editable.tmg.push(`h${i}${j}`);
            });
        }
        // General ingredients
        for (let i = 1; i <= 17; i++) {
            [2, 4, 5].forEach((j) => {
                this.recipeInputList.editable.balanza.push(`i${i}${j}`);
            });
        }
        // IPSA parameters
        for (let i = 1; i <= 30; i++) {
            this.recipeInputList.editable.ipsa.push(`ipsa${i}`);
        }
    }
    enableInputs(editionDisabled) {
        this.recipeInputList.editable.tmg.forEach((item) => {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.balanza.forEach((item) => {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.ipsa.forEach((item) => {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.buttons.forEach((item) => {
            document.getElementById(item).style.color = editionDisabled ? "black" : "blue";
        });
    }
    clearInputFields() {
        document.getElementById("idCodeRecipe").value = "";
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 5; j++) {
                document.getElementById(`c${i}${j}`).value = "";
                document.getElementById(`h${i}${j}`).value = "";
            }
        }
        document.getElementById(`sumatmg`).value = "";
        for (let i = 1; i <= 17; i++) {
            for (let j = 1; j <= 5; j++) {
                document.getElementById(`i${i}${j}`).value = "";
            }
        }
        document.getElementById(`itmg`).value = "";
        document.getElementById(`icantidad`).value = "";
        document.getElementById(`iunidad`).value = "";
        document.getElementById(`idescripcion`).value = "";
        document.getElementById(`sumabalanza`).value = "";
        for (let i = 1; i <= 30; i++) {
            document.getElementById(`ipsa${i}`).value = "";
        }
    }
    /**
     * Populate CWCAbrir data of selected recipe
     * @param jsonString String data to parse table data
     */
    writeRecipeData(jsonString) {
        this.clearInputFields();
        this.recipeData = jsonString;
        const data = JSON.parse(this.recipeData);
        this.ingredientsDOM = [[], []];
        this.parametersDOM = [];
        document.getElementById("idCodeRecipe").value = data[0][0].c_receta;
        // Hot ingredients
        data[0].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`h${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(document.getElementById(`h${i + 1}2`));
        });
        // Cold ingredients
        data[1].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`c${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(document.getElementById(`c${i + 1}2`));
        });
        // Ingredients
        data[2].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`i${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[1].push(document.getElementById(`i${i + 1}2`));
        });
        // IPSA parameters
        data[3].forEach((item, i) => {
            const inputLabel = document.getElementById(`ipsa${i + 1}`);
            item.n_valor == "" ? inputLabel.value = "0" : inputLabel.value = item.n_valor;
            //inputLabel.value = item.n_valor;
            this.parametersDOM.push(document.getElementById(`ipsa${i + 1}`));
        });
        Library.refrescoSuma(this);
    }
    tagDatabaseWrite(line) {
        let apiJson = {
            action: "write",
            data: [{}],
        };
        let originalData = JSON.parse(this.recipeData);
        apiJson.data.pop();
        let hSize = originalData[0];
        for (let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`);
            let x_comen1 = document.getElementById(`h${i + 1}4`);
            let c_ingred = Number(hSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L" + line.toString() + "_NOMBRE_P" + c_ingred,
                value: x_comen1.value,
            };
            apiJson.data.push(tagData);
            tagData = {
                name: "L" + line.toString() + "P" + c_ingred,
                value: n_value.value,
            };
            apiJson.data.push(tagData);
        }
        let cSize = originalData[1];
        for (let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`);
            let x_comen1 = document.getElementById(`c${i + 1}4`);
            let c_ingred = Number(cSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L" + line.toString() + "_NOMBRE_P" + c_ingred,
                value: x_comen1.value,
            };
            apiJson.data.push(tagData);
            tagData = {
                name: "L" + line.toString() + "P" + c_ingred,
                value: n_value.value,
            };
            apiJson.data.push(tagData);
        }
        let iSize = originalData[2];
        for (let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`);
            let x_comen1 = document.getElementById(`i${i + 1}4`);
            let c_ingred = Number(iSize[i].c_ingred.slice(1));
            let tagData = {
                name: "L" + line.toString() + "_NOMBRE_P" + c_ingred,
                value: x_comen1.value,
            };
            apiJson.data.push(tagData);
            tagData = {
                name: "L" + line.toString() + "P" + c_ingred,
                value: n_value.value,
            };
            apiJson.data.push(tagData);
        }
        this.plcAgent.write(this, JSON.stringify(apiJson), "writeRecipe");
    }
    cmdGuardarClickEvent() {
        let recipeId = this.recipeComboBox.domObject.options[this.recipeComboBox.domObject.selectedIndex].id;
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
        let originalData = JSON.parse(this.recipeData);
        let hSize = originalData[0];
        for (let i = 0; i < hSize.length; i++) {
            let n_value = document.getElementById(`h${i + 1}2`);
            let x_comen1 = document.getElementById(`h${i + 1}4`);
            let x_comen2 = document.getElementById(`h${i + 1}5`);
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${hSize[i]["c_ingred"]}';`;
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let cSize = originalData[1];
        for (let i = 0; i < cSize.length; i++) {
            let n_value = document.getElementById(`c${i + 1}2`);
            let x_comen1 = document.getElementById(`c${i + 1}4`);
            let x_comen2 = document.getElementById(`c${i + 1}5`);
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${cSize[i]["c_ingred"]}';`;
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let iSize = originalData[2];
        for (let i = 0; i < iSize.length; i++) {
            let n_value = document.getElementById(`i${i + 1}2`);
            let x_comen1 = document.getElementById(`i${i + 1}4`);
            let x_comen2 = document.getElementById(`i${i + 1}5`);
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${n_value.value}, x_comen1 = '${x_comen1.value}', x_comen2 = '${x_comen2.value}' where c_receta = '${recipeId}' and c_ingred = '${iSize[i]["c_ingred"]}';`;
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
        let ipsaSize = originalData[3];
        for (let i = 0; i < ipsaSize.length; i++) {
            let n_value = document.getElementById(`ipsa${i + 1}`);
            let value;
            n_value.value == "0" ? value = null : value = n_value.value;
            let queryString = `Use ENV_MARG; update DETALLE_RECETA set n_valor = ${value} where c_receta = '${recipeId}' and c_ingred = '${ipsaSize[i]["c_ingred"]}';`;
            this.sqlAgent.execute(this, queryString, "updateTable");
        }
    }
    /**
     * Change visible tab on recipe control
     * @param {string} tabId - Tab to show on screen
     */
    cmdShowTabClick(tabId) {
        var _a;
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        (_a = document.getElementById(tabId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
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
        const win = window.open("./modules/tansfer.html", "PopopWindow", "width=600,height=240,scrollbars=no,resizable=no");
    }
    cmdImprimirClick() {
    }
    cmdSalirClick() {
    }
    cmdTransferirAction(line) {
        this.tagDatabaseWrite(line);
    }
}
