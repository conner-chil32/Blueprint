// Imports required modules
const express = require('express');
const bcrypt = require('bcrypt'); 
const cookieParser = require('cookie-parser');

//  !!!     ENTRY POINT FOR THE APPLICATION     !!!
async function index() {

    //holds all actions for the server
    const app = express();

    // Apply the cookie parser to the app
    app.use(cookieParser());
    
    //contains the routes for our web server
    const routes = require('./routes');

    //registers all neccessary routes
    routes.registerRoutes(app);

    //starts the server
    constructServer(app);

    /** EXAMPLE OF PASSWORD SALT + HASHING USING BCRYPT
    const password = 'password1';
    try {
        // Will hash password 2^13 times, the higher the number, the slower and safer it is.
        const salt = bcrypt.genSaltSync(13);
        const hash = await bcrypt.hash(password, salt);  // Hashes the password with salt
        // Checks if plain-text password matches with the hashed password, returns true or false.
        const isMatch = await bcrypt.compare(password, hash);

        // Prints password, salt, hashed password, and if the plain text password matches with the hashed password
        console.log({
            password,
            salt,
            hash,
            isMatch
        });
    } catch (error) {
        console.error('Error hashing password:', error);
    }
    */
}

/**
 * Constructs the server
 * @param {Express} app - The express app to register the routes
 * @return {[boolean]} returns true if ended gracefully
 * 
 * Developer Note (Lydell): 
 *  This function is a placeholder to just get things running,
 *  Remember that we need to keep things modular when we truly start 
 *  developing.
 */
function constructServer(app) {
    // Retrieves the port from the environment variable PORT or defaults to 4000
    const port = process.env.PORT || 4000;

    // Starts the server
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
        console.log(`http://localhost:${port}`);
    });

    return true;
}

/** Dev Note (Angel)
 * .catch(console.error); ensures that any unhandled errors in index() are properly logged. 
 * Without it, unhandled promise rejections could crash the program or go unnoticed. 
 * You can replace console.error with custom error handling to improve debugging and error recovery.
 */

// Starts the application
index().catch(console.error);
