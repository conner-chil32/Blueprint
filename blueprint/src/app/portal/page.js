import Navbar from "../components/navbar";  
import styles from "./page.module.css";
// We need the `getSitesByUser` function to fetch the websites
import { getSitesByUser } from "@lib/siteQueries"; 

/**
 * This is now an async Server Component.
 * It will fetch data on the server before rendering the page.
 */
export default async function PortalPage() {
    
    // TODO: Get the real user ID from a session or cookie
    // For now, we'll use a placeholder '1'
    const userId = 1; 

    // Fetch the user's websites using the function from siteQueries.js
    let websites = [];
    try {
        // We use `getSitesByUser` as required by the task
        websites = await getSitesByUser(userId);
    } catch (error) {
        console.error("Failed to fetch websites:", error);
        // Don't crash the page; just show an empty list
    }

    return (
        <div>
            {/* The Navbar floats on top, so we add padding to the content below */}
            <Navbar /> 
            
            {/* This new div wrapper pushes all content down by 70px to fix the overlap */}
            <div style={{ paddingTop: '70px' }}>
            
                {/* 1. "Logged in as" / "Log Out" Bar */}
                <div className={styles.userBar}>
                    {/* Per requirements, skip `validateUser` and just put "Logged in" */}
                    <span>Logged in as: User</span>
                    
                    {/* ===== START: ADDED ACCOUNT VIEW BUTTON ===== */}
                    <a href="/account" className={styles.accountViewButton}>
                        Account View
                    </a>
                    {/* ===== END: ADDED ACCOUNT VIEW BUTTON ===== */}

                    {/* Per requirements, link Log Out to /api/logout */}
                    <a href="/api/logout" className={styles.logOutButton}>
                        Log Out
                    </a>
                </div>

                {/* 2. Main Portal Content */}
                <div className={styles.portalContainer}>
                    <div id="welcome">
                        <h1 className={styles.largeTitleText}>Welcome</h1> 
                        <h2 className={styles.mediumTitleText}>Your Websites</h2> 
                    </div>
                    
                    {/* 3. Dynamic Website List */}
                    <div className={styles.websiteList}>
                        {websites.length > 0 ? (
                            websites.map(site => (
                                <div key={site.siteID} className={styles.websiteCard}>
                                    {/* Preview Box */}
                                    <div className={styles.websitePreview}>
                                        Website Preview
                                    </div>
                                    
                                    {/* Info Section */}
                                    <div className={styles.websiteInfo}>
                                        <h3>{site.websiteName}</h3>
                                        <p>Website Status: Live</p>
                                        <p>Description: {site.description || "No description."}</p>
                                    </div>
                                    
                                    {/* Actions Section */}
                                    <div className={styles.websiteActions}>
                                        {/* Per requirements, link to /api/website/<id> */}
                                        <a href={`/api/website/${site.siteID}`} className={styles.actionButton}>
                                            Change Website
                                        </a>

                                        {/* ===== START: ADDED BACKEND/DETAILS BUTTONS ===== */}
                                        <a href="#" className={styles.actionButton}>
                                            Website Backend
                                        </a>
                                        <a href="#" className={styles.actionButton}>
                                            Website Details
                                        </a>
                                        {/* ===== END: ADDED BACKEND/DETAILS BUTTONS ===== */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You don't have any websites yet.</p>
                        )}
                    </div>

                    {/* 4. "Create New Website" Button */}
                    <div className={styles.createButtonContainer}>
                        {/* Per requirements, links to a POST request */}
                        <form action="/api/create-website" method="POST">
                            <button type="submit" className={styles.createButton}>
                                Create New Website
                            </button>
                        </form>
                    </div>
                </div>
            </div> {/* This closes the new paddingTop div */}
        </div>
    );
}