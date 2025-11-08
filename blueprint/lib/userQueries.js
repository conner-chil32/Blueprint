import { validateConnection } from "./utility.js";
import { encryptString } from "./utility.js";
import { connection } from "./connection.js";
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
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE id = ?;`, [id]);
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
    await registerWordpress(user, loginHash, email);
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
    registerWordpress(user, loginHash, email);
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
    return result;
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
 * Output: object - The result of the query.
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
