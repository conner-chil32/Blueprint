import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';
import { loginUser, loginWordpress, User, setLoginCookie} from '@lib/user';
import { getCookie, setCookie } from '../CookieController';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  try {
    const res = NextResponse.json({ success: true }, { status: 302 }); //prepared successful response
    const { username, password } = await request.json();

    await validateConnection(); //if connection is not valid, catch is executed

    const user = await loginUser(username,password); //check if the password matches the user in database

    switch (getCookie(request, 'TempCookie')) {
      case 'LoggedAgain':
        break;
      case 'LoggedIn':
        setCookie(res, 'TempCookie', 'LoggedAgain');
        break;
      default: //if there exists 
        setCookie(res, 'TempCookie', 'LoggedIn');
        setCookie(res, 'UserCookie', user);
        break;
    } 
    
    //user is assumed to have logged in successfully
     //set user cookie to id of user

    // loginWordpress(request, username, password);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.error }, { status: 401 });//return if failed
  }
}