import { NextResponse } from 'next/server';
import { createLoginByUsername, createAccount, createAccountWithPhone, getUserByUsername } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';
import { loginUser, loginWordpress, encryptData } from '@lib/user';
import { getCookie, setCookie } from '../CookieController';

import bcrypt from 'bcrypt';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  try {
    const response = NextResponse.json({ success: true }, { status: 302 }); //prepared successful response
    const { username, password } = await request.json();

    await validateConnection(); //if connection is not valid, catch is executed

    const user_id = await loginUser(username,password); //check if the password matches the user in database

    // Get a "user" object
    const rows = await getUserByUsername(username);
    const user = Array.isArray(rows) ? rows[0] : rows;

    // Construct the hash
    const hash = `${user.userName}${user.userPassHash}`;
    const passWPCompare = await bcrypt.compare(hash, user.userWpPassHash);
    // const response = NextResponse.json({ success: true, result: true });
    
    
    //user is assumed to have logged in successfully
     //set user cookie to id of user

    // loginWordpress(request, username, password);
    let result = await encryptData(username,password);

    if (!result) {
      return NextResponse.json({ success: false, error: "Invalid login credentials." }, { status: 401 });
    }
    
    switch (getCookie(request, 'TempCookie')) { //examine the cookies
      case 'LoggedAgain':
        break;
      case 'LoggedIn':
        setCookie(response, 'TempCookie', 'LoggedAgain');
        break;
      default: //if there exists 
        setCookie(response, 'TempCookie', 'LoggedIn');
        setCookie(response, 'UserCookie', user_id);
        break;
    } 

    const token = await loginWordpress(username, password);

    if (!passWPCompare) {
      return NextResponse.json({ success: false, error: "[WP] Key mismatch." }, { status: 401 });
    }

    // Create a WP cookie
    response.cookies.set('WP_Token', token, {
      // Cookie Settings
    });

    return response;
    

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.error }, { status: 401 });//return if failed
  }
}