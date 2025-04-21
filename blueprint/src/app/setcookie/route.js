import { NextResponse } from 'next/server';
import { setCookie } from '../api/CookieController';
import { getCookie } from '../api/CookieController';

/** Chris Parsons
 * If the user doesn't have a cookie, set their cookie status to 'LoggedIn'.
 * If the user has a cookie, set it to 'LoggedAgain'.
 * @param {NextResponse} req 
 * @returns 
 */
export async function GET(req) {
    // Create a response and set a cookie
    const res = NextResponse.json({ message: 'Cookie has been set!' });
    
    if (!req.cookies.has('TempCookie')) {
      setCookie(res, 'TempCookie', 'LoggedIn');
    } else {
      setCookie(res, 'TempCookie', 'LoggedAgain');
    }
  
    // For testing
    //console.log('======= Cookie set: ' + res.cookies.get('TempCookie').name + ', ' + res.cookies.get('TempCookie').value);

    return res;
  }