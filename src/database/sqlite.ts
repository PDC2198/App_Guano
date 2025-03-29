// src/database/sqlite.ts
import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
    { name: 'GUANO.db', location: 'default' },
    () => console.log('Base de datos abierta'),
    (error) => console.error('Error al abrir la base de datos', error)
);

export const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Lecturas (id INTEGER PRIMARY KEY AUTOINCREMENT, lectura INTEGER, fecha TEXT, sincronizado INTEGER DEFAULT 0)',
            [],
            () => console.log('Tabla Lecturas creada con éxito'),
            (error) => console.error('Error al crear la tabla', error)
        );
    });
};

export const insertLectura = (lectura: number, fecha: string) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Lecturas (lectura, fecha) VALUES (?, ?)',
            [lectura, fecha],
            () => console.log('Lectura guardada localmente'),
            (error) => console.error('Error al guardar la lectura localmente', error)
        );
    });
};

export const getPendingDataFromSQLite = async () => {
    return new Promise<any[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Lecturas WHERE sincronizado = 0',
                [],
                (tx, results) => {
                    const rows = results.rows.raw();
                    resolve(rows); // Devuelve las lecturas pendientes
                },
                (error) => {
                    console.error('Error al obtener datos pendientes', error);
                    reject(error); // Se maneja el error correctamente
                }
            );
        });
    });
};

export const markDataAsSynced = async (data: any[]) => {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            data.forEach(item => {
                tx.executeSql(
                    'UPDATE Lecturas SET sincronizado = 1 WHERE id = ?',
                    [item.id],
                    () => console.log(`Lectura con ID ${item.id} marcada como sincronizada`),
                    (error) => {
                        console.error('Error al marcar como sincronizado', error);
                        reject(error); // Maneja error si ocurre durante el proceso
                    }
                );
            });
            resolve(); // Si todo va bien, se resuelve la promesa
        });
    });
};
