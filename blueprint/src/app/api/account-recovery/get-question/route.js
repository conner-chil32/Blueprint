import { NextResponse } from 'next/server';
// Adjust this import path as necessary to reach your lib folder
import { getUserByEmail } from '@lib/userQueries';

/**
 * Handles GET requests to fetch a user's security question.
 * Expects 'email' as a URL search parameter.
 */
export async function GET(request) {
    try {
        // 1. Get the email from the URL (e.g., ...?email=user@example.com)
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return new NextResponse(
                JSON.stringify({ error: "Email is required." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. Fetch the user from the database
        const userResult = await getUserByEmail(email);

        // 3. Check if user exists and has a question
        if (userResult && userResult.length > 0) {
            const user = userResult[0]; // Get the first user
            const question = user.userQuestion; // From userQueries.js 

            if (question) {
                // 4. Success: Send the question back as JSON
                return new NextResponse(
                    JSON.stringify({ question: question }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            } else {
                // User exists but has no question set
                return new NextResponse(
                    JSON.stringify({ error: "Account has no security question set." }),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }
        } else {
            // User not found
            return new NextResponse(
                JSON.stringify({ error: "User not found." }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        console.error("Get security question error:", error);
        return new NextResponse(
            JSON.stringify({ error: "An internal server error occurred." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}