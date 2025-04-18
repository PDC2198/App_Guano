import * as LecturaModel from "../models/LecturoModel"
import { LecturaT } from "../types";

export class LecturaController {

    //Crear lectura
    static async addlectura (data : LecturaT) {
        return await LecturaModel.createLectura(data)
    }
}