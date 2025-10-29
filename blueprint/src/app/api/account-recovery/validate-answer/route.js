import { NextResponse } from 'next/server';
// We need 'jsonwebtoken' to create a secure, temporary token
// Install this: npm install jsonwebtoken
import jwt from 'jsonwebtoken'; 
// Adjust this import path as necessary to reach your lib folder
import { getUserByEmail } from '../../../../../lib/userQueries';

/**
 * Handles POST requests to validate a user's security answer.
 * Expects 'email' and 'answer' in the form data.
 */
export async function POST(request) {
    
    // Get the JWT secret from environment variables.
    // This MUST be set in your .env.local file (e.g., JWT_SECRET=your_long_random_secret)
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("FATAL: JWT_SECRET is not set in environment variables.");
        return new NextResponse(
            JSON.stringify({ error: "Server configuration error." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // URLs for redirection
    const resetUrl = new URL('/account-recovery/reset', request.url);
    const challengeUrl = new URL('/account-recovery/challenge', request.url);

    try {
        // 1. Get the form data
        const formData = await request.formData();
        const email = formData.get('email');
        const answer = formData.get('answer');

        if (!email || !answer) {
            return new NextResponse(
                JSON.stringify({ error: "Email and answer are required." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. Fetch the user from the database
        const userResult = await getUserByEmail(email);

        if (userResult && userResult.length > 0) {
            const user = userResult[0];

            // 3. Compare the submitted answer with the one in the database
            // If it's hashed, this check will need to be changed.
            if (user.userAnswer === answer) {
                // 4. Success! Generate a short-lived JSON Web Token (JWT)
                // This token proves the user completed the challenge.
                const token = jwt.sign(
                    { userId: user.userID, email: user.userEmail }, // Payload
                    jwtSecret, // Your secret key
                    { expiresIn: '15m' } // Token expires in 15 minutes
                );

                // 5. Redirect to the final reset page with the token
                resetUrl.searchParams.set('token', token);
                return NextResponse.redirect(resetUrl, 303);

            } else {
                // 6. Invalid answer
                challengeUrl.searchParams.set('email', email);
                challengeUrl.searchParams.set('error', 'invalid_answer');
                return NextResponse.redirect(challengeUrl, 303);
            }

        } else {
            // User not found (shouldn't happen if they came from the previous page)
            challengeUrl.searchParams.set('error', 'user_not_found');
            return NextResponse.redirect(challengeUrl, 303);
        }

    } catch (error) {
        console.error("Validate answer error:", error);
        challengeUrl.searchParams.set('error', 'server_error');
        return NextResponse.redirect(challengeUrl, 303);
    }
}