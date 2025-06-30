import * as Library from '../../modules/utilities';
import { App } from '../../manager';

/**
 * Clase para el control del formulario de creación de nuevas recetas
 */
export class CWCEscoger {

    ingredientJsonData: Library.IngredientList[];   // Tabla de ingredientes de SQL
    ingredientExistIndex: string = "";              // Índice de ingrediente en existente
    ingredientSelectIndex: string = "";             // índice de ingrediente en seleccionado

    app: App;
    
    copsa: boolean;                                 // Area of production

    constructor(app: App) {
        this.ingredientJsonData = [];               // Inicializar tabla de ingredientes
        this.app = app;                             // Aplicación general
        this.copsa = false;                         // Tipo de planta

        // Inicializar formulario
        this.initialize();
    }

    /**
     * Inicializa valores del formulario
     */
    private async initialize(): Promise<void> {
        // Escribe el título de la planta
        (document.getElementById("esc-title") as HTMLLabelElement).textContent = `Total ingredientes de ${this.copsa ? "COPSA" : "IPSA"}`

        // Consulta para extraer listado de ingredientes
        let queryString: string = `Use ENV_MARG; select c_ingred, x_ingred from INGREDIENTES where left(c_ingred,1)='${this.copsa ? "C" : "P"}' order by c_ingred;`;
        
        // Espera respuesta de WinCC/SQL
        let response: string = await this.app.pidManager.execute(queryString, 8);
        
        // Ordena la respuesta en objeto JSON
        this.ingredientJsonData = JSON.parse(response) as Library.IngredientList[];

        // Inicializar lista de ingredientes en formulario
        const list: HTMLUListElement = document.getElementById("ingr-exist") as HTMLUListElement;
        list.innerHTML = '';

        // Ingresar los ingredientes las filas del formulario
        this.ingredientJsonData.forEach((item: Library.IngredientList, index: number) => {
            // Nuevo elemento para el ingrediente
            const newItem = document.createElement('li');
            newItem.id = item.c_ingred;                     // Código de ingrediente
            newItem.textContent = item.x_ingred;            // Nombre de ingrediente

            // Añadir a lisa de ingredientes
            list.appendChild(newItem);
        });

        // Agregar evento de click a la lista de ingredientes
        // para capturar el ingrediente seleccionado
        document.getElementById('ingr-exist')?.addEventListener('click', (event) => {
            // Elemento seleccionado
            const liItem = event.target as HTMLLIElement;

            // Verificar si el elemento es LI (list item)
            if (liItem.tagName === 'LI') {
                // Limpiar selección de los demás elementos
                document.querySelectorAll('#ingr-exist li').forEach(item => {
                    item.classList.remove('li-selected');
                });

                // Seleccionar elemento que se hizo click
                liItem.classList.add('li-selected');

                // Guardar en memoria el id del ingrediente seleccionado
                this.ingredientExistIndex = liItem.id;

                // Habilitar el botón para mover el ingrediente
                (document.getElementById('cmdPut') as HTMLButtonElement).disabled = false;
            }
        });

        // Agregar evento de click a la lista de seleccionados
        // para capturar el ingrdiente elegido
        document.getElementById('ingr-select')?.addEventListener('click', (event) => {
            // Elemento seleccionado
            const liItem = event.target as HTMLLIElement;
            
            // Verificar si el elemento es LI (list item)
            if (liItem.tagName === 'LI') {
                // Limpiar selección de los demás elementos
                document.querySelectorAll('#ingr-select li').forEach(item => {
                    item.classList.remove('li-selected');
                });

                // Seleccionar elemento que se hizo click
                liItem.classList.add('li-selected');

                // Guardar en memoria el id del ingrediente seleccionado
                this.ingredientSelectIndex = liItem.id;

                // Habilitar el botón para regresar el ingrediente
                (document.getElementById('cmdGet') as HTMLButtonElement).disabled = false;
            }
        });
    }

    public cmdPutClick(): void {
        // Validación de selección
        if (this.ingredientExistIndex == "") return;

        // Obtener elemento seleccionado
        const selected = document.getElementById(this.ingredientExistIndex) as HTMLLIElement;

        // Quitar selección
        selected.classList.remove('li-selected');

        // Remover del listado INGREDIENTES EXISTENTES
        document.getElementById('ingr-exist')?.removeChild(selected);
        
        // Agregar al listado INGREDIENTES SELECCIONADOS
        document.getElementById('ingr-select')?.appendChild(selected);
        
        // Deshabilitar botón luego de mover
        (document.getElementById('cmdPut') as HTMLButtonElement).disabled = true;
        
        // Limpiar la memoria del índice
        this.ingredientExistIndex = "";
    }
    
    public cmdGetClick(): void {
        // Validación de selección
        if (this.ingredientSelectIndex == "") return;

        // Obtener elemento seleccionado
        const selected = document.getElementById(this.ingredientSelectIndex) as HTMLLIElement;
        
        // Quitar selección
        selected.classList.remove('li-selected');

        // Remover del listado INGREDIENTES SELECCIONADOS
        document.getElementById('ingr-select')?.removeChild(selected);
        
        // Agregar al listado INGREDIENTES EXISTENTES
        document.getElementById('ingr-exist')?.appendChild(selected);

        // Deshabilitar botón luego de mover
        (document.getElementById('cmdGet') as HTMLButtonElement).disabled = true;
        
        // Limpiar la memoria del índice
        this.ingredientSelectIndex = "";
    }

    /**
     * Creación de nueva receta con los ingrdientes seleccionados
     * @returns Salida de función
     */
    public async cmdAceptarClick(): Promise<void> {
        // Objeto de nombre de nueva receta
        const recipeName = document.getElementById('nombre-nueva-receta') as HTMLInputElement;
        
        // Borrar los espacios al inicio y fin de nombre
        recipeName.value = recipeName.value.trim();

        //  Valida que se haya ingresado el nombre de receta
        if (recipeName.value == '') {
            alert("Confirmación:\n\nIngrese el nombre de la nueva receta");
            recipeName.focus();
            return;
        }

        // Validar que el nombre no sea repetido en la base de datos
        let isRepeated = await Library.nombreDuplicado(this.copsa, recipeName.value, this.app);
        if (isRepeated) {
            alert("Nombre Repetido:\n\nEl nombre ingresado ya existe. Ingrese un nuevo nombre para la receta");
            recipeName.focus();
            return;
        }

        // Lista de ingredientes
        const ingredientesSeleccionados = document.getElementById('ingr-select') as HTMLUListElement;

        // Validar que la lista de ingredientes no esté vacía
        console.log(ingredientesSeleccionados.childElementCount);
        if (ingredientesSeleccionados.childElementCount == 0) {
            alert("Lista de Ingredientes Vacía:\n\nIngrese los Ingredientes de la Receta");
            return;
        }

        // Confirmación del operador
        let userConfirmation = confirm(`Confirmación:\n\n¿Desea grabar la Receta?`);
        if (!userConfirmation) return;

        // Identificar si la planta es IPSA o COPSA
        let field = this.copsa ? "C" : "P";

        // Buscar un código disponible y secuencial en la base de datos
        let value = await Library.buscaNuevoCodigo(this.copsa, this.app);

        // Dar formato de string
        if (value < 10) field += "0";

        // Crea código de receta
        let c_receta: string = field + value.toString();

        // Consulta para guardar nueva receta
        let queryString = `Use ENV_MARG; insert into RECETA(c_receta, x_receta) values('${c_receta}', '${recipeName.value}');`;
        
        // Espera respuesta de WinCC/SQL
        await this.app.pidManager.execute(queryString, 5);

        // Consulta para guardar ingredientes y preparación de nueva receta
        let insertString = `Use ENV_MARG; insert into DETALLE_RECETA(c_receta, c_ingred, n_valor, x_comen1, x_comen2) values `;

        // Ingresa todos los ingredientes seleccionados en la consulta
        for (let child = 0; child < ingredientesSeleccionados.childElementCount; child++) {
            let ingrediente = ingredientesSeleccionados.children[child] as HTMLLIElement;
            insertString += `('${c_receta}', '${ingrediente.id}', 0, '', ''), `;
        }

        // Si la planta es IPSA ingresar también los parámetros
        if (!this.copsa) {
            // Ingresar parámetros oblitaorios
            for (let i = 1; i <= 8; i++) {
                let c_ingred = `R0${i}`;
                insertString += `('${c_receta}', '${c_ingred}', 0, '', ''), `;
            }

            // Ingresar parámetros opcionales
            for (let i = 9; i <= 30; i++) {
                let c_ingred =  i < 10 ? `R0${i}` : `R${i}`;
                insertString += `('${c_receta}', '${c_ingred}', null, '', ''), `;
            }
        }

        // Borrar la coma, espacio del final y cerrar punto y coma
        insertString = insertString.slice(0, -2) + ";";

        // ESperar respuesta de WinCC/SQL
        await this.app.pidManager.execute(insertString, 6);

        // Informar al operador del guardado exitoso
        alert(`Confirmación:\n\nLa receta "${recipeName.value}" se guardó satisfactoriamente`);

        // Limpiar nombre de receta de formulario
        recipeName.value = '';
        ingredientesSeleccionados.innerHTML = '';

        // Volver a cargar formulario
        this.initialize();

        // Hace focus en el campo de nombre de receta
        recipeName.focus();
    }
}