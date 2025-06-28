import { CWCAbrir } from '../model/abrir/cwcAbrir';
import { CWCEscoger } from '../model/escoger/cwcEscoger';
import { CWCIngredientes } from '../model/ingredientes/cwcIngredientes';
import { PIDManager } from '../modules/pidManager';
import { FDS } from './FDS';

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
}