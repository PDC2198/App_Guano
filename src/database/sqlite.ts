import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Inicializa la base de datos y crea la tabla si no existe
export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('AppGuano.db');

        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Lecturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ordenLectura INTEGER,
        numeroCuenta INTEGER,
        lectura INTEGER,
        fecha TEXT,
        sincronizado INTEGER DEFAULT 0
      )
    `);

        console.log('Base de datos inicializada');
    } catch (error) {
        console.error('Error al inicializar la base de datos', error);
    }
};

// Inserta una nueva lectura
export const insertLectura = async (lectura: number, fecha: string) => {
    try {
        await db.runAsync(
            'INSERT INTO Lecturas (lectura, fecha) VALUES (?, ?)',
            [lectura, fecha]
        );
        console.log('Lectura guardada localmente');
    } catch (error) {
        console.error('Error al guardar la lectura localmente', error);
    }
};

// Obtiene las lecturas pendientes (sincronizado = 0)
export const getPendingDataFromSQLite = async (): Promise<any[]> => {
    try {
        const results = await db.getAllAsync(
            'SELECT * FROM Lecturas WHERE sincronizado = 0'
        );
        return results;
    } catch (error) {
        console.error('Error al obtener datos pendientes', error);
        return [];
    }
};

// Marca lecturas como sincronizadas
export const markDataAsSynced = async (data: any[]) => {
    try {
        for (const item of data) {
            await db.runAsync(
                'UPDATE Lecturas SET sincronizado = 1 WHERE id = ?',
                [item.id]
            );
            console.log(`Lectura con ID ${item.id} marcada como sincronizada`);
        }
    } catch (error) {
        console.error('Error al marcar como sincronizado', error);
    }
};
