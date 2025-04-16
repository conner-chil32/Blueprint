import mysql from 'mysql2/promise';
import { validateConnection } from './utility';

/*
    getConnectionObject: A function that returns the connection object to the database.
    Input: none
    Output: global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getConnectionObject() {
    console.error("[DB] Getting connection object...");
    return await openConnection(); //: GLOBAL.CONNECTION IS SET HERE

}

/*
    openConnection: A function that opens a connection to the database if one does not already exist.
    Input: none
    Ouput: global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function openConnection() {
    if (global.connection && global.connection.state !== 'disconnected') { // if a connection exists
        console.error("[DB] Connection to database already exists. Acquiring connection...");
        return global.connection; //TODO: 
    } else if (global.connection) { // if a disconnected connection exists
        await global.connection.destroy();
        delete global.connection;
        openConnection(); // re-create the connection
    } else { // if no connection is present
        try {
            console.error("[DB] Creating connection to database...");
            global.connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 3306,
            multipleStatements: true,
            connectionLimit: 10,
            });
        } catch (err) {
            console.error("[DB] Error creating connection to database:", err);
            return false;
        }
    }
}

/*
    closeConnection: A function that closes the connection to the database if one exists.
    Input: none
    Output: deletion of global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function closeConnection() {
    if (global.connection) {
        console.error("[DB] Closing connection to database...");
        try {
            await global.connection.end();
            console.error("[DB] Connection to database closed successfully.");
            return true;
        } catch (err) {
            console.error("[DB] Error closing connection to database:", err);
            await global.connection.destroy();
            console.error("[DB] Connection to database destroyed.");
        }
        delete global.connection;
        console.error("[DB] global variable connection deleted.");
        return false;
    }
}

/*
    shutdownConnection: A function that destroys the connection to the database if one exists.
    Input: none
    Output: deletion of global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function shutdownConnection() {
    try {
        result = await validateConnection()
        if (result) {
            try{
                await global.connection.destroy();
            } catch (err) {
                console.error("[DB] Error destroying connection to database:", err);
            } finally {
                delete global.connection;
                console.error("[DB] global variable connection deleted.");
            }
        } else {
            console.error("[DB] No connection to destroy.");
        }
    } catch (err) {
        console.error("[DB] Error validating connection:", err);
    }
}   

