import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    const cookieStore = await cookies();
    cookieStore.delete('UserCookie');
    cookieStore.delete('TempCookie');
    return NextResponse.redirect(new URL('/', req.url));
}