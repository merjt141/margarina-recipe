export class FDS {
    
    public groups : any = {};

    constructor() {

        // Ingreso de nombres de TAGS COPSA
        for ( let line = 1; line <= 5; line++ ) {
            let indexNameTag : any = {};
            let indexValueTag :  any = {};

            for ( let index = 1; index <= 7; index++ ) {
                indexNameTag["L" + line.toString() + "_NOMBRE_C" + index.toString()] = "";
                indexValueTag["L" + line.toString() + "C" + index.toString()] = "0";
            }
            
            this.groups["TN_COPSA" + line.toString()] =  indexNameTag;
            this.groups["TV_COPSA" + line.toString()] = indexValueTag;
        }

        // Ingreso de nombres de TAGS IPSA
        for ( let line = 1; line <= 3; line++ ) {
            let indexNameTag : any = {};
            let indexValueTag :  any = {};

            for ( let index = 1; index <= 27; index++ ) {
                indexNameTag["L" + line.toString() + "_NOMBRE_P" + index.toString()] = "";
                indexValueTag["L" + line.toString() + "P" + index.toString()] = "0";
            }

            this.groups["TN_IPSA" + line.toString()] =  indexNameTag;
            this.groups["TV_IPSA" + line.toString()] = indexValueTag;
        }

        // Ingreso de nombres de TAGS PARÁMETROS
        for ( let line = 1; line <= 3; line++ ) {
            let indexValueTag : any = {};

            for ( let index = 1; index <= 30; index++ ) {
                if ( line == 1 || index <= 26 ) {
                    indexValueTag["L" + line.toString() + "R" + index.toString()] = "0";
                }
            }

            this.groups["TV_PARAM" + line.toString()] = indexValueTag;
        }

    }
}