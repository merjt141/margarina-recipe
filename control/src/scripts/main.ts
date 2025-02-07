import { App } from './modules/manager';

let app: App;

/**
 * Initialize web application
 */
function initializeWebApp() {
    app = new App();
    window.app = app;

    app.loadContent('./public/views/escoger.html');

}

// WebCC of Custom Web Control declaration for WinCC Unified
WebCC.start(function(result: any){
    if(result){
        console.log('connected successfully');
    } else {
        console.log('connection failed');
    }
    initializeWebApp();
},
{
    methods: {
        PopulateRecipes: function(jsonString: string) {
            //cwcAbrir?.recipeComboBox.update(jsonString);
        },
        QueryResponse: function(jsonString: string) {
            app.pidManager.response(jsonString);
        },
        PLCResponse: function(jsonString: string) {
            app.formAbrir?.plcAgent.response(app.formAbrir, jsonString);
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

/**
 * Call initializeWebApp to run the project
 */
$(document).ready(function() {
    // initializeWebApp();
});