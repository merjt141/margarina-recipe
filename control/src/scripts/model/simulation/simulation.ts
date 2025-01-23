import { SQLObject } from '../../modules/utilities.js';
import { CWCAbrir } from '../abrir/cwcAbrir.js';

export class WebCCSimulator {

    object: SQLObject;

    jsonString1 = JSON.stringify({
        action: "selectTable",
        data: JSON.stringify(
        [
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"GRINDSTED PS 404","x_comen2":"","c_ingred":"P02","x_ingred":"Emulsif. Caliente1 TMG","x_unidad":"%","t_ingred":"1"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.8","x_comen1":"LECITINA DE SOYA","x_comen2":"","c_ingred":"P23","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"80","x_comen1":"HDHOJAL","x_comen2":"01-07-16.","c_ingred":"P01","x_ingred":"Grasa","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"13.94","x_comen1":"MICROFILTRADA","x_comen2":"","c_ingred":"P05","x_ingred":"Agua","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"3.99","x_comen1":"SOLUCION DE SAL AL 25%","x_comen2":"","c_ingred":"P06","x_ingred":"Salmuera","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.27","x_comen1":"AROMAS COLORANTES","x_comen2":"","c_ingred":"P08","x_ingred":"Ingrediente1 TPB","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"72","x_comen1":"","":"","c_ingred":"R01","x_ingred":"TMG_SP_TempNivelMedio","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"68","x_comen1":"","":"","c_ingred":"R02","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R03","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R04","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R05","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R06","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R07","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R08","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R09","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R10","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R11","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"100","x_comen1":"","":"","c_ingred":"R12","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R13","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R14","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R15","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"","":"","c_ingred":"R16","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.3","x_comen1":"","":"","c_ingred":"R17","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.6","x_comen1":"","":"","c_ingred":"R18","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R19","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R20","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R21","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R22","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R23","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R24","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R25","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R26","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"500","x_comen1":"","":"","c_ingred":"R27","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.01","x_comen1":"","":"","c_ingred":"R28","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.2","x_comen1":"","":"","c_ingred":"R29","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R30","x_ingred":"","x_unidad":"%","t_ingred":"4"},
        ])
    });

    jsonString2 = JSON.stringify({
        action: "selectTable",
        data: JSON.stringify(
        [
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.1","x_comen1":"GRINDSTED PS 404","x_comen2":"","c_ingred":"P02","x_ingred":"Emulsif. Caliente1 TMG","x_unidad":"%","t_ingred":"1"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.8","x_comen1":"LECITINA DE SOYA","x_comen2":"","c_ingred":"P23","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"80","x_comen1":"HDHOJAL","x_comen2":"01-07-16.","c_ingred":"P01","x_ingred":"Grasa","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"13.94","x_comen1":"MICROFILTRADA","x_comen2":"","c_ingred":"P05","x_ingred":"Agua","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"3.99","x_comen1":"SOLUCION DE SAL AL 25%","x_comen2":"","c_ingred":"P06","x_ingred":"Salmuera","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.27","x_comen1":"AROMAS COLORANTES","x_comen2":"","c_ingred":"P08","x_ingred":"Ingrediente1 TPB","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"72","x_comen1":"","":"","c_ingred":"R01","x_ingred":"TMG_SP_TempNivelMedio","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"68","x_comen1":"","":"","c_ingred":"R02","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R03","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R04","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R05","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R06","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R07","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R08","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R09","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R10","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R11","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"100","x_comen1":"","":"","c_ingred":"R12","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R13","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R14","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R15","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"","":"","c_ingred":"R16","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.3","x_comen1":"","":"","c_ingred":"R17","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.6","x_comen1":"","":"","c_ingred":"R18","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R19","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R20","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R21","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R22","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R23","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R24","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R25","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R26","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"500","x_comen1":"","":"","c_ingred":"R27","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.01","x_comen1":"","":"","c_ingred":"R28","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.2","x_comen1":"","":"","c_ingred":"R29","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R30","x_ingred":"","x_unidad":"%","t_ingred":"4"},
        ])
    });

    jsonString3 = JSON.stringify({
        action: "selectTable",
        data: JSON.stringify(
        [
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.1","x_comen1":"GRINDSTED PS 404","x_comen2":"","c_ingred":"P02","x_ingred":"Emulsif. Caliente1 TMG","x_unidad":"%","t_ingred":"1"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"LECITINA DE SOYA","x_comen2":"","c_ingred":"P23","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.4","x_comen1":"LECITINA","x_comen2":"","c_ingred":"P24","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"80","x_comen1":"HDHOJAL","x_comen2":"01-07-16.","c_ingred":"P01","x_ingred":"Grasa","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"13.94","x_comen1":"MICROFILTRADA","x_comen2":"","c_ingred":"P05","x_ingred":"Agua","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"3.99","x_comen1":"SOLUCION DE SAL AL 25%","x_comen2":"","c_ingred":"P06","x_ingred":"Salmuera","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.27","x_comen1":"AROMAS COLORANTES","x_comen2":"","c_ingred":"P08","x_ingred":"Ingrediente1 TPB","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"72","x_comen1":"","":"","c_ingred":"R01","x_ingred":"TMG_SP_TempNivelMedio","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"68","x_comen1":"","":"","c_ingred":"R02","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R03","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R04","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R05","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R06","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R07","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R08","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R09","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R10","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R11","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"100","x_comen1":"","":"","c_ingred":"R12","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R13","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R14","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R15","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"","":"","c_ingred":"R16","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.3","x_comen1":"","":"","c_ingred":"R17","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.6","x_comen1":"","":"","c_ingred":"R18","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R19","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R20","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R21","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R22","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R23","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R24","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R25","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R26","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"500","x_comen1":"","":"","c_ingred":"R27","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.01","x_comen1":"","":"","c_ingred":"R28","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.2","x_comen1":"","":"","c_ingred":"R29","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R30","x_ingred":"","x_unidad":"%","t_ingred":"4"},
        ])
    });

    jsonString4 = JSON.stringify({
        action: "selectTable",
        data: JSON.stringify(
        [
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.1","x_comen1":"GRINDSTED PS 404","x_comen2":"","c_ingred":"P02","x_ingred":"Emulsif. Caliente1 TMG","x_unidad":"%","t_ingred":"1"},
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"3.1","x_comen1":"GRINDSTED PS 504","x_comen2":"","c_ingred":"P02","x_ingred":"Emulsif. Caliente1 TMG","x_unidad":"%","t_ingred":"1"},
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"LECITINA DE SOYA","x_comen2":"","c_ingred":"P23","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.4","x_comen1":"LECITINA","x_comen2":"","c_ingred":"P24","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.1","x_comen1":"LECITINA","x_comen2":"","c_ingred":"P24","x_ingred":"Emulsif. Frío1 TMG","x_unidad":"%","t_ingred":"2"},
            {"c_receta":"P16","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"80","x_comen1":"HDHOJAL","x_comen2":"01-07-16.","c_ingred":"P01","x_ingred":"Grasa","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"13.94","x_comen1":"MICROFILTRADA","x_comen2":"","c_ingred":"P05","x_ingred":"Agua","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"3.99","x_comen1":"SOLUCION DE SAL AL 25%","x_comen2":"","c_ingred":"P06","x_ingred":"Salmuera","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.27","x_comen1":"AROMAS COLORANTES","x_comen2":"","c_ingred":"P08","x_ingred":"Ingrediente1 TPB","x_unidad":"%","t_ingred":"3"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"72","x_comen1":"","":"","c_ingred":"R01","x_ingred":"TMG_SP_TempNivelMedio","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"68","x_comen1":"","":"","c_ingred":"R02","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R03","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"5","x_comen1":"","":"","c_ingred":"R04","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R05","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R06","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R07","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1","x_comen1":"","":"","c_ingred":"R08","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R09","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R10","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R11","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"100","x_comen1":"","":"","c_ingred":"R12","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R13","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R14","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R15","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"1.8","x_comen1":"","":"","c_ingred":"R16","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.3","x_comen1":"","":"","c_ingred":"R17","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.6","x_comen1":"","":"","c_ingred":"R18","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R19","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"58","x_comen1":"","":"","c_ingred":"R20","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R21","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R22","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"","x_comen1":"","":"","c_ingred":"R23","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R24","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R25","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.5","x_comen1":"","":"","c_ingred":"R26","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"500","x_comen1":"","":"","c_ingred":"R27","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.01","x_comen1":"","":"","c_ingred":"R28","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.2","x_comen1":"","":"","c_ingred":"R29","x_ingred":"","x_unidad":"%","t_ingred":"4"},
            {"c_receta":"P01","x_receta":"P. HOJALDRE 2 Kg.","n_valor":"0.05","x_comen1":"","":"","c_ingred":"R30","x_ingred":"","x_unidad":"%","t_ingred":"4"},
        ])
    });

    comboList = JSON.stringify({
        action: "selectCombo",
        data: JSON.stringify(
        [
            {"c_receta":"P01", "x_receta":"P. HOJALDRE 2 Kg."},
            {"c_receta":"P02", "x_receta":"M. PRIMOR"},
            {"c_receta":"P03", "x_receta":"MARGARINA DEL."},
            {"c_receta":"P04", "x_receta":"1/2 MANT. ORGANICA"},
            {"c_receta":"P16", "x_receta":"1/2 MANT. ORGANICA NUEVO"},
        ])
    });

    constructor(object: SQLObject) {
        this.object = object;
    }

    executeQuery(jsonString: string, action: string) {
        switch(action) {
            case "selectTable":
                let a = jsonString.slice(269,272);
                let sendString: string = "";
                switch(a) {
                    case "P01":
                        sendString = this.jsonString1;
                        break;
                    case "P02":
                        sendString = this.jsonString2;
                        break
                    case "P03":
                        sendString = this.jsonString3;
                        break
                    case "P16":
                        sendString = this.jsonString4;
                        break
                }
                this.object.sqlAgent.response(this.object, sendString);
                break;
            case "selectCombo":
                this.object.sqlAgent.response(this.object, this.comboList);
                break;
            case "updateTable":
                break;
            case "duplicadoPeek":
                let responseDuplicadoPeek = JSON.stringify({
                    action: "duplicadoPeek",
                    data: JSON.stringify(
                        [/**
                            {
                            c_receta: "P01",
                            x_receta: "Nueva receta",
                            }*/
                        ])
                });
                this.object.sqlAgent.response(this.object, responseDuplicadoPeek);
                break;
            case "selectComboPeek":
                let responseComboPeek = JSON.stringify({
                    action: "selectComboPeek",
                    data: JSON.stringify(
                        [
                            {
                            c_receta: "P15",
                            x_receta: "Nueva Receta"
                            }
                        ]),
                    });
                this.object.sqlAgent.response(this.object, responseComboPeek);
                break;

            
            case "selectIngr":
                let response = JSON.stringify({
                    action: "selectIngr",
                    data: JSON.stringify([
                        {c_ingred:"C01",x_ingred:"Grasa"},
                        {c_ingred:"C02",x_ingred:"Agua"},
                        {c_ingred:"C03",x_ingred:"Salmuera"},
                        {c_ingred:"C04",x_ingred:"Leche"},
                        {c_ingred:"P01",x_ingred:"Grasa"},
                        {c_ingred:"P02",x_ingred:"Emulsif. Caliente1 TMG"},
                        {c_ingred:"P03",x_ingred:"Emulsif. Caliente2 TMG"},
                        {c_ingred:"P04",x_ingred:"Emulsif. Caliente3 TMG"},
                        {c_ingred:"P05",x_ingred:"Agua"},
                    ])
                });
                this.object.sqlAgent.response(this.object, response);
                break;
        }
    }

    writePLC(writeCommand: string) {
        console.log(writeCommand);

        let writeData = JSON.parse(writeCommand);
        let action = writeData.action;
        let data = writeData.data;

        let tableTagSet = [];
        for (let i in data) {
        let dataItem = data[i];
        tableTagSet.push(dataItem.name);
        }

        //let tagSet = Tags.CreateTagSet(tableTagSet);
        
        console.log(tableTagSet);
        
        for (let i in data) {
        let dataItem = data[i];
        let type = dataItem.name.slice(2,3);
        let value;
        value = (type == "_") ? dataItem.value.toString() : Number(dataItem.value);
        console.log(value);
        //tagSet(dataItem.name).Value = value;
        }

        //tagSet.Write();
    }

}