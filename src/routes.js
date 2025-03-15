
/**
 * Registers all routes for the app
 * @param {Express} app - The express app to register the routes on
 */
function registerRoutes(app) {

    //TODO: SCRUM-47'S tasks for routing will mainly be implemented here


    //  !!!     ROUTES     !!!
    app.get('/', (req, res) => {
        console.log('GET / sending ./res/index.html');
        res.sendFile('./view/index.html', { root: __dirname });
    });

}

module.exports = {
    registerRoutes
};