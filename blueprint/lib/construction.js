//this file is to be used for table construction

/**
 * ASSUMPTION
 * 
 * @global.connection
 * is of
 * @type {mysql.Connection}
 * 
*/

import { commit, validateConnection } from './utility.js';
import { getConnectionObject } from './connection.js';

/**
 * createUserTable() - Creates the userAccounts table in the database.
 * Input: none
 * Output: boolean - true if the table was created successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */

//XXX: CHANGE THIS AS NEEDED
//TODO: MAKE SURE TO ADD THIS SCHEMA TO THE DOCUMENTATION
export async function createUserTable(connection) {
    if (!await validateConnection(connection)) return false;
    
    await connection.query(`
        CREATE TABLE IF NOT EXISTS userAccounts (
            userId INT NOT NULL AUTO_INCREMENT,
            userName VARCHAR(255) NOT NULL,
            userPassHash VARCHAR(255) NOT NULL,
            userWpName VARCHAR(255),
            userWpPassHash VARCHAR(255),
            userEmail VARCHAR(255) NOT NULL,
            userPhone VARCHAR(255),
            userWebsites INT(11),
            userDateCreated TIMESTAMP,
            userLastLogin TIMESTAMP,
            isAdmin BOOLEAN DEFAULT FALSE,
            PRIMARY KEY (userId)
    );`.replace(/\n/g, ""));

    return await commit(connection);
}

/**
 * createWebsiteTable() - Creates the userWebsites table in the database.
 * Input: none
 * Output: boolean - true if the table was created successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
//XXX: CHANGE THIS AS NEEDED
//TODO: MAKE SURE TO ADD THIS SCHEMA TO THE DOCUMENTATION
export async function createWebsiteTable(connection) {
    if (!await validateConnection(connection)) return false;

    await connection.query(`
        CREATE TABLE IF NOT EXISTS userWebsites (
            id INT NOT NULL AUTO_INCREMENT,
            websiteName VARCHAR(255) NOT NULL,
            websiteDateAdded TIMESTAMP NOT NULL DEFAULT NOW(),
            websiteDateLastVisited TIMESTAMP DEFAULT NOW(),
            websiteDateLastModified TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (userid) REFERENCES users(userid),
            PRIMARY KEY (id)
        );`.replace(/\n/g, ""));

    return await commit(connection);
}
