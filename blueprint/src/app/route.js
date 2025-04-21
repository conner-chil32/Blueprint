import { NextResponse } from 'next/server';
import { getCookie } from './api/CookieController';
import { hasCookie } from './api/CookieController';

/** Chris Parsons
 * Going to '/' sends you to the features page.
 * Going to '/setCookie' assigns you a 'LoggedIn' status.
 * Then returning to '/' returns you to the FTU Main page.
 * Going back to '/setCookie' assigns you to the 'LoggedAgain' status.
 * Then '/' leads you to the portal page.
 * @param {NextResponse} req 
 * @returns 
 */
export async function GET(req) {
    const cookieValue = getCookie(req, 'TempCookie');

    // For testing
    //console.log('Cookie value: ' + cookieValue);

    if (cookieValue === 'LoggedIn') {
        return NextResponse.redirect(new URL('/ftu-main', req.url));

    } else if (cookieValue === 'LoggedAgain') {
        return NextResponse.redirect(new URL('/portal', req.url));

    } else {
        return NextResponse.redirect(new URL('/features', req.url));
    }
}