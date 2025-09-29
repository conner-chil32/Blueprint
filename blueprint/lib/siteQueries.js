import { commit, validateConnection } from "./utility.js";
import { connection } from "./connection.js"

/**
    getSites() - Retrieves all sites from the database.
    Input: none
    Output: array - An array of all sites in the database.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSites() {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM userWebsites;`);
    } catch (err) {
        throw undefined;
    }
    return result;
}

/**
    getSiteByID(id) - Retrieves a site from the database by its ID.
    Input: id - The ID of the site to retrieve.
    Output: object - The site with the specified ID.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSiteByID(id) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM userWebsites WHERE id = ?;`, [id]);
    } catch (err) {
        throw undefined;
    }
    return result;
    // if (!await validateConnection()) return false;
    // return await connection.query(`SELECT * FROM userWebsites WHERE id = ?;`, [id])
}

/**
    getSiteByName(name) - Retrieves a site from the database by its name.
    Input: name - The name of the site to retrieve.
    Output: object - The site with the specified name.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSiteByName(name) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM userWebsites WHERE websiteName = ?;`, [name]);
    } catch (err) {
        throw undefined;
    }
    return result;
    // if (!await validateConnection()) return false;
    // const [result] = await connection.query(`SELECT * FROM userWebsites WHERE websiteName = ?;`, [name]);
    // return result;
}

/**
 * getSiteCount() - Retrieves the number of sites in the database.
 * Input: none
 * Output: number - The number of sites in the database.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function getSiteCount() {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT COUNT(*) FROM userWebsites;`);
    } catch (err) {
        throw undefined;
    }
    return result;
    // if (!await validateConnection()) return false;
    // const [result] = await connection.query(`SELECT COUNT(*) FROM userWebsites;`)
    // return result;
}

/**
 * createSite(name) - Creates a new site in the database.
 * Input: name - The name of the site to create.
 * Output: boolean - true if the site was created successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function createSite(name, userId) {
    try {
        await validateConnection()
        await connection.query(`INSERT INTO userWebsites (websiteName, website_user_id) VALUES (?, ?);`, [name, userId]);
        await commit(connection);
    } catch (err) {
        throw false;
    }
    return true;
    // if (!await validateConnection()) return false;
    // await connection.query(`INSERT INTO userWebsites (websiteName, website_user_id) VALUES (?, ?);`, [name, userId]);
    // return await commit(connection);
}

/**
 * deleteSite(id) - Deletes a site from the database by its ID.
 * Input: id - The ID of the site to delete.
 * Output: boolean - true if the site was deleted successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function deleteSite(siteId) {
    try { 
        await validateConnection();
        await connection.query(`DELETE FROM userWebsites WHERE id = ?;`, [siteId]);
        await commit();
    } catch (err) {
        throw false;
    }
    return true;
    // if (!validateConnection()) return false;
    // await connection.query(`DELETE FROM userWebsites WHERE id = ?;`, [siteId]);
    // return await commit();
}

/**
 * updateSite(id, data) - Updates a site in the database by its ID.
 * Input: id - The ID of the site to update.
 * data - The data to update the site with.
 * Output: boolean - true if the site was updated successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function updateSite(id, name) {
    try {
        await validateConnection();
        await connection.query(`UPDATE userWebsites SET websiteName=?, websiteDateLastModified=NOW()  WHERE id = ?;`, [name, id]);
        await commit();
    } catch (err) {
        console.error(err);
        throw false;
    }
    return true;
    // if (!validateConnection()) return false;
    // await connection.query(`UPDATE userWebsites SET websiteName=?, websiteDateLastModified=NOW()  WHERE id = ?;`, [name, id]);
    // return await commit();
}