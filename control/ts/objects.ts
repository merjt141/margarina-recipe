import { CWCAbrir } from "./cwcAbrir";

export class ComboBoxRecipe {
    domObject: HTMLSelectElement;
    object: CWCAbrir;

    constructor(domId: string, object: CWCAbrir) {
        this.domObject = document.getElementById(domId) as HTMLSelectElement;
        this.object = object;

        this.domObject.addEventListener('change', () => {
            this.select();
        })
    }

    /**
     * Update combo box data
     * @param {string} data 
     */
    update(data: string) {
        const obj = JSON.parse(data);
        this.domObject.textContent = '';
        for (let i = 0; i < obj.length; i++){
            let option = document.createElement("option") as HTMLOptionElement;
            option.id = obj[i].id;
            option.innerHTML = obj[i].stateName;
            this.domObject.appendChild(option);
        }
    }

    /**
     * Select element from combo box
     */
    select() {
        let selectedBox = this.domObject.options[this.domObject.selectedIndex].id;

        let queryString = `Use ENV_MARG; select r.c_receta, r.x_receta, d.n_valor, d.x_comen1, d.x_comen2, i.c_ingred, i.x_ingred, i.x_unidad, i.t_ingred `;
        queryString += `from RECETA r inner join DETALLE_RECETA d on r.c_receta = d.c_receta inner join INGREDIENTES i on d.c_ingred = i.c_ingred `;
        queryString += `where r.c_receta = '${selectedBox}';`;

        this.object.sqlAgent.execute(this.object, queryString, "selectTable");
    }
}

export class SQLAgent {
    constructor() {

    }

    execute(object:CWCAbrir, queryString: string, action: string) {
        console.log(queryString);

        try {
            WebCC.Events.fire('executeQuery', queryString, action);
        } catch (error) {
            console.log("Not access to WebCC API: Go Simulation");
            object.webCCSimulator.executeQuery(queryString);
        }
    }

    response(object: CWCAbrir, response: string) {
        object.sqlQueryResponseHandler(response);
    }
}

export class PLCAgent {
    constructor() {

    }

    write(object:CWCAbrir, writeCommand: string, action: string) {
        console.log(writeCommand);

        try {
            WebCC.Events.fire('writePLC', writeCommand, action);
        } catch (error) {
            console.log("Not access to WebCC API");
            object.webCCSimulator.writePLC(writeCommand);
        }
    }

    response(object: CWCAbrir, response: string) {
        object.plcWriteResponseHandler(response);
    }
}