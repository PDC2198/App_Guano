import * as LecturaModel from "../models/LecturoModel"
import { LecturaT, ParamsLectura } from "../types";

export class LecturaController {

    //Crear lectura
    static async addlectura (data : LecturaT) {
        return await LecturaModel.createLectura(data)
    }

    static async getAllLectura (params : ParamsLectura) {
        return await LecturaModel.getLectura(params)
    }
}