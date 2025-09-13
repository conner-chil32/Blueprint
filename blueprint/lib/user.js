/*
FOR TESTING BOTH THE USER AND WEBSITE CLASS RUN:
docker compose up -d
node /path/to/run-parser-tests.js
*/
import { validateConnection, commit } from './utility.js';
import {
    getUserByEmail,
    getUserByUsername,
    getUserByID,
    signIn,
    createAccount
} from './userQueries.js';
import { Website } from './website.js';
import bcrypt from "bcrypt";

export class User {
    constructor() {
        this.id = null;
        this.userName = '';
        this.userPassHash = '';
        this.userWpName = '';
        this.userWpPassHash = '';
        this.userEmail = '';
        this.userPhone = '';
        this.userWebsites = 0;
        this.userDateCreated = null;
        this.userLastLogin = null;
        this.isAdmin = false;
        this.loggedIn = false;
    }

    /**
     * Returns the class name
     * @returns {string} The class name
     */
    static getClass() {
        return 'User';
    }

    /**
     * Gets a user by email
     * @param {string} email The email of the user to retrieve
     * @returns {Promise<Object>} The user object or false if error
     */
    static async getUserByEmail(email) {
        try {
            const user = await getUserByEmail(email);
            return user;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Gets a user by ID
     * @param {number} id The ID of the user to retrieve
     * @returns {Promise<Object>} The user object or false if error
     */
    static async getUserById(id) {
        try {
            const user = await getUserByID(id);
            return user;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    /**
     * Sets the user name
     * @param {string} name The name to set
     */
    setUserName(name) {
        this.userName = name;
    }

    /**
     * Sets the user password hash
     * @param {string} passHash The password hash to set
     */
    setUserPassHash(passHash) {
        this.userPassHash = passHash;
    }

    /**
     * Sets the user WordPress name
     * @param {string} wpName The WordPress name to set
     */
    setUserWpName(wpName) {
        this.userWpName = wpName;
    }

    /**
     * Sets the user WordPress password hash
     * @param {string} wpPassHash The WordPress password hash to set
     */
    setUserWpPassHash(wpPassHash) {
        this.userWpPassHash = wpPassHash;
    }

    /**
     * Sets the user email
     * @param {string} email The email to set
     */
    setUserEmail(email) {
        this.userEmail = email;
    }

    /**
     * Sets the user phone #
     * @param {string} phone The phone # to set
     */
    setUserPhone(phone) {
        this.userPhone = phone;
    }

    /**
     * Gets the user ID
     * @returns {number} The user ID
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the user name
     * @returns {string} The user name
     */
    getUserName() {
        return this.userName;
    }

    /**
     * Gets the user email
     * @returns {string} The user email
     */
    getUserEmail() {
        return this.userEmail;
    }

    /**
     * Gets the user phone
     * @returns {string} The user phone
     */
    getUserPhone() {
        return this.userPhone;
    }

    /**
     * Gets the user websites count
     * @returns {number} The user websites count
     */
    getUserWebsites() {
        return this.userWebsites;
    }

    /**
     * Gets the user date created
     * @returns {Date} The date the user was created
     */
    getUserDateCreated() {
        return this.userDateCreated;
    }

    /**
     * Gets the user last login
     * @returns {Date} The date the user last logged in
     */
    getUserLastLogin() {
        return this.userLastLogin;
    }

    /**
     * Gets the user's WordPress credentials
     * @returns {Array} Array containing WordPress username and password
     */
    getWPCredentials() {
        return [this.userWpName, this.userWpPassHash];
    }

    /**
     * Gets the user's account credentials
     * @returns {Array} Array containing username and password hash
     */
    getUserCredentials() {
        return [this.userName, this.userPassHash];
    }

    /**
     * Adds a website to the user
     * @returns {Promise<boolean>} true if successful, false otherwise
     */
    async addWebsite() {
        try {
            if (!validateConnection()) return false;//If no connection return false
            
            // Create a new website
            const website = new Website();
            website.setWebsiteName(this.websiteName);
            website.setWebsiteUserId(this.id);
            
            const result = await website.addWebsite();
            if (result) {
                // Update user's website count
                this.userWebsites += 1;
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
     * Removes a website from the user
     * @returns {Promise<boolean>} true if successful, false otherwise
     */
    async removeWebsite() {
        try {
            if (!validateConnection()) return false;//return false if no connection
            
            //Remove the website using Website class
            const website = new Website();
            website.id = this.websiteId; // Assuming websiteId is set
            
            const result = await website.removeWebsite();
            if (result) {
                // Update user's website count
                this.userWebsites -= 1;
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
     * Encrypts and validates user login credentials
     * @param {string} username The username
     * @param {string} password The password to authenticate
     * @returns {boolean} true if login is successful, false otherwise
     */
    async encryptData(username, password) {
        try {
            if (this.isLoggedIn()) return true; //If user already logged in
            
            const user = await getUserByUsername(username);

            if (!user) return false; // If user not found, return false

            const storedUsername = user.userName;
            const storedPassword = user.userPassHash;

            const match = await bcrypt.compare(password,storedPassword);

            if (storedUsername === username && match) {//.compare Hashes and checks new password against db hash
                this.loggedIn = true; 
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * Check if user is already logged in
     * @returns {boolean} true if logged in, false otherwise
     */
    isLoggedIn() {
        return this.loggedIn;
    }
    /**
     * Handles errors from the database
     * @param {Error} error The error to handle
     * @returns {string} A not found message
     */
    static handleError(error) {
        console.error(`[User] Error: ${error.message}`);
        return `User not found: ${error.message}`;
    }
}

export default User;