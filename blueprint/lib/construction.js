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
import { connection } from './connection.js';

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

//User question and user answer added 9/27, Question and answer for user security question
export async function createUserTable() {    
    console.log("[DB] CREATING USER TABLE");

    try {
        await validateConnection()
        await connection.query(`
            CREATE TABLE IF NOT EXISTS userAccounts (
                userId INT NOT NULL AUTO_INCREMENT,
                userName VARCHAR(255) NOT NULL,
                userPassword VARCHAR(255) NOT NULL,
                userWpName VARCHAR(255),
                userWpPassHash VARCHAR(255),
                userEmail VARCHAR(255),
                userPhone VARCHAR(255),
                userQuestion VARCHAR(255),
                userAnswer VARCHAR(255),
                userWebsites INT(11),
                userDateCreated TIMESTAMP,
                userLastLogin TIMESTAMP,
                isAdmin BOOLEAN DEFAULT FALSE,
                PRIMARY KEY (userId)
        );`.replace(/\n/g, ""));
        await commit();
    }
    catch (err) {
        throw false
    }
    return true;
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
export async function createWebsiteTable() {
    
    try{
        await validateConnection();
        await connection.query(`
        CREATE TABLE IF NOT EXISTS userWebsites (
            id INT NOT NULL AUTO_INCREMENT,
            userId INT NOT NULL,
            websiteName VARCHAR(255) NOT NULL,
            websiteDateAdded TIMESTAMP NOT NULL DEFAULT NOW(),
            websiteDateLastVisited TIMESTAMP DEFAULT NOW(),
            websiteDateLastModified TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (userId) REFERENCES userAccounts(userId),
            PRIMARY KEY (id)
        );`.replace(/\n/g, ""));
        await commit();
    } catch (err) {
        throw false;
    }
    return true;
}
