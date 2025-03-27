/**
 * Registers all routes for the app
 * @param {Express} app - The express app to register the routes on
 */

const express = require('express');
const path = require('path');

function registerRoutes(app) {
    app.use(express.static(path.join(__dirname, 'view')));

    // Tell 'path' to use both of the Spot files
    app.use('/src/SpotFront.js', express.static(path.join(__dirname, 'SpotFront.js')));
    app.use('/src/SpotBack.js', express.static(path.join(__dirname, 'SpotBack.js')));

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
    app.get('/Features', (req, res) => {
        console.log('GET /Features sending ./res/features.html');
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
}

module.exports = {
    registerRoutes
};