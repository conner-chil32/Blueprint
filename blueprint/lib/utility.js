import { getConnectionObject } from "./connection.js";
/*
    commit() - commits the current transaction to the database
    Input: none
    Output: boolean - true if the transaction was committed successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function commit() {
    await global.connection.commit((err) => {
        if (err) {
            console.error("[DB] Error committing transaction:", err);
            return false;
        } else {
            console.error("[DB] Transaction committed successfully.");
            return true;
        }
    });
}

/*
    rollback() - rolls back the current transaction to the last commit
    Input: none
    Output: boolean - true if the transaction was rolled back successfully, false otherwise
    Date: 4/14/2025
    Author: Lydell Jones
*/
export async function rollback() {
    await global.connection.rollback((err) => {
        if (err) {
            console.error("[DB] Error rolling back transaction:", err);
            return false;
        } else {
            console.error("[DB] Transaction rolled back successfully.");
            return true;
        }
    });
}

//TODO: add a function to make this work SCRUM-227
export function parse() {
    //parse the data from the database into a usable format
    //this is a placeholder function, as the data format is not yet known
    return true;
}

export async function validateConnection() {
    console.error("[DB] Validating connection to database...");
    if (!global.connection) {
        console.error("[DB] No connection to database. Attempting to create one.");
        if (await getConnectionObject()) {
            console.error("[DB] Connection to database created successfully.");
            return true;
        } else {
            console.error("[DB] Error creating connection to database.");
            return false;
        }  
        //FIXME: this is flawed, this does not guarantee a connection was made
    }
}

//THE FUNCTION BELOW ASSUMES THAT YOU HAVE USED THE validateConnection() FUNCTION
export function primeConnection() {
    return global.connection.connect
}