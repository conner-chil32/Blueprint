import { NextResponse } from 'next/server';
// We need 'jsonwebtoken' to validate the token
import jwt from 'jsonwebtoken';

import { updateUserPassword } from '@lib/userQueries';
import { encryptString } from '@lib/utility'; // From your utility.js file

/**
 * Handles POST requests to update a user's password.
 * Expects 'token' and 'password' in the JSON body.
 */

export async function POST(request) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("FATAL: JWT_SECRET is not set.");
        return new NextResponse(
            JSON.stringify({ error: "Server configuration error." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // 1. Read the JSON body from the request
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return new NextResponse(
                JSON.stringify({ error: "Token and new password are required." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. Verify the JWT
        let payload;
        try {
            payload = jwt.verify(token, jwtSecret);
        } catch (err) {
            // This will catch expired or invalid tokens
            return new NextResponse(
                JSON.stringify({ error: "Invalid or expired recovery token. Please try again." }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 3. Token is valid, get the userId from it
        const userId = payload.userId;
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid token payload." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 4. Hash the new password
        // We use encryptString from your utility.js
        const passwordHash = await encryptString(password);

        // 5. Update the password in the database
        // We will add this 'updateUserPassword' function to userQueries.js next
        const result = await updateUserPassword(userId, passwordHash);

        if (!result || result.affectedRows === 0) {
            throw new Error("Failed to update password in database.");
        }

        // 6. Success
        return new NextResponse(
            JSON.stringify({ message: "Password updated successfully." }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Update password error:", error);
        return new NextResponse(
            JSON.stringify({ error: "An internal server error occurred." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}