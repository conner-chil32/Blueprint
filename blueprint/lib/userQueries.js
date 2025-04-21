import { validateConnection } from "./db.js";

/**
 * getUserByEmail - Retrieves a user by their email address.
 * Input: email - The email address of the user to retrieve.
 * Output: object - The user with the specified email address.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql2
 */
export async function getUserByEmail(email, connection) {
    if (!await validateConnection(connection)) return false;
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
    if (!await validateConnection(connection)) return false;
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
export async function signIn(user, password, connection) {
    if (!await validateConnection()) return false;
    const [result] = await connection.query(`SELECT * FROM userAccounts WHERE userName = ? AND userPassHash = ?`, [user, password]);
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
export async function createAccount(user, password, email, connection) {
    if (!await validateConnection(connection)) return false;
    const [result] = await connection.query(`INSERT INTO userAccounts (userName, userPassHash, userEmail) VALUES (?, ?, ?)`, [user, password, email]);
    return result;
}
