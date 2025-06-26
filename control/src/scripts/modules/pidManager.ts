import { WebCCSimulator } from "../model/simulation/simulation";

export class PIDManager {
    public instances: any[][];
    public webCCSimulator: WebCCSimulator;
    private actionList: string[];

    constructor() {
        this.instances = [];
        this.webCCSimulator = new WebCCSimulator(this);
        this.actionList = [
            "selectCombo",      //0
            "selectTable",      //1
            "updateTable",      //2
            "duplicadoPeek",    //3
            "selectComboPeek",  //4
            "insertReceta",     //5
            "insertDetalle",    //6
            "deleteRecipe",     //7
            "selectIngr",       //8
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
            "",
            "writePLCTags",      //21
        ];

        this.initialize();
    }

    private initialize(): void {
        for (let i = 1; i < 100; i++) {
            this.instances.push([false, ""]);
        }
    }

    public async execute(execute: string, actionID: number): Promise<string> {
        return this.sqlQueryExecutionHandler(execute, actionID);
    }

    public response(response: string): void {
        this.sqlQueryResponseHandler(response);
    }


    private async sqlQueryExecutionHandler(execute: string, actionID: number): Promise<string> {
        let action = this.actionList[actionID];
        let packet = {
            "action": action,
            "data": execute,
        };

        console.log(actionID);
        console.log(packet);
        try {
            if (actionID <= 20) {
                WebCC.Events.fire('executeQuery', JSON.stringify(packet), action);
            }
            else {
                WebCC.Events.fire('writePLC', JSON.stringify(packet), action);
            }
        } catch (error) {
            console.log("Not access to WebCC API: Go Simulation");
            if (actionID <= 20) {
                this.webCCSimulator.executeQuery(execute, action);
            }
            else {
                this.webCCSimulator.writePLC(JSON.stringify(packet), action);
            }
        }

        await new Promise<void> ((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.instances[actionID][0]) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });

        console.log(this.instances[actionID][1]);

        this.instances[actionID][0] = false;
        let response = this.instances[actionID][1];
        this.instances[actionID][1] = "";

        return response;
    }

    private sqlQueryResponseHandler(response: string): void {
        let packet = JSON.parse(response);
        this.actionList.forEach((item: string, index: number) => {
            if (item == packet.action) {
                this.instances[index][1] = packet.data;
                this.instances[index][0] = true;
            }
        });
    }

}