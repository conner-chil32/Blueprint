
/**
 * Registers all routes for the app
 * @param {Express} app - The express app to register the routes on
 */

const express = require('express');
const path = require('path');

function registerRoutes(app) {
    app.use(express.static(path.join(__dirname, 'view')));

    //TODO: SCRUM-47'S tasks for routing will mainly be implemented here

    //  !!!     ROUTES     !!!
    app.get('/', (req, res) => {
        console.log('GET / sending ./res/index.html');
        res.sendFile('./view/index.html', { root: __dirname });
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


    // Account Recovery backend
    app.get('/Account-Recovery', (req, res) => {
        console.log('GET /Account-Recovery sending ./res/Account-Recovery.html');
        res.sendFile('./view/Account-Recovery.html', { root: __dirname });

    // Admin Page backend
    app.get('/Admin-Page', (req, res) => {
        console.log('GET /Admin-Page sending ./res/Admin-Page.html');
        res.sendFile('./view/Admin-Page.html', { root: __dirname });
    });

    app.get('/login', (req, res) => {
        console.log('GET /login sending ./res/login.html');
        res.sendFile('./view/Login.html', { root: __dirname });
    });

}

module.exports = {
    registerRoutes
};