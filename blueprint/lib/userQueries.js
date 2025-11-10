import { validateConnection } from "./utility.js";
import { encryptString } from "./utility.js";
import { connection } from "./connection.js";
import { User } from "./user.js";
import { getCookie } from "@root/api/CookieController.js";
import { getSiteByID } from "./siteQueries.js";
import { registerWordpress } from "./user.js";

/**
 * getUserByEmail - Retrieves a user by their email address.
 * Input: email - The email address of the user to retrieve.
 * Output: object - The user with the specified email address.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql2
 */
export async function getUserByEmail(email) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE userEmail = ?;`, [email]);
    return result;
}

/**
 * getUserByID - Retrieves a user by their ID.
 * Input: id - The ID of the user to retrieve.
 * Output: object - The user with the specified ID.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function getUserByID(id) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE userID = ?;`, [id]);
    return result;
}

/**
 * signIn - Signs in a user with the specified username and password.
 * Input: user - The username of the user to sign in.
 * password - The password of the user to sign in.
 * Output: boolean - true if the user was signed in successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 */
export async function signIn(user, password) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE userName = ? AND userPassHash = ?`, [user, encryptString(password)]);
    return result;
}

/**
 * createAccount - Creates a new user account with the specified username and password.
 * Input: user - The username of the user to create.
 * password - The password of the user to create.
 * Output: boolean - true if the account was created successfully, false otherwise.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql
 * Edited to also contain security question and answer by Elijah white on 9/27/2025
 */
export async function createAccount(user, password, email, securityQuestion, securityAnswer) {
    if (!await validateConnection()) return false;
    const passwordHash = await encryptString(password);
    const loginHash = await encryptString(user+passwordHash);
    const [result] = await connection.query(`INSERT INTO userAccounts (userName, userPassHash, userEmail, userWpName, userWpPassHash, userQuestion, userAnswer) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user, passwordHash, email, user, loginHash, securityQuestion, securityAnswer]);
    //registerWordpress(user, loginHash);
    return result;
}


/**
 * deleteAccount - Deletes a user account
 * Input: userId - The id of the user to delete
 * Output: boolean - true if the account was deleted successfully, false otherwise.
 * Date: 10/26/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function deleteAccount(userId) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query('DELETE FROM userAccounts WHERE userID = ?;', [userId]);
    return result;
}

/**
 * createAccountWithPhone - Creates a user with all required information and its optional phone number.
 * Input: user - The username of the user to create, password - password of user, emaile - email of user, connection - connection to DB, phone - the phone number of the user. 
 * Output: boolean - true if the account was created successfully, false otherwise.
 * Date: 09/11/2025
 * Author: Elijah White
 * Dependencies: mysql
 * Edited to also contain security question and answer by Elijah white on 9/27/2025
 */
export async function createAccountWithPhone(user, password, email, phone, securityQuestion, securityAnswer) {
    if (!await validateConnection()) return false;
    const passwordHash = await encryptString(password);
    const loginHash = await encryptString(user+passwordHash);
    const [result] = await connection.query(`INSERT INTO userAccounts (userName, userPassHash, userEmail, userPhone, userWpName, userWpPassHash, userQuestion, userAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [user, passwordHash, email, phone, user, loginHash, securityQuestion, securityAnswer]);
    // await registerWordpress(user, loginHash);
    return result;
}

/**
 * getUserByUsername - Retrieves a user by their Username.
 * Input: username - The username of the user to retrieve.
 * Output: object - The user with the specified Username.
 * Date: 9/08/2025
 * Author: Elijah White
 * Dependencies: mysql
 */
export async function getUserByUsername(username) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE userName = ?;`, [username]);
    return new User (result[0]);
}

/**
 * validateUser - retrieves the user id from cookie "UserCookie" if the id is valid
 * Input: req - the http request object
 * Ouput: string - the user primary key in the database
 * Error: Exception - user validation failed
 */
export async function validateUser(request) {
    //get user cookie and check database if user is seen in database
    const user = getCookie(request, 'UserCookie');
    if (user === null) throw "Could not validate user";
    const validationCheck = ((await getUserByID(user)).length != 0);
    
    //if valid return the user id
    if (validationCheck){
        return user;
    } else {
        throw "Could not validate user";
    }
}

/**
 * validateUser - retrieves the user id from cookie "UserCookie" if the id is valid
 * Input: site - the http request object
 * Ouput: string - the id of the site
 * Error: Exception - site validation failed
 */
export async function validateSite(site_id) {
    var siteCount = (await getSiteByID(site_id))?.length;
    try {
        if (siteCount >= 1) { //checks if there are sites under the site's id
            return site_id; //returns the id of the site
        } else {
            throw "Could not validate site";
        }
    } catch (err) {
        console.log(err);
        throw "Could not validate site";
    }
}

export async function validateUserSite(user_id, site_id) {
    try {
        await validateSite(site_id);
        await validateUser(user_id);
        return true;
    } catch {
        throw "Could not validate the User Site"
    }
}


/**
 * getAllUsers - Retrieves all users in database
 * Input:   limit_val - The total amount of records to retrieve
 *          offset_val - What row the list should start at.  
 * Output:  object - The users currently in the database up to limit_val count. 
 * Date: 10/22/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getAllUsers(limit_val = 4, offset_val = 0) {

    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT userID, userName, userEmail, userPhone, userLastLogin, adminNote
                                            FROM userAccounts
                                            ORDER BY userID
                                            LIMIT ? OFFSET ?;`,
                                            [limit_val, offset_val] 
                                            );
                                            
    return result;
}


/**
 * getAllUsers - Updates the note attached to a user account.
 * Input:   userId - ID of the user you want to attach a note to.
 *          note - The text content of the note.
 * Output:  boolean - True if note has been updated.
 * Date: 10/22/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function updateUserNote(userId, note) {

    if (!await validateConnection()) return false;
    const [result] = await connection.query(`UPDATE userAccounts
                                            SET adminNote = ?
                                            where userID = ?;`,
                                            [note, userId]
                                            
    );
    return result;
}

 /**
 * updateUserPassword - Updates a user's password in the database.
 * Input: id - The ID of the user to update.
 * passwordHash - The new, pre-hashed password.
 * Output: object - The [result] of the query.
 * Date: 10/26/2025
 * Author: Angel Ramirez
 * Dependencies: mysql
 */
export async function updateUserPassword(userID, passwordHash) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(
        `UPDATE userAccounts SET userPassHash = ? WHERE userID = ?;`,
        [passwordHash, userID]
    );
    return result;
}



/**
 * banUser - Bans a user based on their userID
 * Input:   userId - ID of the user you want to ban.
 *          duration - The duration of the ban.
 * Output:  boolean - True if ban was successful.
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function banUser(userId, duration) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(
        `UPDATE userAccounts SET bannedUntil = ? WHERE userID = ?;`,
        [duration, userId]
    );
    return result;
}


/**
 * isBanned - Returns true if the user is currently banned.
 * Input:   userId - ID of the user you want to check ban status of.
 * Output:  boolean - True if the user is currently banned.
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function isBanned(userId) {
    if (!await validateConnection()) return false;
    const [rows] = await connection.query(`SELECT bannedUntil FROM userAccounts WHERE userID = ?;`, [userId]);
    
    const bannedUntil = rows[0]?.bannedUntil;
    if (!bannedUntil) return false; // not banned

    const now = new Date();
    if (new Date(bannedUntil) < now) { //ban has expired
        await banUser(userId, null);  // remove ban
        return false;
    }
    
    return true; // still banned
}


/**
 * getAllLogins - Returns all the rows from the logins table
 * Input:   limit_val - Limit of rows to be returned
 *          offset_val - Which row to start at, useful if using pages to show results
 * Output:  Object - UserID and loginTime columns for each returned row
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getAllLogins(limit_val = 10, offset_val = 0) {

    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT userID, loginTime
                                            FROM logins
                                            ORDER BY loginTime DESC
                                            LIMIT ? OFFSET ?;`,
                                            [limit_val, offset_val]
                                            );

    return result;
}


/**
 * getLoginsById - Returns all the rows from the logins table from a specified user
 * Input:   limit_val - Limit of rows to be returned
 *          offset_val - Which row to start at
 * Output:  Object - UserID and loginTime columns for each returned row
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function getLoginsById(userId, limit_val = 10, offset_val = 0) {

    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT userID, loginTime
                                            FROM logins
                                            WHERE userID = ?
                                            ORDER BY loginTime DESC
                                            LIMIT ? OFFSET ?;`,
                                            [userId, limit_val, offset_val]
                                            );

    return result;
}


/**
 * createLoginById - Creates an entry in logins table from a user ID
 * Input:   userId - User you want to create a login log for
 * Output:  boolean - True if the entry was created.
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function createLoginById(userId) {

    if (!await validateConnection()) return false;
    const [result] = await connection.query(`INSERT INTO logins (userID) VALUES (?)`,[userId]);
    return result;
}


/**
 * createLoginByUsername - Creates an entry in logins table from a username
 * Input:   userName - Username you want to create a login log for
 * Output:  boolean - True if the entry was created.
 * Date: 11/07/2025
 * Author: David Vigil
 * Dependencies: mysql
 */
export async function createLoginByUsername(userName) {
    if (!await validateConnection()) return false;

    // Get the userID for this username
    const [rows] = await connection.query(
        `SELECT userID FROM userAccounts WHERE userName = ?`,
        [userName]
    );

    if (!rows.length) {
        throw new Error(`User "${userName}" not found`);
    }

    const userId = rows[0].userID;

    // Insert into logins
    const [result] = await connection.query(
        `INSERT INTO logins (userID) VALUES (?)`,
        [userId]
    );

    return result;
}


