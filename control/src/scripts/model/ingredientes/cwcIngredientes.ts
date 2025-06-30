import * as Library from '../../modules/utilities';
import { App } from '../../manager';

/**
 * Clase para la visualización del listado de ingredientes
 */
export class CWCIngredientes {

    app: App

    constructor(manager: App) {
        this.app = manager;
    }

    /**
     * Evento click de cargar listado de ingredientes
     * @param event Evento de cambio en botones de opciones
     */
    public cmdLoadClick(event: Event): void {
        const selectedValue = (event.target as HTMLInputElement).value;
        this.cmdLoadAction(selectedValue);
    }

    /**
     * Cargar los valores de los ingrdientes po el tipo seleccionado
     * @param option Tipo selecionado
     */
    private async cmdLoadAction(option: string): Promise<void> {
        // Consulta para extracción de recetas
        let queryString = `Use ENV_MARG; select r.c_receta, r.x_receta, d.x_comen1, i.x_unidad 
        from RECETA r inner join DETALLE_RECETA d on r.c_receta = d.c_receta inner join INGREDIENTES i on d.c_ingred = i.c_ingred 
        where left(r.c_receta, 1) = '${option}' order by r.c_receta;`;

        // Esperar respuesta de WinCC/SQL
        let response = await this.app.pidManager.execute(queryString, 9);

        // Dar formato y tipado a la respuesta
        const ingrList = JSON.parse(response) as [{c_receta:string, x_receta:string, x_comen1:string, x_unidad:string}];

        // Objeto que contiene la lista de ingredientes
        const ingrObject = (document.getElementById("ingr-list") as HTMLUListElement);

        // Mostrar y dar titulo de cuadro
        ingrObject.style.display = 'block';
        ingrObject.innerHTML = `<li><div>Cod_Receta</div><div>Nombre_Receta</div><div>Ingrediente</div><div>Unidad</div></li>`;
        
        // Añadir elementos a la lista
        ingrList.forEach((ingredient: {c_receta:string, x_receta:string, x_comen1:string, x_unidad:string}) => {
            // Obviar vacios o nulos
            if (ingredient.x_comen1 == "") return;

            // Crear nuevo elemento para la fila
            const newItem = document.createElement('li');
            newItem.innerHTML = `<div>${ingredient.c_receta}</div><div>${ingredient.x_receta}</div>
            <div>${ingredient.x_comen1}</div><div>${ingredient.x_unidad}</div>`;
            
            // Añadir elemento a la lista
            ingrObject.appendChild(newItem);
        });
    }
}