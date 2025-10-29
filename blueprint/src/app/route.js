import { NextResponse } from 'next/server';
import { getCookie } from './api/CookieController';
import { hasCookie } from './api/CookieController';
import { getSiteCount } from '@lib/siteQueries';

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
    try {
        const cookieValue = getCookie(req, 'TempCookie');
        const user = getCookie(req, 'UserCookie');
        //I'm sorry I got desperate
        const count = Object.values(await getSiteCount(use
        console.log(count);
        // For testing
        console.log('Cookie value: ' + cookieValue);

        if (cookieValue === 'LoggedIn' || cookieValue === 'LoggedAgain') {
            if (count > 0) {
                return NextResponse.redirect(new URL('/portal', req.url));
            } else {
                return NextResponse.redirect(new URL('/ftu-main', req.url));
            }
        } else {
            return NextResponse.redirect(new URL('/features', req.url));
        }
    }
    catch (err) {
        console.log(err);
        return NextResponse.redirect(new URL('/features', req.url));
    }
        





}