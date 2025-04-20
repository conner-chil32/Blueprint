/**
 * Registers all routes for the app
 * @param {Express} app - The express app to register the routes on
 */

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');

// Import the CookieController
const CookieController = require('./CookieController.js');
const cookieController = new CookieController();

function registerRoutes(app) {
    app.use(cookieParser());

    // Tell 'path' to use both of the Spot files
    app.use('/src/SpotFront.js', express.static(path.join(__dirname, 'SpotFront.js')));
    app.use('/src/SpotBack.js', express.static(path.join(__dirname, 'SpotBack.js')));
    app.use(express.json()); // For parsing application/json

    //TODO: SCRUM-47'S tasks for routing will mainly be implemented here

    //  !!!     ROUTES     !!!
    app.get('/', (req, res) => {
        const tempCookie = cookieController.getCookie(req, 'TempCookie');
        console.log('tempCookie = ' + tempCookie);

        if (tempCookie === 'loggedIn') {
            // If the user is logged in, send them to the user portal.
            console.log('GET /FTU-Main sending ./res/FTU-Main.html');
            res.sendFile('./view/FTU-Main.html', { root: __dirname });
            
        } else if (tempCookie === 'loggedAgain') {
            // If the user has logged in before (TEMP LOGIC), send them to ProjectView;
            console.log('GET /portal sending ./res/user_portal.html');
            res.sendFile('./view/user_portal.html', { root: __dirname });

        } else {
            // Otherwise, send them to the features page
            console.log('GET /features sending ./res/features.html');
            res.sendFile('./view/features.html', { root: __dirname });
        }
    });

    // Project View
    app.get('/ProjectView', (req, res) => {
        console.log('GET /ProjectView sending ./res/ProjectView.html');
        res.sendFile('./view/ProjectView.html', { root: __dirname });
    });

    // User Website Backend, shows statistics on their site
    app.get('/UserWebBackend', (req, res) => {
        console.log('GET /UserWebBackend sending ./res/UserWebBackend.html');
        res.sendFile('./view/UserWebBackend.html', { root: __dirname });
    });

    // Acount Creation Page
    app.get('/Account-Creation', (req, res) => {
        console.log('GET /Account-Creation sending ./res/Account-Creation.html');
        res.sendFile('./view/Account-Creation.html', { root: __dirname });
    });
  
    // Account Recovery backend
    app.get('/Account-Recovery', (req, res) => {
        console.log('GET /Account-Recovery sending ./res/Account-Recovery.html');
        res.sendFile('./view/Account-Recovery.html', { root: __dirname });
    });
    // Admin Page backend
    app.get('/Admin-Page', (req, res) => {
        console.log('GET /Admin-Page sending ./res/Admin-Page.html');
        res.sendFile('./view/Admin-Page.html', { root: __dirname });
    });

    // Login Page
    app.get('/login', (req, res) => {
        console.log('GET /login sending ./res/login.html');
        res.sendFile('./view/Login.html', { root: __dirname });
    });
  
    // Pricing page
    app.get('/Pricing', (req, res) => {
        console.log('GET /Pricing sending ./res/Pricing.html');
        res.sendFile('./view/Pricing.html', { root: __dirname });
    });

    // Features page
    app.get('/features', (req, res) => {
        console.log('GET /features sending ./res/features.html');
        res.sendFile('./view/features.html', { root: __dirname });
    });

    app.get('/portal', (req, res) => {
        console.log('GET /portal sending ./res/user_portal.html');
        res.sendFile('./view/user_portal.html', { root: __dirname });
    });

    app.get('/canvas', (req, res) => {
        console.log('GET /canvas sending ./res/canvas.html');
        res.sendFile('./view/canvas.html', { root: __dirname });
    });


    //First time user (FTU) page
    app.get('/FTU-main', (req, res) => {
        console.log('GET /FTU-Main sending ./res/FTU-Main.html');
        res.sendFile('./view/FTU-Main.html', { root: __dirname });
    });

    // Cookies (TEMP)
    app.get('/loggingIn', (req, res) => {
        if (cookieController.getCookie(req, 'TempCookie') === 'loggedIn') {
            // If they have logged in before, set cookie to 'loggedAgain'
            cookieController.setCookie(res, 'TempCookie', 'loggedAgain');
            res.send('Cookie value sent: ' + 'loggedAgain');

        } else {
            // Otherwise, set them to logged in
            cookieController.setCookie(res, 'TempCookie', 'loggedIn');
            res.send('Cookie value sent: ' + 'loggedIn');
        }
    });

    app.get('/deleteCookie', (req, res) => {
        cookieController.deleteCookie(res, 'TempCookie');
        res.send('Cookie deleted.');
    });

    // Add this near the top of your registerRoutes function
    app.use(express.json()); // For parsing application/json

    // Add this with your other routes
    app.post('/api/create-account', async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body;
        
        // Log the username
        console.log('Username:', username);
        
        // Hash the password
        const salt = await bcrypt.genSalt(13);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Log the hashed password
        console.log('Hashed password:', hashedPassword);
        
        // Here you would typically save the user to a database
        // For now, we're just logging the information
        
        res.json({ success: true, message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
    });

    // Do this last; otherwise it will cause issues with Javascript files.
    app.use(express.static(path.join(__dirname, 'view')));
}

module.exports = {
    registerRoutes
};