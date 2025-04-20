import { openConnection } from "./connection.js";
/*
    commit() - commits the current transaction to the database
    Input: none
    Output: boolean - true if the transaction was committed successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function commit(connection) {
    if (!connection) {
        console.log("[DB] No connection to database. Cant commit.");
        return false;
    } else {
        try {
            const commitConnection = await connection.getConnection();
            commitConnection.commit();
        } catch (err) {
            console.log("[DB] Couldn't Commit!")
        }
        return true;
    }
    
}

/*
    rollback() - rolls back the current transaction to the last commit
    Input: none
    Output: boolean - true if the transaction was rolled back successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function rollback(connection) {
    try {
        const rollbackConnection = await connection.getConnection();
        await rollbackConnection.rollback();
        console.log("[DB] Database rolled back!");
    } catch (err) {
        console.log("[DB] Error rolling back database!")
        return false;
    }
}

//TODO: add a function to make this work SCRUM-227
export function parse() {
    //parse the data from the database into a usable format
    //this is a placeholder function, as the data format is not yet known
    return true;
}

export async function validateConnection(connection) {
    console.log("[DB] Validating connection to database...");
    if (!connection) return false;
    if (connection.state === "disconnected") {
        return false;
    } else {
        return true;
    }
}