import { WebCCSimulator } from "../model/simulation/simulation";

/**
 * Clase para la administración de comunicaciones con SQL Server
 * y TAGS del PLC mediante WinCC, implementa métodos de espera
 * para confirmaciones de ejecución del lado WinCC
 */
export class PIDManager {
    public instances: [boolean, string][];      // Listado de [status, response] de todos los procesos permitidos (actualmente 100 procesos)
    public webCCSimulator: WebCCSimulator;      // Instancia de SIMULACIÓN, eliminar en producción
    private actionList: string[];               // Listado de todos los nombres de procesos

    constructor() {
        this.instances = [];                                // Limpia las instancias
        this.webCCSimulator = new WebCCSimulator(this);     // Inyecta el objeto de simulación
        this.actionList = [                                 // Listado de los procesos declarados o en uso en
            "selectCombo",      //0                         // el programa
            "selectTable",      //1
            "updateTable",      //2
            "duplicadoPeek",    //3
            "selectComboPeek",  //4
            "insertReceta",     //5
            "insertDetalle",    //6
            "deleteRecipe",     //7
            "selectIngr",       //8
            "ingrList",         //9
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "writePLCTags",      //21
        ];

        // Inicializa las instancias de los procesos
        this.initialize();
    }

    /**
     * Inicializa las 100 instancias de los procesos
     */
    private initialize(): void {
        for (let i = 1; i < 100; i++) {
            this.instances.push([false, ""]);
        }
    }

    /**
     * Función pública para ejecutar comando en WinCC y esperar respuesta
     * @param execute String a ejecutar del lado de WinCC
     * @param actionID Número de ID del proceso
     * @returns 
     */
    public async execute(execute: string, actionID: number): Promise<string> {
        return this.sqlQueryExecutionHandler(execute, actionID);
    }

    /**
     * Función pública para gestionar la respuesta de WinCC
     * @param response Respuesta de WinCC
     */
    public async response(response: string): Promise<void> {
        await this.sqlQueryResponseHandler(response);
    }

    /**
     * Ejecuta la acción en WinCC solicitada por la aplicación y espera la respuesta
     * para continuar la ejecución
     * @param execute String a ejecutar del lado de WinCC
     * @param actionID Número de ID del proceso
     * @returns Respuesta de WinCC al proceso que lo llamó
     */
    private async sqlQueryExecutionHandler(execute: string, actionID: number): Promise<string> {
        // Guarda el código del proceso en memoria
        let action = this.actionList[actionID];

        // Empaquetado del pedido para WinCC
        let packet = {
            "action": action,
            "data": execute,
        };

        // Para debug
        console.log(actionID);
        console.log(packet);

        // Intenta comunicarse con WinCC, si falla ejecuta simulación
        try {
            // IDs de procesos con base de datos
            if (actionID <= 20) {
                WebCC.Events.fire('executeQuery', JSON.stringify(packet), action);
            }

            // IDs de procesos con TAGS (Se puede mejorar --Juan)
            else {
                WebCC.Events.fire('writePLC', JSON.stringify(packet), action);
            }
        } catch (error) {
            // Error de conexión
            console.log("Not access to WebCC API: Go Simulation");
            
            // Ejecución de simulación
            if (actionID <= 20) {
                this.webCCSimulator.executeQuery(execute, action);
            }
            else {
                this.webCCSimulator.writePLC(JSON.stringify(packet), action);
            }
        }

        // Espera cíclica de respuesta de WinCC (100 ms)
        await new Promise<void> ((resolve) => {
            const checkInterval = setInterval(() => {
                // Si hubi respuesta de WinCC en el proceso actionID, salir y continuar ejecución
                if (this.instances[actionID][0]) {
                    clearInterval(checkInterval);   // Elimina setInterval
                    resolve();                      // Resuelve el Promise
                }
            }, 100);
        });

        // Para debug
        console.log(this.instances[actionID][1]);

        // Reinicializa el estatus de ID
        this.instances[actionID][0] = false;

        // Almacena en memoria la respuesta de WinCC
        let response = this.instances[actionID][1];

        // Borra la rtespuesat del proceso (reinicializa)
        this.instances[actionID][1] = "";

        // Devuelve la respuesta de WinCC al punto de invocación
        return response;
    }

    /**
     * Maneja las respuesta y las asigna al proceso respectivo
     * @param response Respuesta de WinCC
     */
    private async sqlQueryResponseHandler(response: string): Promise<void> {
        // Reestructura la respuesta de WinCC
        let packet = JSON.parse(response) as {action: string, data: string};

        // Revisa entre todo el listado de procesos al que le corresponde la acción
        this.actionList.forEach((item: string, index: number) => {
            // Al proceso con el mismo nombre le entrga la respuesta y activa el bit de status
            if (item == packet.action) {
                this.instances[index][1] = packet.data;     // Respuesta de WinCC
                this.instances[index][0] = true;            // Estatus de respuesta de WinCC
            }
        });
    }
}