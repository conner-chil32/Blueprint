import { NextResponse } from 'next/server'

// Middleware to enforce lowercase URLs in Next.js
// Removes case-sensitivity from URLs entered by users
export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Convert URL to lowercase if needed
    if (pathname !== pathname.toLowerCase()) {
        return NextResponse.redirect(new URL(pathname.toLowerCase(), request.url));
    }

    return NextResponse.next();
}

// returns URL for the matching page
export const config = {
    matcher: '/:path*',
}