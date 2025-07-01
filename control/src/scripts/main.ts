// Importar librerías centrales
import { App } from './manager';

// importar estilos css
import '../styles/main.css';
import '../styles/views/abrir.css';
import '../styles/views/escoger.css';
import '../styles/views/ingredientes.css';
import '../styles/popup/popup.css';
import '../styles/transfer/transfer.css';
import '../styles/transfer/version.css';

// Aplicación web
let app: App;

/**
 * Inicializa la aplicación web
 */
function initializeWebApp() {
    app = new App();
    window.app = app;
}

// Inicializa el control web - Librería de Siemens
WebCC.start(function(result: any){
    // Revisa estatus de conexión con WinCC
    if(result){
        console.log('connected successfully');
    } else {
        console.log('connection failed');
    }

    // Inicializa aplicación
    initializeWebApp();
},
{
    methods: {
        QueryResponse: function(response: string) {
            // Invoca al PIDManager para confirmar respuesta de WinCC
            app.pidManager.response(response);
        },
    },
    events: ['executeQuery', 'writePLC'],
    properties: {}
},
[],
10000);