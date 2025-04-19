import * as LecturaModel from "../models/LecturoModel";
import { LecturaT, ParamsLectura } from "../types";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from 'expo-sharing';

export class LecturaController {
  //Crear lectura
  static async addlectura(data: LecturaT) {
    return await LecturaModel.createLectura(data);
  }

  static async getAllLectura(params: ParamsLectura) {
    return await LecturaModel.getLectura(params);
  }

  static async exportDatabase() {
    const dbPath = `${FileSystem.documentDirectory}SQLite/AppGuano.db`;
    const newPath = `${FileSystem.cacheDirectory}AppGuano_export.db`;
  
    // 1. Copiar a caché (área pública temporal)
    await FileSystem.copyAsync({ from: dbPath, to: newPath });
  
    // 2. Compartir/Guardar con expo-sharing
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Exportar base de datos',
        UTI: 'public.database' // Solo para iOS
      });
    } else {
      console.log("Sharing no disponible en este dispositivo");
    }
  }
}
