import { CWCAbrir } from '../model/abrir/cwcAbrir';
import { CWCEscoger } from '../model/escoger/cwcEscoger';
import { PIDManager } from '../modules/pidManager';

export class App {
    public pidManager: PIDManager;
    public formAbrir?: CWCAbrir;
    public formEscoger?: CWCEscoger;
    
    constructor() {
        this.pidManager = new PIDManager();
    }

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
        }
    }

    private async load(page: string): Promise<void> {
        await fetch(page)
            .then(response => response.text())
            .then(html => {
                (document.getElementById('main-content') as HTMLElement).innerHTML = html;
            })
            .catch(error => console.error('Error loading the page:', error));
    }
}