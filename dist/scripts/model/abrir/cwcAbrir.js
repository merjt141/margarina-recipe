var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebCCSimulator } from "../simulation/simulation.js";
import * as Library from "../../modules/utilities.js";
export class CWCAbrir {
    constructor() {
        this.recipeJsonData = [[], [], [], [], []];
        this.ingredientsHeadArray = ["x_ingred", "n_valor", "x_unidad", "x_comen1", "x_comen2"];
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
            resume: [["idCodeRecipe", "sumatmg"],
                ["itmg", "icantidad", "iunidad", "idescripcion", "sumabalanza"]]
        };
        this.sqlAgent = new Library.SQLAgent();
        this.plcAgent = new Library.PLCAgent();
        this.recipeComboBox = new Library.ComboBoxRecipe("cbRecipes", this);
        this.webCCSimulator = new WebCCSimulator(this);
        this.copsa = false;
        this.skipMessage = false;
        this.refreshCalculation = false;
        this.pid = [[false, ""], [false, ""], [false, ""], [false, ""], [false, ""]];
        this.buildInputList();
    }
    sqlQueryResponseHandler(response) {
        let packet = JSON.parse(response);
        switch (packet.action) {
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
        }
    }
    plcWriteResponseHandler(response) {
    }
    buildInputList() {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield Library.listaCodigos(this.copsa, this, this.pid[0]);
        });
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
    writeRecipeData(jsonString) {
        this.recipeJsonData = [[], [], [], [], []];
        let dataJson = JSON.parse(jsonString);
        dataJson.forEach((item, index) => {
            this.recipeJsonData[Number(item.t_ingred) - 1].push(item);
        });
        this.clearInputFields();
        const data = this.recipeJsonData;
        this.ingredientsDOM = [[], []];
        this.parametersDOM = [];
        document.getElementById("idCodeRecipe").value = data[0][0].c_receta;
        // Hot ingredients
        data[0].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`h${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(Library.getInputElement(`h${i + 1}2`));
        });
        // Cold ingredients
        data[1].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`c${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[0].push(Library.getInputElement(`c${i + 1}2`));
        });
        // Ingredients
        data[2].forEach((item, i) => {
            this.ingredientsHeadArray.forEach((element, j) => {
                const dynamicKey = element;
                document.getElementById(`i${i + 1}${j + 1}`).value = item[dynamicKey] || "";
            });
            this.ingredientsDOM[1].push(Library.getInputElement(`i${i + 1}2`));
        });
        Library.getInputElement("itmg").value = "Total Emulsificantes";
        Library.getInputElement("iunidad").value = "%";
        Library.getInputElement("idescripcion").value = "Emulsif. Calientes y Fríos";
        // IPSA parameters
        data[3].forEach((item, i) => {
            const inputLabel = document.getElementById(`ipsa${i + 1}`);
            item.n_valor == "" ? inputLabel.value = "" : inputLabel.value = item.n_valor;
            //inputLabel.value = item.n_valor;
            this.parametersDOM.push(document.getElementById(`ipsa${i + 1}`));
        });
        Library.refrescoSuma(this);
        Library.saveTemporalData(1);
    }
    tagDatabaseWrite(line) {
        let apiJson = {
            action: "write",
            data: [{}],
        };
        let originalData = this.recipeJsonData;
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
        let originalData = this.recipeJsonData;
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
        const win = window.open("./modules/saveas.html", "PopopWindow", "width=600,height=240,scrollbars=no,resizable=no");
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
    cmdComoAction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name == "") {
                alert("Ingrese el nombre de la nueva receta");
                return;
            }
            let isRepeated = yield Library.nombreDuplicado(this.copsa, name, this, this.pid[3]);
            if (isRepeated) {
                alert("El nombre ingresado ya existe");
            }
            let field = this.copsa ? "C" : "P";
            let value = yield Library.buscaNuevoCodigo(this.copsa, this, this.pid[4]);
            if (value < 10) {
                field += "0";
            }
            let code = field + value.toString();
            let queryString = `Use ENV_MARG; insert into RECETA(c_receta, x_receta) values('${code}', '${name}');`;
            this.sqlAgent.execute(this, queryString, "insertReceta");
            this.recipeJsonData[0].forEach((item, index) => {
                let c_ingred = item.c_ingred;
                let n_valor = Library.getInputElement(`h${index + 1}2`).value;
                let x_comen1 = Library.getInputElement(`h${index + 1}4`).value;
                let x_comen2 = Library.getInputElement(`h${index + 1}5`).value;
                let queryString = `Use ENV_MARG; insert into DETALLE_RECETA(c_receta, c_ingred, n_valor, x_comen1, x_comen2) values
            ('${code}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}');`;
                this.sqlAgent.execute(this, queryString, "insertDetalle");
            });
            this.recipeJsonData[1].forEach((item, index) => {
                let c_ingred = item.c_ingred;
                let n_valor = Library.getInputElement(`c${index + 1}2`).value;
                let x_comen1 = Library.getInputElement(`c${index + 1}4`).value;
                let x_comen2 = Library.getInputElement(`c${index + 1}5`).value;
                let queryString = `Use ENV_MARG; insert into DETALLE_RECETA(c_receta, c_ingred, n_valor, x_comen1, x_comen2) values
            ('${code}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}');`;
                this.sqlAgent.execute(this, queryString, "insertDetalle");
            });
            this.recipeJsonData[2].forEach((item, index) => {
                let c_ingred = item.c_ingred;
                let n_valor = Library.getInputElement(`i${index + 1}2`).value;
                let x_comen1 = Library.getInputElement(`i${index + 1}4`).value;
                let x_comen2 = Library.getInputElement(`i${index + 1}5`).value;
                let queryString = `Use ENV_MARG; insert into DETALLE_RECETA(c_receta, c_ingred, n_valor, x_comen1, x_comen2) values
            ('${code}', '${c_ingred}', '${n_valor}', '${x_comen1}','${x_comen2}');`;
                this.sqlAgent.execute(this, queryString, "insertDetalle");
            });
        });
    }
}
