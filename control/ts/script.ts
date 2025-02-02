import { CWCAbrir } from './cwcAbrir.js';

let cwcAbrir: CWCAbrir;

$(document).ready(function() {
    initializeWebApp();
})

/**
 * Initialize web application
 */
function initializeWebApp() {
    // Initialize CWCAbrir application data
    cwcAbrir = new CWCAbrir();

    // Assing Abrir application to window
    window.cwcAbrir = cwcAbrir;
}

WebCC.start(function(result: any){
    if(result){
        console.log('connected successfully');
    } else {
        console.log('connection failed');
    }
},
{
    methods: {
        PopulateRecipes: function(jsonString: string) {
            cwcAbrir.recipeComboBox.update(jsonString);
        },
        PopulateDetail: function(jsonString: string) {
            cwcAbrir.writeRecipeData(jsonString);
        },
        QueryResponse: function(jsonString: string) {
            cwcAbrir.sqlAgent.response(cwcAbrir, jsonString);
        },
        PLCResponse: function(jsonString: string) {
            cwcAbrir.plcAgent.response(cwcAbrir, jsonString);
        }
    },
    events: ['NewSelection', 'executeQuery', 'writePLC'],
    properties: {
            ComboDatos: " ",
            ComboIndex: " "
        }
},
[],
10000);