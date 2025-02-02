var WebCCSimulator = /** @class */ (function () {
    function WebCCSimulator(object) {
        this.jsonString1 = JSON.stringify({
            action: "table",
            data: [
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "GRINDSTED PS 404", "x_comen2": "", "c_ingred": "P02", "x_ingred": "Emulsif. Caliente1 TMG", "x_unidad": "%", "t_ingred": "1" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.8", "x_comen1": "LECITINA DE SOYA", "x_comen2": "", "c_ingred": "P23", "x_ingred": "Emulsif. Frío1 TMG", "x_unidad": "%", "t_ingred": "2" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "80", "x_comen1": "HDHOJAL", "x_comen2": "01-07-16.", "c_ingred": "P01", "x_ingred": "Grasa", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "13.94", "x_comen1": "MICROFILTRADA", "x_comen2": "", "c_ingred": "P05", "x_ingred": "Agua", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "3.99", "x_comen1": "SOLUCION DE SAL AL 25%", "x_comen2": "", "c_ingred": "P06", "x_ingred": "Salmuera", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.27", "x_comen1": "AROMAS COLORANTES", "x_comen2": "", "c_ingred": "P08", "x_ingred": "Ingrediente1 TPB", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "72", "x_comen1": "", "": "", "c_ingred": "R01", "x_ingred": "TMG_SP_TempNivelMedio", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "68", "x_comen1": "", "": "", "c_ingred": "R02", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "5", "x_comen1": "", "": "", "c_ingred": "R03", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "5", "x_comen1": "", "": "", "c_ingred": "R04", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R05", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R06", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R07", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R08", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R09", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R10", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R11", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "100", "x_comen1": "", "": "", "c_ingred": "R12", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R13", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R14", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R15", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1.8", "x_comen1": "", "": "", "c_ingred": "R16", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.3", "x_comen1": "", "": "", "c_ingred": "R17", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.6", "x_comen1": "", "": "", "c_ingred": "R18", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "58", "x_comen1": "", "": "", "c_ingred": "R19", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "58", "x_comen1": "", "": "", "c_ingred": "R20", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R21", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R22", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R23", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R24", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R25", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R26", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "500", "x_comen1": "", "": "", "c_ingred": "R27", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.01", "x_comen1": "", "": "", "c_ingred": "R28", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.2", "x_comen1": "", "": "", "c_ingred": "R29", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R30", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
            ]
        });
        this.jsonString2 = JSON.stringify({
            action: "table",
            data: [
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1.1", "x_comen1": "GRINDSTED PS 404", "x_comen2": "", "c_ingred": "P02", "x_ingred": "Emulsif. Caliente1 TMG", "x_unidad": "%", "t_ingred": "1" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.8", "x_comen1": "LECITINA DE SOYA", "x_comen2": "", "c_ingred": "P23", "x_ingred": "Emulsif. Frío1 TMG", "x_unidad": "%", "t_ingred": "2" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "80", "x_comen1": "HDHOJAL", "x_comen2": "01-07-16.", "c_ingred": "P01", "x_ingred": "Grasa", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "13.94", "x_comen1": "MICROFILTRADA", "x_comen2": "", "c_ingred": "P05", "x_ingred": "Agua", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "3.99", "x_comen1": "SOLUCION DE SAL AL 25%", "x_comen2": "", "c_ingred": "P06", "x_ingred": "Salmuera", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.27", "x_comen1": "AROMAS COLORANTES", "x_comen2": "", "c_ingred": "P08", "x_ingred": "Ingrediente1 TPB", "x_unidad": "%", "t_ingred": "3" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "72", "x_comen1": "", "": "", "c_ingred": "R01", "x_ingred": "TMG_SP_TempNivelMedio", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "68", "x_comen1": "", "": "", "c_ingred": "R02", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "5", "x_comen1": "", "": "", "c_ingred": "R03", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "5", "x_comen1": "", "": "", "c_ingred": "R04", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R05", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R06", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R07", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1", "x_comen1": "", "": "", "c_ingred": "R08", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R09", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R10", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R11", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "100", "x_comen1": "", "": "", "c_ingred": "R12", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R13", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R14", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R15", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "1.8", "x_comen1": "", "": "", "c_ingred": "R16", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.3", "x_comen1": "", "": "", "c_ingred": "R17", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.6", "x_comen1": "", "": "", "c_ingred": "R18", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "58", "x_comen1": "", "": "", "c_ingred": "R19", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "58", "x_comen1": "", "": "", "c_ingred": "R20", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R21", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R22", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "", "x_comen1": "", "": "", "c_ingred": "R23", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R24", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R25", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.5", "x_comen1": "", "": "", "c_ingred": "R26", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "500", "x_comen1": "", "": "", "c_ingred": "R27", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.01", "x_comen1": "", "": "", "c_ingred": "R28", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.2", "x_comen1": "", "": "", "c_ingred": "R29", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
                { "c_receta": "P01", "x_receta": "P. HOJALDRE 2 Kg.", "n_valor": "0.05", "x_comen1": "", "": "", "c_ingred": "R30", "x_ingred": "", "x_unidad": "%", "t_ingred": "4" },
            ]
        });
        this.object = object;
    }
    WebCCSimulator.prototype.executeQuery = function (jsonString) {
        this.object.sqlAgent.response(this.object, this.jsonString1);
    };
    WebCCSimulator.prototype.writePLC = function (writeCommand) {
        console.log(writeCommand);
        var writeData = JSON.parse(writeCommand);
        var action = writeData.action;
        var data = writeData.data;
        var tableTagSet = [];
        for (var i in data) {
            var dataItem = data[i];
            tableTagSet.push(dataItem.name);
        }
        //let tagSet = Tags.CreateTagSet(tableTagSet);
        console.log(tableTagSet);
        for (var i in data) {
            var dataItem = data[i];
            var type = dataItem.name.slice(2, 3);
            var value = void 0;
            value = (type == "_") ? dataItem.value.toString() : Number(dataItem.value);
            console.log(value);
            //tagSet(dataItem.name).Value = value;
        }
        //tagSet.Write();
    };
    return WebCCSimulator;
}());
export { WebCCSimulator };
