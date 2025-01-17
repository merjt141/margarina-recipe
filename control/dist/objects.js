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
        var obj = JSON.parse(data);
        this.domObject.textContent = '';
        for (var i = 0; i < obj.length; i++) {
            var option = document.createElement("option");
            option.id = obj[i].id;
            option.innerHTML = obj[i].stateName;
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
        this.object.sqlAgent.execute(this.object, queryString);
    };
    return ComboBoxRecipe;
}());
export { ComboBoxRecipe };
var SQLAgent = /** @class */ (function () {
    function SQLAgent() {
    }
    SQLAgent.prototype.execute = function (object, queryString) {
        console.log(queryString);
        try {
            WebCC.Events.fire('executeQuery', queryString);
        }
        catch (error) {
            console.log("Not access to WebCC API: Go Simulation");
            object.webCCSimulator.executeQuery(queryString);
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
    PLCAgent.prototype.write = function (object, writeCommand) {
        console.log(writeCommand);
        try {
            WebCC.Events.fire('writePLC', writeCommand);
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
