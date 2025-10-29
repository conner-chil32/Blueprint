import mysql from 'mysql2';
import { validateConnection } from './utility.js';

export const connection = await mysql.createPool({
    host: "localhost",
    user: "blueprintuser",
    password: "password",
    database: "blueprint",
    port: 3306,
    multipleStatements: true,
    connectionLimit: 10,
    }).promise();

/*
    closeConnection: A function that closes the connection to the database if one exists.
    Input: none
    Output: deletion of global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function closeConnection() {
    try {
        await validateConnection();
        await connection.end();
    } catch (err) {
        throw false;
    }
    return true;
    
       
    // if (result = !await validateConnection(connection)) {
    // } 
    // try{
    //     console.log("[DB] Closing connection to database...");
    //     try {
    //         await connection.releaseConnection();
    //     } catch (error) {
    //         throw new Error("[DB] Error on closing the connection.")
    //     }
    // } catch (err) {
    //     console.log("[DB] Error on close... Shutting down.", err)
    //     return await shutdownConnection(connection);
    // }
}

/*
    ##### OBSOLETE FUNCTION DO NOT USE IT WILL NOT WORK #####
    shutdownConnection: A function that destroys the connection to the database if one exists.
    Input: none
    Output: deletion of global.connection - The connection object to the database.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
// async function shutdownConnection() {
//     if (!await validateConnection()) return true;
//     if (result) {
//         try{
//             console.log("[DB] Attempting to destroy connection")
//             await connection.destroy();
//         } catch (err) {
//             console.log("[DB] Error destroying connection to database:", err);
//             return false;
//         }
//     } else {
//         console.log("[DB] No connection to destroy.");
//         return true;
//     }
//     return true;
// }   