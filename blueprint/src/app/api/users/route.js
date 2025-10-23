import { getAllUsers } from '@lib/userQueries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const userList = await getAllUsers();

      if (!userList) {
      return NextResponse.json(//error thrown if no db/connection
        { success: false, error: "No DB connection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userList });//return if successful
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}