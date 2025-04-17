/**
 * getUserByEmail - Retrieves a user by their email address.
 * Input: email - The email address of the user to retrieve.
 * Output: object - The user with the specified email address.
 * Date: 4/14/2025
 * Author: Lydell Jones
 * Dependencies: mysql2
 */
export async function getUserByEmail(email) {
    if (!validateConnection()) return false;
    query = await global.connection.query(`SELECT * FROM userAccounts WHERE userEmail = ?`, [email]);
    return false;
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
    if (!validateConnection()) return false;
    query = await global.connection.query(`SELECT * FROM userAccounts WHERE id = ?`, [id], (err, results) => {
        if (err) {
            console.error("[DB] Error retrieving user by ID:", err);
            return false;
        } else {
            console.log("[DB] User retrieved successfully.");
            return results[0];
        }
    });
    return false;
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
    if (!validateConnection()) return false;
    query = global.connection.query(`SELECT * FROM userAccounts WHERE userName = ? AND userPassHash = ?`, [user, password], (err, results) => {
        if (err) {
            console.error("[DB] Error signing in user:", err);
            return false;
        } else {
            console.log("[DB] User signed in successfully.");
            return results[0];
        }
    });
    return false;
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
export async function createAccount(user, password) {
    if (!validateConnection()) return false;
    query = global.connection.query(`INSERT INTO userAccounts (userName, userPassHash) VALUES (?, ?)`, [user, password], (err, results) => {
        if (err) {
            console.error("[DB] Error creating account:", err);
            return false;
        } else {
            console.log("[DB] Account created successfully.");
            return results[0];
        }
    });
    return false;
}
