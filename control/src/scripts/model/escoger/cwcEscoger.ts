import * as Library from '../../modules/utilities';
import { App } from '../../modules/manager';

export class CWCEscoger {

    ingredientJsonData: Library.IngredientList[];   // Raw table of ingredients from SQL Server
    ingredientExistIndex: string = "";
    ingredientSelectIndex: string = "";

    app: App;
    
    copsa: boolean;                                 // Area of production

    pid: any[][];                                   // Attribute to handle async functions


    constructor(app: App) {
        this.ingredientJsonData = [];

        this.app = app;

        this.copsa = false;

        this.pid = [[false, ""]];

        this.initialize();
    }

    async initialize(): Promise<void> {
        (document.getElementById("esc-title") as HTMLLabelElement).textContent = `Total ingredientes de ${this.copsa ? "COPSA" : "IPSA"}`

        let queryString: string = `Use ENV_MARG; select c_ingred, x_ingred from INGREDIENTES where left(c_ingred,1)=${this.copsa ? "C" : "P"} order by c_ingred;`;
        
        let response: string = await this.app.pidManager.execute(queryString, 8);
        this.ingredientJsonData = JSON.parse(response);

        const list: HTMLUListElement = document.getElementById("ingr-exist") as HTMLUListElement;
        list.innerHTML = '';
        this.ingredientJsonData.forEach((item: Library.IngredientList, index: number) => {
            const newItem = document.createElement('li');
            newItem.id = item.c_ingred;
            newItem.textContent = item.x_ingred;
            list.appendChild(newItem);
        });

        document.getElementById('ingr-exist')?.addEventListener('click', (event) => {
            const liItem = event.target as HTMLLIElement;
            if (liItem.tagName === 'LI') {
                document.querySelectorAll('#ingr-exist li').forEach(item => {
                    item.classList.remove('li-selected');
                });
                liItem.classList.add('li-selected');
                this.ingredientExistIndex = liItem.id;
                (document.getElementById('cmdPut') as HTMLButtonElement).disabled = false;
            }
        });

        document.getElementById('ingr-select')?.addEventListener('click', (event) => {
            const liItem = event.target as HTMLLIElement;
            if (liItem.tagName === 'LI') {
                document.querySelectorAll('#ingr-select li').forEach(item => {
                    item.classList.remove('li-selected');
                });
                liItem.classList.add('li-selected');
                this.ingredientSelectIndex = liItem.id;
                (document.getElementById('cmdGet') as HTMLButtonElement).disabled = false;
            }
        });
    }

    sqlQueryResponseHandler(response: string):void {
        let packet = JSON.parse(response);
        switch(packet.action) {
            case "selectIngr":
                this.pid[0][1] = packet.data;
                this.pid[0][0] = true;
                break;
            case "duplicadoPeekEscoger":
                this.pid[0][1] = packet.data;
                this.pid[0][0] = true;
                break;
        }
    }

    cmdPutClick(): void {
        const selected = document.getElementById(this.ingredientExistIndex) as HTMLLIElement;
        selected.classList.remove('li-selected');
        document.getElementById('ingr-exist')?.removeChild(selected);
        document.getElementById('ingr-select')?.appendChild(selected);
        (document.getElementById('cmdPut') as HTMLButtonElement).disabled = true;
        this.ingredientExistIndex = "";
    }
    
    cmdGetClick(): void {
        const selected = document.getElementById(this.ingredientSelectIndex) as HTMLLIElement;
        selected.classList.remove('li-selected');
        document.getElementById('ingr-select')?.removeChild(selected);
        document.getElementById('ingr-exist')?.appendChild(selected);
        selected.classList.remove('li-selected');
        (document.getElementById('cmdGet') as HTMLButtonElement).disabled = true;
        this.ingredientSelectIndex = "";
    }

    async cmdAceptarClick(): Promise<void> {
        const recipeName = document.getElementById('nombreNuevaReceta') as HTMLInputElement;
        recipeName.value = recipeName.value.trim();
        if (recipeName.value == '') {
            alert("Ingrese el nombre de la nueva receta");
            return;
        }
        // await Library.nombreDuplicado(this.copsa, recipeName.value, this, this.pid[1]);
    }
}