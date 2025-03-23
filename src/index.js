
//  !!!     ENTRY POINT FOR THE APPLICATION     !!!
function index() {

    //imports the express module
    const express = require('express');

    //holds all actions for the server
    const app = express();
    
    //contains the routes for our web server
    const routes = require('./routes');

    //registers all neccessary routes
    routes.registerRoutes(app);

    //starts the server
    constructServer(app);
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
    
    //retrieves the port from the environment variable PORT or defaults to 4000
    const port = process.env.PORT ? process.env.PORT : 4000;


    //starts the server
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
        console.log(`http://localhost:${port}`);
    });

    return true;
}

//starts the application
index();