import { NextResponse } from 'next/server';
import { createAccount, createAccountWithPhone } from '@lib/userQueries';
import { validateConnection } from '@lib/utility';
import { registerWordpress } from '@lib/user';

export async function POST(request) {//Handles sending user form data to database via user queries calls, is called in /signup/page.js
  console.log("%s, %s, %s, %s", process.env.DATABASE_HOST, process.env.DATABASE_USER, process.env.DATABASE_NAME, process.env.DATABASE_PASSWORD)
  
  try {
    const { username, password, email, phone, securityQuestion, securityAnswer} = await request.json();

    let valid = await validateConnection();

    if (!valid) {
      return NextResponse.json(//error thrown if no db/connection
        { success: false, error: "No DB connection" },
        { status: 500 }
      );
    }

    let result;
    if (phone) {//insert account into database with or without phone #
      result = await createAccountWithPhone(username, password, email, phone, securityQuestion, securityAnswer);
    } else {
      result = await createAccount(username, password, email, securityQuestion, securityAnswer);
    }

    

    // User is assumed to have logged in by this point, store Wordpress session key.
    await registerWordpress(username, password);

    return NextResponse.json({ success: true, result });//return if successful
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });//return if failed
  }
}
