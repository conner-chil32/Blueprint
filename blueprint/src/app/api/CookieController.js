import { NextResponse } from 'next/server';

/** Chris Parsons
 * Gives a user a cookie and data.
 * @param {NextResponse} res 
 * @param {NextResponse} name 
 * @param {NextResponse} value 
 */
export function setCookie(res, name, value) {
    res.cookies.set(name, value, {
        // Settings for the cookie
    });
}

/** Chris Parsons
 * Returns the named cookie's value
 * @param {NextResponse} req 
 * @param {NextResponse} name 
 * @returns Cookie value
 */
export function getCookie(req, name) {
    const cookie = req.cookies.get(name);
    if (!cookie) return null;

    return cookie.value;
}

/** Chris Parsons
 * Deletes a cookie from the user's browser.
 * @param {NextResponse} res 
 * @param {NextResponse} name 
 */
export function deleteCookie(res, name) {
    res.cookies.delete(name, { path: '/' });
}

/** Chris Parsons
 * Returns true if a cookie is detected on the user's browser, false otherwise.
 * @param {NextResponse} req 
 * @returns 
 */
export function hasCookie(req) {
    if (req.cookies !== undefined) {
        return true;
    } else {
        return false;
    }
}