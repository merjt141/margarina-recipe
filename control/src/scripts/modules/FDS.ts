/**
 * Clase que administra el listado de TAGS de las recetas en el PLC
 */
export class FDS {
    
    public groups : any = {};       // Listado de grupos de tags

    constructor() {

        // Ingreso de nombres de TAGS COPSA
        for ( let line = 1; line <= 5; line++ ) {
            let indexNameTag : any = {};    // Listado de nombre de ingredientes
            let indexValueTag :  any = {};  // Listado de valor de ingredientes

            // Iterar por todos los ingredientes
            for ( let index = 1; index <= 7; index++ ) {
                // Asignar nombre de ingrediente a línea
                indexNameTag["L" + line.toString() + "_NOMBRE_C" + index.toString()] = "";

                // Asignar valor de ingrediente a línea
                indexValueTag["L" + line.toString() + "C" + index.toString()] = "0";
            }
            
            // Grupo de nombres de ingredientes de receta
            this.groups["TN_COPSA" + line.toString()] =  indexNameTag;

            // Grupo de valores de ingredientes de receta
            this.groups["TV_COPSA" + line.toString()] = indexValueTag;
        }

        // Ingreso de nombres de TAGS IPSA
        for ( let line = 1; line <= 3; line++ ) {
            let indexNameTag : any = {};    // Listado de nombre de ingredientes
            let indexValueTag :  any = {};  // Listado de valor de ingredientes

            // Iterar por todos los ingredientes
            for ( let index = 1; index <= 27; index++ ) {
                // Asignar nombre de ingrediente a línea
                indexNameTag["L" + line.toString() + "_NOMBRE_P" + index.toString()] = "";

                // Asignar valor de ingrediente a línea
                indexValueTag["L" + line.toString() + "P" + index.toString()] = "0";
            }

            // Grupo de nombres de ingredientes de receta
            this.groups["TN_IPSA" + line.toString()] =  indexNameTag;
            
            // Grupo de valores de ingredientes de receta
            this.groups["TV_IPSA" + line.toString()] = indexValueTag;
        }

        // Ingreso de nombres de TAGS PARÁMETROS
        for ( let line = 1; line <= 3; line++ ) {
            let indexValueTag : any = {};

            // Iterar por todos los parámetros
            for ( let index = 1; index <= 30; index++ ) {
                // Listado de parámetros (Solo línea 1 tiene 30)
                if ( line == 1 || index <= 26 ) {
                    // Asignar valor de parámetro a línea
                    indexValueTag["L" + line.toString() + "R" + index.toString()] = "0";
                }
            }

            // Grupo de valores de parámetros
            this.groups["TV_PARAM" + line.toString()] = indexValueTag;
        }

    }
}