import { NextResponse } from 'next/server';
import { deleteCookie } from '../api/CookieController';

/** Chris Parsons
 * Deletes the cookie (if there is one) attatched to the web browser.
 * @returns 
 */
export async function GET() {
    const res = NextResponse.json({ message: 'Cookie deleted.'});
    
    if (res !== undefined) {
        deleteCookie(res, 'TempCookie');
        deleteCookie(res, 'UserCookie')
    }

    return res;
}