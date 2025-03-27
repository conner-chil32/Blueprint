/**
 * Provides methods for manipulating cookies.
 */
class CookieController {
    constructor() {
    }

    /**
     * Give a user a cookie and data.
     * @param {cookie-parser} res 
     * @param {cookie-parser} name 
     * @param {cookie-parser} value 
     * @param {cookie-parser} options 
     */
    setCookie(res, name, value, options = {}) {
        options =  {
            // Settings for the cookie
        };
        res.cookie(name, value, options);
        console.log("Cookie made: " + name + ", " + value);
    }

    /**
     * Delete a cookie from a user's web browser.
     * @param {cookie-parser} res 
     * @param {cookie-parser} name 
     */
    deleteCookie(res, name) {
        res.clearCookie(name);
        console.log('Cookie ' + name + ' deleted.');
    }

    /**
     * Checks if the user has a cookie, returns true if so, false otherwise.
     * @param {cookie-parser} req 
     * @param {cookie-parser} name 
     * @returns 
     */
    hasCookie(req) {
        if (req.cookies !== undefined) {
            return true;
        }
        return false;
    }

    /**
     * Returns a user's cookie.
     * @param {cookie-parser} req 
     * @param {cookie-parser} name 
     * @returns 
     */
    getCookie(req, name) {
        return req.cookies[name];
    }
}

module.exports = CookieController;