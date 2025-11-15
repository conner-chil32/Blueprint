import { NextResponse } from 'next/server';
import { setCookie } from '../CookieController';
import { getCookie } from '../CookieController';

/** Chris Parsons
 * If the user doesn't have a cookie, set their cookie status to 'LoggedIn'.
 * If the user has a cookie, set it to 'LoggedAgain'.
 * @param {NextResponse} req 
 * @returns 
 */
export async function GET(req) {

        const { user } = await request.json(); //get the user id to set a cookie to

    // Create a response and set a cookie
    const res = NextResponse.json({ message: 'Cookie has been set!' });
    
    if (!req.cookies.has('TempCookie')) {
      setCookie(res, 'TempCookie', 'LoggedIn');
      setCookie(res, 'UserCookie', `${user}`); //set the users id to the cookie for further requests
    } else {
      setCookie(res, 'TempCookie', 'LoggedAgain');
      //until a time limit is set for UserCookie, no need to 
    }
  
    // For testing
    //console.log('======= Cookie set: ' + res.cookies.get('TempCookie').name + ', ' + res.cookies.get('TempCookie').value);

    return res;
  }