import mysql from 'mysql2';
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
    console.log("[DB] Getting connection object...");
    return await openConnection(3); //: GLOBAL.CONNECTION IS SET HERE
}

/*
    openConnection: A function that opens a connection to the database if one does not already exist.
    Input: none
    Ouput: global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function openConnection(attempts = 1) {
    if (attempts <= 0) return 0;
    console.log("[DB] Creating connection to database...");
    var connection = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true,
    connectionLimit: 10,
    }).promise();

    if (connection) {
        console.log("[DB] Connection to database created successfully.");
        return connection;
    } else {
        console.log("[DB] Error creating connection to database. Retrying...");
        return await openConnection(attempts - 1);
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
export async function closeConnection(connection) {
    const result = false;
    
    if (result = !await validateConnection(connection)) {
        console.log("[DB] No connection to close.")
    } 
    try{
        console.log("[DB] Closing connection to database...");
        try {
            await connection.releaseConnection();
        } catch (error) {
            throw new Error("[DB] Error on closing the connection.")
        }
    } catch (err) {
        console.log("[DB] Error on close... Shutting down.", err)
        return await shutdownConnection(connection);
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
async function shutdownConnection(connection) {
    if (!await validateConnection(connection)) return true;
    if (result) {
        try{
            console.log("[DB] Attempting to destroy connection")
            await connection.destroy();
        } catch (err) {
            console.log("[DB] Error destroying connection to database:", err);
            return false;
        }
    } else {
        console.log("[DB] No connection to destroy.");
        return true;
    }
    return true;
}   

