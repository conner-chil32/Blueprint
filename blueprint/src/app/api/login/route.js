import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';
import { loginUser, loginWordpress } from '@lib/user';
import { User } from '@lib/user';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  try {
    const { username, password } = await request.json();

    await validateConnection(); //if connection is not valid, catch is executed

    const user = await loginUser(username,password); //check if the password matches the user in database

    //user is assumed to have logged in successfully
    await fetch(`/api/setcookie?user=${user}`); //set user cookie to id of user

    //loginWordpress(username, password);
    return NextResponse.json({ success: true }, { status: 302 });//return if successful
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.error }, { status: 401 });//return if failed
  }
}