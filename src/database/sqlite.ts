import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('AppGuano.db');
export default db
