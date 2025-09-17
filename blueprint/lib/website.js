/*
FOR TESTING BOTH THE USER AND WEBSITE CLASS RUN:
docker compose up -d
node /path/to/run-parser-tests.js
*/
import { validateConnection, commit } from './utility.js';
import { 
    getSites, 
    getSiteByID, 
    getSiteByName, 
    getSiteCount, 
    createSite, 
    updateSite, 
    deleteSite 
} from './siteQueries.js';

export class Website {
    constructor() {
        this.id = null;
        this.websiteName = '';
        this.websiteDateAdded = null;
        this.websiteDateLastVisited = null;
        this.websiteDateLastModified = null;
        this.website_user_id = null;
    }

    /**
     * Returns the class name
     * @returns {string} The class name
     */
    static getClass() {
        return 'Website';
    }

    /**
     * Gets all fields of the Website table
     * @returns {Promise<Array>} Array of website objects or false if error
     */
    static async getAllWebsites() {
        try {
            const sites = await getSites();//Call get sites from siteQueries.js
            return sites;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Gets a website by ID
     * @param {number} id The ID of the website to retrieve
     * @returns {Promise<Object>} The website object or false if error
     */
    static async getWebsiteById(id) {
        try {
            const site = await getSiteByID(id);
            return site;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Gets a website by name
     * @param {string} name The name of the website to retrieve
     * @returns {Promise<Object>} The website object or false if error
     */
    static async getWebsiteByName(name) {
        try {
            const site = await getSiteByName(name);
            return site;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Gets the count of websites in the database
     * @returns {Promise<number>} The count of websites or false if error
     */
    static async getWebsiteCount() {
        try {
            const count = await getSiteCount();
            return count;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Sets the website name
     * @param {string} name The name to set
     */
    setWebsiteName(name) {
        this.websiteName = name;
    }

    /**
     * Sets the website user ID
     * @param {number} userId The user ID to set
     */
    setWebsiteUserId(userId) {
        this.website_user_id = userId;
    }

    /**
     * Gets the website ID
     * @returns {number} The website ID
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the website name
     * @returns {string} The website name
     */
    getWebsiteName() {
        return this.websiteName;
    }

    /**
     * Gets the website date added
     * @returns {Date} The date the website was added
     */
    getWebsiteDateAdded() {
        return this.websiteDateAdded;
    }

    /**
     * Gets the website date last visited
     * @returns {Date} The date the website was last visited
     */
    getWebsiteDateLastVisited() {
        return this.websiteDateLastVisited;
    }

    /**
     * Gets the website date last modified
     * @returns {Date} The date the website was last modified
     */
    getWebsiteDateLastModified() {
        return this.websiteDateLastModified;
    }

    /**
     * Gets the website user ID
     * @returns {number} The website user ID
     */
    getWebsiteUserId() {
        return this.website_user_id;
    }

    /**
     * Adds a website to the database
     * @returns {Promise<boolean>} true if successful, false otherwise
     */
    async addWebsite() {
        try {
            if (!validateConnection()) return false;
            const result = await createSite(this.websiteName);
            if (result) {
                await commit();
                return true;
            }
            return false;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Removes a website from the database
     * @returns {Promise<boolean>} true if successful, false otherwise
     */
    async removeWebsite() {
        try {
            if (!this.id) {
                throw new Error('Website ID is required to remove a website');
            }
            if (!validateConnection()) return false;
            const result = await deleteSite(this.id);
            if (result) {
                await commit();
                return true;
            }
            return false;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Handles errors from the database
     * @param {Error} error The error to handle
     * @returns {string} A not found message
     */
    static handleError(error) {
        console.error(`[Website] Error: ${error.message}`);
        return `Website not found: ${error.message}`;
    }
}

export default Website;