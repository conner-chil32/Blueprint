import { connection, closeConnection } from "./connection.js";
import { getUserByID } from "./userQueries.js";
/*
    commit() - commits the current transaction to the database
    Input: none
    Output: boolean - true if the transaction was committed successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function commit() {
    try{
        await validateConnection()
        await connection.commit()
    } catch (error) {
        console.error("[DB] error on commit", error);
    }

    // if (!connection && validateConnection()) {
    //     console.log("[DB] No connection to database. Cant commit.");
    //     return false;
    // } else {
    //     try {
    //         await connection.commit();
    //     } catch (err) {
    //         console.log("[DB] Couldn't Commit!");
    //     }
    //     return true;
    // }
}

/*
    rollback() - rolls back the current transaction to the last commit
    Input: none
    Output: boolean - true if the transaction was rolled back successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function rollback() {
    try {
        await connection.rollback();
        console.log("[DB] Database rolled back!");
    } catch (err) {
        console.log("[DB] Error rolling back database!");
        throw false;
    }
    return true;
}

//TODO: add a function to make this work SCRUM-227
export function parse() {
    //parse the data from the database into a usable format
    //this is a placeholder function, as the data format is not yet known
    return true;
}

export async function validateConnection() {
    try {
        console.log("[DB] Validating connection to database...");
        if (connection.state === "disconnected" || !connection) {
            await closeConnection();
            throw false;
        } else {
            return true;
        }
    } catch (err) {
        throw false;
    }
}

