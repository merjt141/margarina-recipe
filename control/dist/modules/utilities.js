var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var ingredientsPropArray = ["x_ingred", "n_valor"];
var ComboBoxRecipe = /** @class */ (function () {
    function ComboBoxRecipe(domId, object) {
        var _this = this;
        this.domObject = document.getElementById(domId);
        this.object = object;
        this.domObject.addEventListener('change', function () {
            _this.select();
        });
    }
    /**
     * Update combo box data
     * @param {string} data
     */
    ComboBoxRecipe.prototype.update = function (data) {
        var obj = JSON.parse(typeof (data) == "string" ? data : JSON.stringify(data));
        this.domObject.textContent = '';
        for (var i = 0; i < obj.length; i++) {
            var option = document.createElement("option");
            option.id = obj[i].c_receta;
            option.innerHTML = obj[i].x_receta;
            this.domObject.appendChild(option);
        }
    };
    /**
     * Select element from combo box
     */
    ComboBoxRecipe.prototype.select = function () {
        var selectedBox = this.domObject.options[this.domObject.selectedIndex].id;
        var queryString = "Use ENV_MARG; select r.c_receta, r.x_receta, d.n_valor, d.x_comen1, d.x_comen2, i.c_ingred, i.x_ingred, i.x_unidad, i.t_ingred ";
        queryString += "from RECETA r inner join DETALLE_RECETA d on r.c_receta = d.c_receta inner join INGREDIENTES i on d.c_ingred = i.c_ingred ";
        queryString += "where r.c_receta = '".concat(selectedBox, "';");
        this.object.sqlAgent.execute(this.object, queryString, "selectTable");
    };
    return ComboBoxRecipe;
}());
export { ComboBoxRecipe };
var SQLAgent = /** @class */ (function () {
    function SQLAgent() {
    }
    SQLAgent.prototype.execute = function (object, queryString, action) {
        console.log(queryString);
        try {
            WebCC.Events.fire('executeQuery', queryString, action);
        }
        catch (error) {
            console.log("Not access to WebCC API: Go Simulation");
            object.webCCSimulator.executeQuery(queryString, action);
        }
    };
    SQLAgent.prototype.response = function (object, response) {
        object.sqlQueryResponseHandler(response);
    };
    return SQLAgent;
}());
export { SQLAgent };
var PLCAgent = /** @class */ (function () {
    function PLCAgent() {
    }
    PLCAgent.prototype.write = function (object, writeCommand, action) {
        console.log(writeCommand);
        try {
            WebCC.Events.fire('writePLC', writeCommand, action);
        }
        catch (error) {
            console.log("Not access to WebCC API");
            object.webCCSimulator.writePLC(writeCommand);
        }
    };
    PLCAgent.prototype.response = function (object, response) {
        object.plcWriteResponseHandler(response);
    };
    return PLCAgent;
}());
export { PLCAgent };
var DataTable = {
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
};
var MemoryData = [__assign({}, DataTable), __assign({}, DataTable)];
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
/**
 * Get HTMLInputElement from id
 * @param object Id of HTMLInputElement
 * @returns DOM object
 */
export function getInputElement(object) {
    return document.getElementById(object);
}
/**
 * Update the total value
 * @param object Custom Web Control Abrir
 */
export function refrescoSuma(object) {
    var sumaTMG = 0;
    var sumaBalanza = 0;
    validateInputElements(object.ingredientsDOM[0]);
    object.ingredientsDOM[0].forEach(function (item, i) {
        sumaTMG += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[0][1]).value = sumaTMG.toString();
    getInputElement(object.recipeInputList.resume[1][1]).value = sumaTMG.toString();
    validateInputElements(object.ingredientsDOM[1]);
    object.ingredientsDOM[1].forEach(function (item, i) {
        sumaBalanza += Number(item.value);
    });
    getInputElement(object.recipeInputList.resume[1][4]).value = sumaBalanza.toString();
}
/**
 * Save temporal data of input fields
 * @param index Number of memory to save data
 */
export function saveTemporalData(index) {
    for (var i = 1; i <= 5; i++) {
        MemoryData[index].tmg.value[i - 1] = getInputElement("h".concat(i, "2")).value;
        MemoryData[index].tmg.description[i - 1] = getInputElement("h".concat(i, "4")).value;
        MemoryData[index].tmg.comment[i - 1] = getInputElement("h".concat(i, "5")).value;
    }
    for (var i = 6; i <= 10; i++) {
        MemoryData[index].tmg.value[i - 1] = getInputElement("c".concat(i - 5, "2")).value;
        MemoryData[index].tmg.description[i - 1] = getInputElement("c".concat(i - 5, "4")).value;
        MemoryData[index].tmg.comment[i - 1] = getInputElement("c".concat(i - 5, "5")).value;
    }
    for (var i = 1; i <= 17; i++) {
        MemoryData[index].balanza.value[i - 1] = getInputElement("i".concat(i, "2")).value;
        MemoryData[index].balanza.description[i - 1] = getInputElement("i".concat(i, "4")).value;
        MemoryData[index].balanza.comment[i - 1] = getInputElement("i".concat(i, "5")).value;
    }
    for (var i = 1; i <= 30; i++) {
        MemoryData[index].parameters[i - 1] = getInputElement("ipsa".concat(i)).value;
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
    for (var i = 1; i <= 8; i++) {
        var value = getInputElement("ipsa".concat(i)).value;
        if (isNaN(Number(value)) || value == "") {
            alert("El valor de los parámetros marcados con \"*\" deben ser numéricos mayor a cero");
            return false;
        }
        if (Number(value) <= 0) {
            alert("El valor de los parámetros marcados con \"*\" deben ser mayor a cero");
            return false;
        }
    }
    for (var i = 9; i <= 30; i++) {
        var value = getInputElement("ipsa".concat(i)).value;
        if (isNaN(Number(value))) {
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
export function valoresOk(object) {
    object.ingredientsDOM[1].forEach(function (item, index) {
        var value = item.value;
        if (isNaN(Number(value)) || value == "") {
            var ingredient = getInputElement("i".concat(index + 1, "1")).value;
            console.log("El valor del ingrediente ".concat(ingredient, " debe ser num\u00E9rico"));
            return false;
        }
        if (Number(value) <= 0) {
            var ingredient = getInputElement("i".concat(index + 1, "1")).value;
            console.log("El valor del ingrediente ".concat(ingredient, " debe ser mayor a cero"));
            return false;
        }
        return true;
    });
}
export function listaCodigos(planta, object) {
    var queryString = "Use ENV_MARG; select x_receta, c_receta from RECETA where left(c_receta, 1) = '".concat(planta ? 'C' : 'P', "' order by c_receta;");
    object.sqlAgent.execute(object, queryString, "selectCombo");
}
export function listaCodigosCallback(jsonString, object) {
    object.recipeComboBox.update(jsonString);
}
