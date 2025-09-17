import { closeConnection } from "./connection";
import { commit } from "./utility";

/**
    getSites() - Retrieves all sites from the database.
    Input: none
    Output: array - An array of all sites in the database.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSites(connection) {
    if (!validateConnection(connection)) return false;
    const [result] = await connection.query(`SELECT * FROM userWebsites;`);
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
export async function getSiteByID(id, connection) {
    if (!await validateConnection(connection)) return false;
    await connection.query(`SELECT * FROM userWebsites WHERE id = ?;`, [id])
}

/**
    getSiteByName(name) - Retrieves a site from the database by its name.
    Input: name - The name of the site to retrieve.
    Output: object - The site with the specified name.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSiteByName(name, connection) {
    if (!await validateConnection(connection)) return false;
    const [result] = await connection.query(`SELECT * FROM userWebsites WHERE websiteName = ?;`, [name]);
    return result;
}

/**
 * getSiteCount() - Retrieves the number of sites in the database.
 * Input: none
 * Output: number - The number of sites in the database.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function getSiteCount(connection) {
    if (!await validateConnection(connection)) return false;
    const [result] = await connection.query(`SELECT COUNT(*) FROM userWebsites;`)
    return false;
}

/**
 * createSite(name) - Creates a new site in the database.
 * Input: name - The name of the site to create.
 * Output: boolean - true if the site was created successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function createSite(name, connection, userId) {
    if (!await validateConnection(connection)) return false;
    await connection.query(`INSERT INTO userWebsites (websiteName, website_user_id) VALUES (?, ?);`, [name, userId]);
    return await commit(connection);
}

/**
 * deleteSite(id) - Deletes a site from the database by its ID.
 * Input: id - The ID of the site to delete.
 * Output: boolean - true if the site was deleted successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function deleteSite(siteId, connection) {
    if (!validateConnection(connection)) return false;
    await connection.query(`DELETE FROM userWebsites WHERE id = ?;`, [siteId]);
    return await commit(connection);
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
export async function updateSite(id, name, connection) {
    if (!validateConnection(connection)) return false;
    await connection.query(`UPDATE userWebsites SET websiteName=?, websiteDateLastModified=NOW()  WHERE id = ?;`, [data, id]);
    return await commit(connection);
}