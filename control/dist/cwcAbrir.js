import { WebCCSimulator } from "./simulation.js";
import { ComboBoxRecipe, PLCAgent, SQLAgent } from "./objects.js";
import { validateInputElements } from "./utilities.js";
var CWCAbrir = /** @class */ (function () {
    function CWCAbrir() {
        this.ingredientsHeadArray = ["x_ingred", "n_valor", "x_unidad", "x_comen1", "x_comen2"];
        this.recipeData = "";
        this.recipeJsonData = [[], [], [], [], []];
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
    CWCAbrir.prototype.sqlQueryResponseHandler = function (response) {
        var _this = this;
        var packet = JSON.parse(response);
        if (packet.action == "table") {
            this.recipeJsonData = [[], [], [], [], []];
            var data = JSON.parse(JSON.stringify(packet.data));
            data.forEach(function (item, index) {
                _this.recipeJsonData[Number(item.t_ingred) - 1].push(item);
            });
            this.recipeData = JSON.stringify(this.recipeJsonData);
            this.writeRecipeData(this.recipeData);
        }
        if (packet.action == "update") {
            console.log("Received update SQL confirmation");
        }
    };
    CWCAbrir.prototype.plcWriteResponseHandler = function (response) {
    };
    CWCAbrir.prototype.buildInputList = function () {
        var _this = this;
        var _loop_1 = function (i) {
            [2, 4, 5].forEach(function (j) {
                _this.recipeInputList.editable.tmg.push("c".concat(i).concat(j));
                _this.recipeInputList.editable.tmg.push("h".concat(i).concat(j));
            });
        };
        // Hot and cold ingredients
        for (var i = 1; i <= 5; i++) {
            _loop_1(i);
        }
        var _loop_2 = function (i) {
            [2, 4, 5].forEach(function (j) {
                _this.recipeInputList.editable.balanza.push("i".concat(i).concat(j));
            });
        };
        // General ingredients
        for (var i = 1; i <= 17; i++) {
            _loop_2(i);
        }
        // IPSA parameters
        for (var i = 1; i <= 30; i++) {
            this.recipeInputList.editable.ipsa.push("ipsa".concat(i));
        }
    };
    CWCAbrir.prototype.enableInputs = function (editionDisabled) {
        this.recipeInputList.editable.tmg.forEach(function (item) {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.balanza.forEach(function (item) {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.ipsa.forEach(function (item) {
            document.getElementById(item).disabled = editionDisabled;
        });
        this.recipeInputList.editable.buttons.forEach(function (item) {
            document.getElementById(item).style.color = editionDisabled ? "black" : "blue";
        });
    };
    CWCAbrir.prototype.clearInputFields = function () {
        document.getElementById("idCodeRecipe").value = "";
        for (var i = 1; i <= 5; i++) {
            for (var j = 1; j <= 5; j++) {
                document.getElementById("c".concat(i).concat(j)).value = "";
                document.getElementById("h".concat(i).concat(j)).value = "";
            }
        }
        document.getElementById("sumatmg").value = "";
        for (var i = 1; i <= 17; i++) {
            for (var j = 1; j <= 5; j++) {
                document.getElementById("i".concat(i).concat(j)).value = "";
            }
        }
        document.getElementById("itmg").value = "";
        document.getElementById("icantidad").value = "";
        document.getElementById("iunidad").value = "";
        document.getElementById("idescripcion").value = "";
        document.getElementById("sumabalanza").value = "";
        for (var i = 1; i <= 30; i++) {
            document.getElementById("ipsa".concat(i)).value = "";
        }
    };
    /**
     * Populate CWCAbrir data of selected recipe
     * @param jsonString String data to parse table data
     */
    CWCAbrir.prototype.writeRecipeData = function (jsonString) {
        var _this = this;
        this.clearInputFields();
        this.recipeData = jsonString;
        var data = JSON.parse(this.recipeData);
        var sumaTMG = 0;
        document.getElementById("idCodeRecipe").value = data[0][0].c_receta;
        // Hot ingredients
        data[0].forEach(function (item, i) {
            _this.ingredientsHeadArray.forEach(function (element, j) {
                var dynamicKey = element;
                document.getElementById("h".concat(i + 1).concat(j + 1)).value = item[dynamicKey] || "";
            });
            _this.numberFields.push(document.getElementById("h".concat(i + 1, "2")));
            sumaTMG += Number(item.n_valor);
        });
        // Cold ingredients
        data[1].forEach(function (item, i) {
            _this.ingredientsHeadArray.forEach(function (element, j) {
                var dynamicKey = element;
                document.getElementById("c".concat(i + 1).concat(j + 1)).value = item[dynamicKey] || "";
            });
            _this.numberFields.push(document.getElementById("c".concat(i + 1, "2")));
            sumaTMG += Number(item.n_valor);
        });
        document.getElementById("sumatmg").value = sumaTMG.toString();
        // Ingredients
        var sumaBalanza = 0;
        data[2].forEach(function (item, i) {
            _this.ingredientsHeadArray.forEach(function (element, j) {
                var dynamicKey = element;
                document.getElementById("i".concat(i + 1).concat(j + 1)).value = item[dynamicKey] || "";
            });
            _this.numberFields.push(document.getElementById("i".concat(i + 1, "2")));
            sumaBalanza += Number(item.n_valor);
        });
        document.getElementById("icantidad").value = sumaBalanza.toString();
        // IPSA parameters
        data[3].forEach(function (item, i) {
            var inputLabel = document.getElementById("ipsa".concat(i + 1));
            item.n_valor == "" ? inputLabel.value = "0" : inputLabel.value = item.n_valor;
            //inputLabel.value = item.n_valor;
            _this.numberFields.push(document.getElementById("ipsa".concat(i + 1)));
        });
    };
    CWCAbrir.prototype.tagDatabaseWrite = function (line) {
        var apiJson = {
            action: "write",
            data: [{}],
        };
        var originalData = JSON.parse(this.recipeData);
        apiJson.data.pop();
        var hSize = originalData[0];
        for (var i = 0; i < hSize.length; i++) {
            var n_value = document.getElementById("h".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("h".concat(i + 1, "4"));
            var c_ingred = Number(hSize[i].c_ingred.slice(1));
            var tagData = {
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
        var cSize = originalData[1];
        for (var i = 0; i < cSize.length; i++) {
            var n_value = document.getElementById("c".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("c".concat(i + 1, "4"));
            var c_ingred = Number(cSize[i].c_ingred.slice(1));
            var tagData = {
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
        var iSize = originalData[2];
        for (var i = 0; i < iSize.length; i++) {
            var n_value = document.getElementById("i".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("i".concat(i + 1, "4"));
            var c_ingred = Number(iSize[i].c_ingred.slice(1));
            var tagData = {
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
        this.plcAgent.write(this, JSON.stringify(apiJson));
    };
    CWCAbrir.prototype.cmdGuardarClickEvent = function () {
        var recipeId = this.recipeComboBox.domObject.options[this.recipeComboBox.domObject.selectedIndex].id;
        if (!recipeId) {
            alert("No se seleccionó receta");
            return;
        }
        if (!validateInputElements(this.numberFields)) {
            return;
        }
        var originalData = JSON.parse(this.recipeData);
        var hSize = originalData[0];
        for (var i = 0; i < hSize.length; i++) {
            var n_value = document.getElementById("h".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("h".concat(i + 1, "4"));
            var x_comen2 = document.getElementById("h".concat(i + 1, "5"));
            var queryString = "Use ENV_MARG; update DETALLE_RECETA set n_valor = ".concat(n_value.value, ", x_comen1 = '").concat(x_comen1.value, "', x_comen2 = '").concat(x_comen2.value, "' where c_receta = '").concat(recipeId, "' and c_ingred = '").concat(hSize[i]["c_ingred"], "';");
            this.sqlAgent.execute(this, queryString);
        }
        var cSize = originalData[1];
        for (var i = 0; i < cSize.length; i++) {
            var n_value = document.getElementById("c".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("c".concat(i + 1, "4"));
            var x_comen2 = document.getElementById("c".concat(i + 1, "5"));
            var queryString = "Use ENV_MARG; update DETALLE_RECETA set n_valor = ".concat(n_value.value, ", x_comen1 = '").concat(x_comen1.value, "', x_comen2 = '").concat(x_comen2.value, "' where c_receta = '").concat(recipeId, "' and c_ingred = '").concat(cSize[i]["c_ingred"], "';");
            this.sqlAgent.execute(this, queryString);
        }
        var iSize = originalData[2];
        for (var i = 0; i < iSize.length; i++) {
            var n_value = document.getElementById("i".concat(i + 1, "2"));
            var x_comen1 = document.getElementById("i".concat(i + 1, "4"));
            var x_comen2 = document.getElementById("i".concat(i + 1, "5"));
            var queryString = "Use ENV_MARG; update DETALLE_RECETA set n_valor = ".concat(n_value.value, ", x_comen1 = '").concat(x_comen1.value, "', x_comen2 = '").concat(x_comen2.value, "' where c_receta = '").concat(recipeId, "' and c_ingred = '").concat(iSize[i]["c_ingred"], "';");
            this.sqlAgent.execute(this, queryString);
        }
        var ipsaSize = originalData[3];
        for (var i = 0; i < ipsaSize.length; i++) {
            var n_value = document.getElementById("ipsa".concat(i + 1));
            var value = void 0;
            n_value.value == "0" ? value = null : value = n_value.value;
            var queryString = "Use ENV_MARG; update DETALLE_RECETA set n_valor = ".concat(value, " where c_receta = '").concat(recipeId, "' and c_ingred = '").concat(ipsaSize[i]["c_ingred"], "';");
            this.sqlAgent.execute(this, queryString);
        }
    };
    /**
     * Change visible tab on recipe control
     * @param {string} tabId - Tab to show on screen
     */
    CWCAbrir.prototype.cmdShowTabClick = function (tabId) {
        var _a;
        document.querySelectorAll('.tab-content').forEach(function (tab) {
            tab.classList.remove('active');
        });
        (_a = document.getElementById(tabId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
    };
    CWCAbrir.prototype.cmdModificarClick = function () {
        this.editionDisabled = !this.editionDisabled;
        this.enableInputs(this.editionDisabled);
    };
    CWCAbrir.prototype.cmdActualizarClick = function () {
        this.recipeComboBox.select();
    };
    CWCAbrir.prototype.cmdGuardarClick = function () {
        this.cmdGuardarClickEvent();
    };
    CWCAbrir.prototype.cmdComoClick = function () {
    };
    CWCAbrir.prototype.cmdEliminarClick = function () {
    };
    CWCAbrir.prototype.cmdTransferirClick = function () {
        var win = window.open("./views/tansfer.html", "PopopWindow", "width=600,height=240,scrollbars=no,resizable=no");
    };
    CWCAbrir.prototype.cmdImprimirClick = function () {
    };
    CWCAbrir.prototype.cmdSalirClick = function () {
    };
    CWCAbrir.prototype.cmdTransferirAction = function (line) {
        this.tagDatabaseWrite(line);
    };
    return CWCAbrir;
}());
export { CWCAbrir };
