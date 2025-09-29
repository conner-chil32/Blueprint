import { validateConnection } from "./db.js";
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
 */
export async function createAccount(user, password, email) {
    if (!await validateConnection()) return false;
    const passwordHash = await encryptString(password);
    const loginHash = await encryptString(user+passwordHash);
    const [result] = await connection.query(`INSERT INTO userAccounts (userName, userPassHash, userEmail, userWpName, userWpPassHash) VALUES (?, ?, ?, ?, ?)`, [user, passwordHash, email, user, loginHash]);
    registerWordpress(user, loginHash);
    return result;
}

/**
 * createAccountWithPhone - Creates a user with all required information and its optional phone number.
 * Input: user - The username of the user to create, password - password of user, emaile - email of user, connection - connection to DB, phone - the phone number of the user. 
 * Output: boolean - true if the account was created successfully, false otherwise.
 * Date: 09/11/2025
 * Author: Elijah White
 * Dependencies: mysql
 */
export async function createAccountWithPhone(user, password, email, phone) {
    if (!await validateConnection()) return false;
    const passwordHash = await encryptString(password);
    const loginHash = await encryptString(user+passwordHash);
    const [result] = await connection.query(`INSERT INTO userAccounts (userName, userPassHash, userEmail, userPhone, userWpName, userWpPassHash) VALUES (?, ?, ?, ?, ?, ?)`, [user, passwordHash, email, phone, user, loginHash]);
    registerWordpress(user, loginHash);
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