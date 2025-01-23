import { CWCAbrir } from './model/abrir/cwcAbrir';
import { CWCEscoger } from './model/escoger/cwcEscoger';

class Manager {
    public formAbrir?: CWCAbrir;
    public formEscoger?: CWCEscoger;
    
    constructor() {
    }
    public loadContent(html: string): void {
        switch(html) {
            case('formAbrir'):
                loadContent('./public/views/abrir.html').then(() => {
                    cwcAbrir = new CWCAbrir();
                    window.cwcAbrir = cwcAbrir;
                });
                break;
            case('formEscoger'):
                loadContent('./public/views/escoger.html').then(() => {
                    this.formEscoger = new CWCEscoger();
                });
                break;
        }
    }
}


let cwcAbrir: CWCAbrir;
let cwcEscoger: CWCEscoger;
let manager: Manager;

/**
 * Initialize web application
 */
function initializeWebApp() {
    loadContent('./public/views/escoger.html').then(() => {
        manager = new Manager();
        manager.formEscoger = new CWCEscoger();
        window.manager = manager;
    })
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
            cwcAbrir?.recipeComboBox.update(jsonString);
        },
        QueryResponse: function(jsonString: string) {
            cwcAbrir?.sqlAgent.response(cwcAbrir, jsonString);
        },
        PLCResponse: function(jsonString: string) {
            cwcAbrir?.plcAgent.response(cwcAbrir, jsonString);
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
})

async function loadContent(page: string) {
    await fetch(page)
        .then(response => response.text())
        .then(html => {
            (document.getElementById('main-content') as HTMLElement).innerHTML = html;
        })
        .catch(error => console.error('Error loading the page:', error));
}