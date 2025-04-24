import dbPromise from "../database/sqlite";
import { LecturaRecord, LecturaT, ParamsLectura } from "../types";

//Crear tabla
export const initDatabase = async () => {
  try {
    const dataBase = await dbPromise;

    //Eliminar la tabla (Borrar línea en producción)
    //await dataBase.execAsync(`DROP TABLE IF EXISTS Lecturas`);
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
                estado BOOLEAN DEFAULT 0 CHECK (estado IN (0, 1)),
                createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

    console.log("Base de datos inicializada");
  } catch (error) {
    console.error("Error al inicializar la base de datos", error);
    throw error;
  }
};

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
          foto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lecturaData.ruta,
        lecturaData.fecha,
        lecturaData.ordenLectura,
        lecturaData.numeroCuenta,
        lecturaData.lecturaActual,
        lecturaData.consumo || null,
        lecturaData.observacion || null,
        lecturaData.foto || null,
        0,
      ]
    );

    console.log("Lectura creada con ID:", result.lastInsertRowId);
    return {
      success: true,
      id: result.lastInsertRowId,
      message: "Lectura registrada correctamente",
    };
  } catch (error) {
    throw error;
  }
};

export const getLectura = async ({ ruta, estado} : ParamsLectura) => {
  try {
    const db = await dbPromise;

    let query = `SELECT * FROM Lecturas`;
    const conditions: string[] = [];
    const params: (string | boolean)[] = [];

    // Agregar ruta
    if (ruta) {
      conditions.push(`ruta = ?`);
      params.push(ruta);
    }

    // Agregar estado
    if (typeof estado === "boolean") {
      conditions.push(`estado = ?`);
      params.push(estado);
    }

    // Añadir cláusula WHERE si hay condiciones
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    // Ordenamos por ruta
    query += ` ORDER BY ruta DESC`;

    const lecturas = await db.getAllAsync<LecturaRecord>(query, params);
    return lecturas

  } catch (error) {
    throw error;
  }
};
