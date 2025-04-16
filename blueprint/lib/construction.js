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
export async function createUserTable() {
    if (!validateConnection()) return false;
    global.connection.query(`
        CREATE TABLE IF NOT EXISTS userAccounts (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userName VARCHAR(255) NOT NULL,
            userPassHash VARCHAR(255) NOT NULL,
            userWpName VARCHAR(255),
            userWpPassHash VARCHAR(255),
            userEmail VARCHAR(255) NOT NULL,
            userPhone VARCHAR(255),
            userWebsites INT(11) NOT NULL,
            userDateCreated TIMESTAMP,
            userLastLogin TIMESTAMP,
            isAdmin BOOLEAN DEFAULT FALSE,
    );`);
    //userWPName, userWPPassHash - Wordpress credentials for the user when interacting with the API
    commit();
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
    if (!validateConnection()) return false;

    global.connection.query(`
        CREATE TABLE IF NOT EXISTS userWebsites (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            websiteName VARCHAR(255) NOT NULL,
            websiteDateAdded TIMESTAMP,
            websiteDateLastVisited TIMESTAMP,
            websiteDateLastModified TIMESTAMP,
            FOREIGN KEY (website_user_id) REFERENCES users(id)
        );`);
    
    commit();
}
