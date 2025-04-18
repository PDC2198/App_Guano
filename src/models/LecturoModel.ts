import dbPromise from "../database/sqlite";
import { LecturaT } from "../types";

//Crear tabla
export const initDatabase = async () => {
    try {
        const dataBase = await dbPromise

         //Eliminar la tabla (Borrar línea en producción)
        await dataBase.execAsync(`DROP TABLE IF EXISTS Lecturas`);
        await dataBase.execAsync(`
            CREATE TABLE IF NOT EXISTS Lecturas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ordenLectura INTEGER NOT NULL,
                numeroCuenta INTEGER NOT NULL,
                lecturaActual INTEGER NOT NULL,
                fecha TEXT NOT NULL,
                ruta TEXT NOT NULL,
                consumo TEXT NOT NULL,
                observacion TEXT,
                foto TEXT,
                sincronizado BOOLEAN DEFAULT 0 CHECK (sincronizado IN (0, 1)),
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Base de datos inicializada');
    } catch (error) {
        console.error('Error al inicializar la base de datos', error);
        throw error; 
    }
}

//Crear en la DB
export const createLectura = async (lecturaData: LecturaT) => {
    try {

      const db = await dbPromise;
      
      const result = await db.runAsync(
        `INSERT INTO Lecturas (
          ruta,
          fecha,
          ordenLectura,
          numeroCuenta,
          lecturaActual,
          consumo,
          observacion,
          foto,
          sincronizado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lecturaData.ruta,
          lecturaData.fecha,
          lecturaData.ordenLectura,
          lecturaData.numeroCuenta,
          lecturaData.lecturaActual,
          lecturaData.consumo || null,
          lecturaData.observacion || null,
          lecturaData.foto || null,
          0 
        ]
      );
  
      console.log('Lectura creada con ID:', result.lastInsertRowId);
      return {
        success: true,
        id: result.lastInsertRowId,
        message: 'Lectura registrada correctamente'
      };
      
    } catch (error) {
      throw error
    }
  };