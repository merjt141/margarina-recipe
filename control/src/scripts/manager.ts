import { CWCAbrir } from './model/abrir/cwcAbrir';
import { CWCEscoger } from './model/escoger/cwcEscoger';
import { CWCIngredientes } from './model/ingredientes/cwcIngredientes';
import { PIDManager } from './modules/pidManager';
import { FDS } from './modules/FDS';
import { createFloatingPopup } from './modules/utilities';

/**
 * Clase general para la administración de todos los formularios
 * de la aplicación
 */
export class App {
    public pidManager: PIDManager;                  // Administra las comunicaciones SQL y Tags con TIA Portal
    public FDS: FDS;                                // Administra listado de tags del SCADA TIA Portal
    public formEscoger?: CWCEscoger;                // Formulario Escoger
    public formAbrir?: CWCAbrir;                    // Formularo Abrir
    public formIngredientes?: CWCIngredientes;      // Formulario Ingredientes
    
    constructor() {
        this.pidManager = new PIDManager();         // Inicializa administrador de comunicaciones con TIA Porta
        this.FDS = new FDS();                       // Inicializa administrador de tags
    }

    /**
     * Función parfa cargar el formulario en la pantalla por el operador
     * @param html Formulario requerido
     */
    public loadContent(html: string): void {
        switch(html) {
            case('formAbrir'):
                this.load('./public/views/abrir.html').then(() => {
                    this.formAbrir = new CWCAbrir(this);
                });
                break;
            case('formEscoger'):
                this.load('./public/views/escoger.html').then(() => {
                    this.formEscoger = new CWCEscoger(this);
                });
                break;
            case('formIngredientes'):
                this.load('./public/views/ingredientes.html').then(() => {
                    this.formIngredientes = new CWCIngredientes(this);
                });
                break;
        }
    }

    /**
     * Función para cerrar el formulario abierto
     */
    public async unload(): Promise<void> {
        (document.getElementById('main-content') as HTMLElement).innerHTML = '';
    }

    /**
     * Cargar formulario en página principal
     * @param page Ruta del formulario a cargar
     */
    private async load(page: string): Promise<void> {
        await fetch(page)
            .then(response => response.text())
            .then(html => {
                (document.getElementById('main-content') as HTMLElement).innerHTML = html;
            })
            .catch(error => console.error('Error loading the page:', error));
    }

    /**
     * Cargar formulario AcercaDe con información de desarrolladores
     */
    public async loadAcercaDe(): Promise<void> {
        // Extraer contenido de archivo acercade.html para popup
        let content: string = "";
        await fetch('./public/modules/acercade.html')
            .then(response => response.text())
            .then(html => {
                content = html;
            })
            .catch(error => console.error("Error cargando el popup"));

        // Creación de popup de saveas.html con contenido cargado
        let acercaDePopoup : HTMLDivElement = document.getElementById("save-as-popup") as HTMLDivElement;

        // Validar existencia única del modal
        if (!acercaDePopoup) {
            acercaDePopoup = createFloatingPopup({
                title: "Administración de Reportes Margarina",
                id: "acerca-de-popup",
                width: 470,
                height: 335,
                left: 300,
                top: 200,
                content: content,
                onClose: () => { console.log("Popup cerrado"); },
            });
        } else {
            console.log("Ya hay un popup abierto con ese ID.");
        }

        // Agregar evento de cierre de popup a boton aceptar
        (document.getElementById("acerca-de-cerrar") as HTMLButtonElement).addEventListener("click", () => {
            acercaDePopoup.remove();
        });
    }
}