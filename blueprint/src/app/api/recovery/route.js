import { NextResponse } from 'next/server';
// Import the function from userQueries.js
import { getUserByEmail } from '@lib/userQueries';

/**
 * Handles the FIRST step of account recovery.
 * Finds a user by email and redirects them to a challenge page (e.g., security question).
 */

export async function POST(request) {
    
    // Define redirect URLs
    const loginUrl = new URL('/login?recovery=success', request.url);
    const challengeUrl = new URL('/account-recovery/challenge', request.url);

    try {
        // 1. Get the form data
        const formData = await request.formData();
        const email = formData.get('email');

        if (!email) {
            return new NextResponse(
                JSON.stringify({ message: "Email is required." }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. Find the user by their email
        // getUserByEmail returns an array of results [cite: 19]
        const userResult = await getUserByEmail(email);

        // 3. Check if the user exists
        if (userResult && userResult.length > 0) {
            // User exists. Redirect them to the challenge page.
            // We pass the email as a query parameter so the next page knows who to load the question for.
            challengeUrl.searchParams.set('email', email);
            return NextResponse.redirect(challengeUrl, 303);

        } else {
            // 4. User NOT found.
            // For security, we DON'T tell the user the email was not found.
            // We still redirect to the "success" page to prevent "user enumeration".
            console.log("Recovery attempt for non-existent email:", email);
            return NextResponse.redirect(loginUrl, 303);
        }

    } catch (error) {
        console.error("Account recovery error:", error);
        // On any server error, just redirect to the generic success page.
        return NextResponse.redirect(loginUrl, 303);
    }
}
