import { CWCAbrir } from './model/abrir/cwcAbrir.js';
let cwcAbrir;
/**
 * Initialize web application
 */
function initializeWebApp() {
    // Initialize CWCAbrir application data
    cwcAbrir = new CWCAbrir();
    // Assing Abrir application to window
    window.cwcAbrir = cwcAbrir;
}
// WebCC of Custom Web Control declaration for WinCC Unified
WebCC.start(function (result) {
    if (result) {
        console.log('connected successfully');
    }
    else {
        console.log('connection failed');
    }
}, {
    methods: {
        PopulateRecipes: function (jsonString) {
            cwcAbrir.recipeComboBox.update(jsonString);
        },
        PopulateDetail: function (jsonString) {
            cwcAbrir.writeRecipeData(jsonString);
        },
        QueryResponse: function (jsonString) {
            cwcAbrir.sqlAgent.response(cwcAbrir, jsonString);
        },
        PLCResponse: function (jsonString) {
            cwcAbrir.plcAgent.response(cwcAbrir, jsonString);
        }
    },
    events: ['NewSelection', 'executeQuery', 'writePLC'],
    properties: {
        ComboDatos: " ",
        ComboIndex: " "
    }
}, [], 10000);
/**
 * Call initializeWebApp to run the project
 */
$(document).ready(function () {
    initializeWebApp();
});
