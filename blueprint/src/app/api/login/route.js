import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';
import { encryptData, loginWordpress } from '@lib/user';
import { User } from '@lib/user';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  try {
    const { username, password } = await request.json();

    let valid = await validateConnection(connection);

    if (!valid) {
      return NextResponse.json(//error thrown if no db/connection
        { success: false, error: "No DB connection" },
        { status: 500 }
      );
    }

    let result = await encryptData(username,password);
    // loginWordpress(username, password);
    return NextResponse.json({ success: true, result });//return if successful
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });//return if failed
  }
}