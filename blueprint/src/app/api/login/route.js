import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone, getUserByUsername } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';
import { encryptData, loginWordpress } from '@lib/user';
import { User } from '@lib/user';
import bcrypt from 'bcryptjs';

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
    if (!result) {
      return NextResponse.json({ success: false, error: "Invalid login credentials." }, { status: 401 });
    }

    // Get a "user" object
    const rows = await getUserByUsername(username);
    const user = Array.isArray(rows) ? rows[0] : rows;

    // Construct the hash
    const hash = `${user.userName}${user.userPassHash}`;
    const passWPCompare = await bcrypt.compare(hash, user.userWpPassHash);
    if (!passWPCompare) {
      return NextResponse.json({ success: false, error: "[WP] Key mismatch." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, result: true });

    // Create a WP cookie
    response.cookies.set('wpSessionKey', user.userWpPassHash, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return response;

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });//return if failed
  }
}