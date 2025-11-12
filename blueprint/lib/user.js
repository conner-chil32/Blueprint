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

import bcrypt from 'bcrypt'; 
import { setCookie } from '@root/api/CookieController.js';

export class User {
    constructor(result) {
        this.id = result?.userID;
        this.userName = result?.userName;
        this.userPassHash = result?.userPassHash;
        this.userWpName = result?.userWpName;
        this.userWpPassHash = result?.userWpPassHash;
        this.userEmail = result?.userEmail;
        this.userPhone = result?.userPhone;
        this.userWebsites = result?.userWebsites;
        this.userDateCreated = result?.userDateCreated;
        this.userLastLogin = result?.userLastLogin;
        this.isAdmin = result?.isAdmin;
        this.userQuestion = result?.userQuestion;
        this.userAnswer = result?.userAnswer;
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
     * Handles errors from the database
     * @param {Error} error The error to handle
     * @returns {string} A not found message
     */
    static handleError(error) {
        console.error(`[User] Error: ${error.message}`);
        return `User not found: ${error.message}`;
    }
}

/**
 * Encrypts and validates user login credentials
 * @param {string} username The username
 * @param {string} password The password to authenticate
 * @returns {boolean} true if login is successful, false otherwise
 */
export async function loginUser(username, password) {
    // try {
    //     const rows = await getUserByUsername(username);
    //     const user = Array.isArray(rows) ? rows[0] : rows;


    //     if (user == undefined || user.id == undefined) throw "Invalid Username or Password"; // If user not found, return false

    //     // const storedUsername = user.userName;
    //     // const storedPassword = user.userPassHash;

    //     // const match = await bcrypt.compare(password,storedPassword);

    //     // if (storedUsername === username && match) {//.compare Hashes and checks new password against db hash
    //     //     this.loggedIn = true; 
    //     //     return true;
    //     // } else {
    //     //     return false;
    //     // }

    //     if (!user) throw false;
    //     const match = await bcrypt.compare(password, user.userPassHash);
    //     return user.userName === username && match;

    // } catch (err) {
    //     throw {error: err};
    // }
    // export async function loginUser(username, password) {
    try {
        const user = await getUserByUsername(username);


        if (user == undefined || user.id == undefined) throw "Invalid Username or Password"; // If user not found, return false

        const storedUsername = user.userName;
        const storedPassword = user.userPassHash;


        const match = await bcrypt.compare(password,storedPassword);

        console.log(match);

        if (storedUsername === username && match) {//.compare Hashes and checks new password against db hash
            return user.id;
        } else {
            throw "Invalid Username or Password"
        }
    } catch (err) {
        throw {error: err};
    }
// }
}

const wordpressBase = 'http://wordpress';

export async function registerWordpress(username, password, email) {
    console.log("[WP] Registering Wordpress");

    // Wordpress API only accepts lowercase usernames
    username = username.toLowerCase();
    
    try {
        // Log in with admin credentials; they are now in the enviornment from runtime
        const response = await fetch(`${wordpressBase}/wp-json/jwt-auth/v1/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({username: process.env.WORDPRESS_DATABASE_USER, password: process.env.WORDPRESS_DATABASE_PASSWORD}),
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`[WP] Response error: Status ${response.status}, Error: ${await response.text().catch(() => "")}`);
        }

        const { token } = await response.json();

        // Create a response to send to create the WP account to create a user
        const responseContent = await fetch(`${wordpressBase}/wp-json/wp/v2/users`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!responseContent.ok) {
            throw new Error(`[WP] User creation failed, ${responseContent.status}, Error: ${await responseContent.text().catch(() => "")}`);
        }
        
        console.log('[WP] User created');
        return true;

    } catch (e) {
        console.error(`[WP] Wordpress Registration Error: ${e.message}`);
        throw e;
    }
}

export async function loginWordpress(username, password) {

    const response = await fetch(`${wordpressBase}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        body: new URLSearchParams({ username, password }),
        redirect: "follow"
    });

    const data = await response.json();
    if (!data.token) throw new Error("[WP] Error: No WP token.");

    return data.token;

    // fetch(`${wordpressBase}/wp-json/jwt-auth/v1/token`, requestOptions)
    // .then((response) => response.json())
    // .then((result) => {
    //     sessionStorage.setItem("WP_TOKEN", result["token"])
    //     console.log("token set")
    // })
    // .catch((error) => console.error(error));
}

export async function encryptData(username, password) {
    try {
        
        const user = await getUserByUsername(username);

        if (!user) return false; // If user not found, return false

        const storedUsername = user.userName;
        const storedPassword = user.userPassHash;

        const match = await bcrypt.compare(password,storedPassword);

        if (storedUsername === username && match) {//.compare Hashes and checks new password against db hash
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}



export default User;
