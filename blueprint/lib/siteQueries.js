/**
    getSites() - Retrieves all sites from the database.
    Input: none
    Output: array - An array of all sites in the database.
    Date: 4/14/2025
    Author: Lydell Jones
    Dependencies: mysql
*/
export async function getSites() {
    if (!validateConnection()) return false;
    await global.connection.query(`SELECT * FROM userWebsites`, (err, results) => {
        if (err) {
            console.error("[DB] Error retrieving sites:", err);
            return null;
        } else {
            console.log("[DB] Sites retrieved successfully.");
            return results[0];
        }
    });
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
    if (!validateConnection()) return false;
    global.connection.query(`SELECT * FROM userWebsites WHERE id = ?`, [id], (err, results) => {
        if (err) {
            console.error("[DB] Error retrieving sites by ID:", err);
            return false;
        } else {
            console.log("[DB] Sites retrieved successfully.");
            return results;
        }
    });
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
    if (!validateConnection()) return false;
    global.connection.query(`SELECT * FROM userWebsites WHERE websiteName = ?`, [name], (err, results) => {
        if (err) {
            console.error("[DB] Error retrieving sites by name:", err);
            return false;
        } else {
            console.log("[DB] Sites retrieved successfully.");
            return results;
        }
    });
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
    if (!validateConnection()) return false;
    global.connection.query(`SELECT COUNT(*) FROM userWebsites`, (err, results) => {
        if (err) {
            console.error("[DB] Error retrieving site count:", err);
            return false;
        } else {
            console.log("[DB] Site count retrieved successfully.");
            return results[0];
        }
    });
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
export async function createSite(name) {
    if (!validateConnection()) return false;
    global.connection.query(`INSERT INTO userWebsites (websiteName) VALUES (?)`, [name], (err, results) => {
        if (err) {
            console.error("[DB] Error creating site:", err);
            return false;
        } else {
            console.log("[DB] Site created successfully.");
            return true;
        }
    });
    return false;
}

/**
 * deleteSite(id) - Deletes a site from the database by its ID.
 * Input: id - The ID of the site to delete.
 * Output: boolean - true if the site was deleted successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function deleteSite(id) {
    if (!validateConnection()) return false;
    global.connection.query(`DELETE FROM userWebsites WHERE id = ?`, [id], (err, results) => {
        if (err) {
            console.error("[DB] Error deleting site:", err);
            return false;
        } else {
            console.log("[DB] Site deleted successfully.");
            return true;
        }
    });
    return false;
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
export async function updateSite(id, data) {
    if (!validateConnection()) return false;
    global.connection.query(`UPDATE userWebsites SET ? WHERE id = ?`, [data, id], (err, results) => {
        if (err) {
            console.error("[DB] Error updating site:", err);
            return false;
        } else {
            console.log("[DB] Site updated successfully.");
            return true;
        }
    });
    return false;
}