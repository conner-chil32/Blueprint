import { createSite } from "@lib/siteQueries";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Handles POST requests to create a new website.
 * This is triggered by the "Create New Website" button.
 */
export async function POST(request) {
    
    // TODO: Get the real user ID from a session or cookie
    // For now, we'll use the same placeholder '1'
    const userId = 1;

    // Create a default name for the new site
    const siteName = "My New Website";

    try {
        // Create the new site in the database
        await createSite(siteName, userId);

    } catch (error) {
        console.error("Failed to create site:", error);
        // If it fails, just redirect back to the portal with an error
        return redirect('/portal?error=create_failed');
    }

    // On success, redirect the user to the canvas page
    // The 'redirect' function automatically handles this as a 307 redirect
    redirect('/canvas');
}