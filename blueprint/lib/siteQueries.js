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
        [result] = await connection.query(`SELECT * FROM userWebsites WHERE siteID = ?;`, [id]);
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


export async function getSitesByUser(userId) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM userWebsites WHERE userID = ?;`, [userId]);
    } catch (err) {
        throw undefined;
    }
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
        await connection.query(`INSERT INTO userWebsites (websiteName, userID) VALUES (?, ?);`, [name, userId]);
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
        await connection.query(`DELETE FROM userWebsites WHERE siteID = ?;`, [siteId]);
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
        await connection.query(`UPDATE userWebsites SET websiteName=?, websiteDateUpdated=NOW()  WHERE siteID = ?;`, [siteName, id]);
        await commit();
    } catch (err) {
        console.error(err);
        throw false;
    }
    return true;
    // if (!validateConnection()) return false;
    // await connection.query(`UPDATE userWebsites SET websiteName=?, websiteDateUpdated=NOW()  WHERE id = ?;`, [name, id]);
    // return await commit();
}



/*
 * createMedia(siteId, fileType, mime, data) - Inserts user uploaded files into the databse
 * Input:   siteId - The ID of the site this media is being uploaded to.
 *          fileType - the type of file that is being uploaded (imgage, video, audio)
 *          mime - The mime type of the file.
 *          data - the file being uploaded
 * Output:  boolean - true if the media was inserted into the db successfully, false otherwise.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function createMedia(siteId, fileType, mime, data) {
    try {
        await validateConnection()
        await connection.query(`INSERT INTO siteMedia (siteID, fileType, mimeType, fileData) VALUES (?, ?, ?, ?);`,
            [siteId, fileType, mime, data]);
    } catch (err) {
        throw false;
    }
    return true;
}


/*
 * getMediaByID(id, siteId) - Retrieves media by its ID.
 * Input:   id - The ID of the media file
 *          siteId - The ID of the site this media was uploaded to.
 * Output: object - The media with the specified ID.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getMediaByID(id, siteId) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM siteMedia WHERE mediaID =? AND siteID =?;`, [id, siteId]);
    } catch (err) {
        throw undefined;
    }
    return result;
}

/*
 * getMediaBySite(siteId) - Retrieves all media linked to a specifc site.
 * Input:   siteId - The ID of the site the media files were uploaded to.
 * Output: object - The media files from the with the specified site.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getMediaBySite(siteId) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM siteMedia WHERE siteID =?;`, [siteId]);
    } catch (err) {
        throw undefined;
    }
    return result;
}


/*
 * deleteMedia(id, site) - Deletes a media file based on its id.
 * Input:   id - The ID of the media being delted.
 *          siteId - The ID of the site the media file was uploaded to.
 * Output: boolean - Returns true if the media was sucessfully deleted, otherwise false is returned.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function deleteMedia(id, siteId) {
    try {
        await validateConnection();
        await connection.query(`DELETE FROM siteMedia WHERE mediaID = ? AND siteID = ?;`, [id, siteId]);
    } catch (err) {
        console.error("[createPage] ERROR:", err);
        throw false;
    }
    return true;
}


/*
 * createPage(siteId, path, data) - Creates a new page for a site.
 * Input:   siteId - The ID of the site this page will belong to.
 *          path - The URL path for this site (ex: /about, /index)
 *          data - A JSON with css, html, and JS bundled inside
 * Output: boolean - Returns true if the page was sucessfully created, otherwise false is returned.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function createPage(siteId, path, data) {
    try {
        await validateConnection()
        await connection.query(`INSERT INTO sitePages (siteID, pagePath, pageData) VALUES (?, ?, ?);`,
            [siteId, path, data]);
    } catch (err) {
        throw false;
    }
    return true;
}


/*
 * getPageByID(id, siteId) - Retrieves a page by its ID
 * Input:   id - The ID of the page.
 *          siteId - the ID of the site the page belongs to.
 * Output: object - Returns the page being requested.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getPageByID(id, siteId) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM sitePages WHERE pageID =? AND siteID =?;`, [id, siteId]);
    } catch (err) {
        throw undefined;
    }
    return result;
}


/*
 * getPagesBySite(siteId) - Retrieves all pages that belong to a site.
 * Input:   siteId - the ID of the site the pages belong to.
 * Output: object - Returns the pages that belong to the site.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getPagesBySite(siteId) {
    var result;
    try {
        await validateConnection();
        [result] = await connection.query(`SELECT * FROM sitePages WHERE siteID =?;`, [siteId]);
    } catch (err) {
        throw undefined;
    }
    return result;
}


/*
 * deletePage(id, siteID) - Deletes a page based on its id
 * Input:   id - the ID of the page to be deleted.
 *          siteId - the ID of the site the page belongs to.
 * Output: boolean - Returns true if the page was deleted sucessfully, otherwise returns false.
 * Date: 10/11/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function deletePage(id, siteId) {
    try {
        await validateConnection();
        await connection.query(`DELETE FROM sitePages WHERE pageID = ? AND siteID = ?;`, [id, siteId]);
    } catch (err) {
        throw false;
    }
    return true;
}