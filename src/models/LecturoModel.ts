import dbPromise from "../database/sqlite";
import { LecturaEdit, LecturaRecord, LecturaT, Pagination, ParamsLectura } from "../types";

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

// Obtener todos
export const getLectura = async ({ ruta, estado, page = 1, pageSize = 25 }: ParamsLectura) => {
  try {
    const db = await dbPromise;

    const conditions: string[] = [];
    const params: (string | boolean | number)[] = [];

    // Construir condiciones dinámicamente
    if (ruta) {
      conditions.push(`ruta = ?`);
      params.push(ruta);
    }

    if (typeof estado === "boolean") {
      conditions.push(`estado = ?`);
      params.push(estado);
    }

    // Base de la consulta
    let query = `SELECT * FROM Lecturas`;
    let countQuery = `SELECT COUNT(*) as total FROM Lecturas`; //Contar la cantidad

    // Si hay filtros, agregar WHERE
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    // Primero obtener el total de elementos (con filtros aplicados)
    const totalResult = await db.getAllAsync<{ total: number }>(countQuery, params);
    const totalItems = totalResult[0]?.total ?? 0;

    // Calcular paginación
    const skip = pageSize * (page - 1);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Agregar orden y paginación segura
    query += ` ORDER BY ruta DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, skip);

    // Obtener datos paginados
    const lecturas = await db.getAllAsync<LecturaRecord>(query, params);

    const responseData: {
      lecturas: LecturaRecord[];
      pagination: Pagination;
    } = {
      lecturas,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages
      }
    };

    return responseData;
    
  } catch (error) {
    throw error;
  }
};

// Obtener Lectura por su id
export const getLecturaById = async (id: LecturaRecord['id']) => {
  try {
    const db = await dbPromise
    const sql = `SELECT * FROM Lecturas where id = ?`
    const lectura = await db.getAllAsync<LecturaRecord>(sql, [id])
    return lectura[0]
  } catch(error) {
    throw error
  }
}

//Editar
export const updateLectura = async ({
  id,
  ordenLectura,
  numeroCuenta,
  lecturaActual,
  fecha,
  ruta,
  consumo,
  observacion,
  foto
}: LecturaEdit) => {
  try {
    const db = await dbPromise;

    const sql = `
      UPDATE Lecturas
      SET 
        ordenLectura = ?, 
        numeroCuenta = ?, 
        lecturaActual = ?, 
        fecha = ?, 
        ruta = ?, 
        consumo = ?, 
        observacion = ?, 
        foto = ?, 
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      ordenLectura,
      numeroCuenta,
      lecturaActual,
      fecha,
      ruta,
      consumo,
      observacion ?? null,
      foto ?? null,
      id // PK
    ];

    await db.runAsync(sql, params);
    console.log(`Lectura con ID ${id} actualizada correctamente.`);
  } catch (error) {
    throw error;
  }
};

// Eliminar
export const deleteLectura = async (id: LecturaRecord['id']) => {
  try {
    const db = await dbPromise;
    await db.runAsync(`DELETE FROM Lecturas WHERE id = ?`, [id]);
  } catch (error) {
    throw error
  }
}
