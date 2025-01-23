import { SQLAgent, SQLObject } from "./utilities";
import { WebCCSimulator } from "../model/simulation/simulation";

export class PIDManager implements SQLObject {
    public instances: any[][];
    public sqlAgent: SQLAgent;
    public webCCSimulator: WebCCSimulator;
    private actionList: string[];

    constructor() {
        this.instances = [];
        this.sqlAgent = new SQLAgent();
        this.webCCSimulator = new WebCCSimulator(this);
        this.actionList = [
            "selectCombo",
            "selectTable",
            "updateTable",
            "duplicadoPeek"
        ];

        this.initialize();
    }

    private initialize() {
        for (let i = 1; i < 100; i++) {
            this.instances.push([false, ""]);
        }
    }

    sqlQueryResponseHandler(response: string): void {

    }

}