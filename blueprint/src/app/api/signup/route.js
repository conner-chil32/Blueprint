import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone } from '@lib/userQueries';
import { openConnection, closeConnection, connection } from '@lib/connection'; 
import { validateConnection } from '@lib/utility';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  try {
    const { username, password, email, phone } = await request.json();

    let valid = await validateConnection(connection);

    if (!valid) {
      return NextResponse.json(//error thrown if no db/connection
        { success: false, error: "No DB connection" },
        { status: 500 }
      );
    }

    let result;
    if (phone) {//insert account into database with or without phone #
      result = await createAccountWithPhone(username, password, email, connection, phone);
    } else {
      result = await createAccount(username, password, email, connection);
    }

    return NextResponse.json({ success: true, result });//return if successful
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });//return if failed
  }
}
