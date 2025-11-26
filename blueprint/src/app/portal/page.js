import Navbar from "../components/navbar";
import styles from "./page.module.css";
import { getSitesByUser } from "@lib/siteQueries";
import { cookies } from "next/headers"; // Import to read cookies
import { redirect } from "next/navigation"; // Import to handle redirects

/**
 * Portal Page (Server Component)
 * - Protects the route: Redirects to /login if no user cookie exists.
 * - Dynamic Data: Fetches websites for the *logged-in* user.
 */
export default async function PortalPage() {
    // 1. Get the cookies from the request
    const cookieStore = cookies();
    
    // 2. Check for the 'UserCookie' your team sets in login/route.js
    const userCookie = cookieStore.get('UserCookie');

    // 3. SECURITY: If the cookie is missing, kick them back to login
    if (!userCookie) {
        redirect('/login');
    }

    // 4. Get the real User ID from the cookie value
    const userId = userCookie.value;

    // 5. Fetch the REAL websites for this user
    let websites = [];
    try {
        websites = await getSitesByUser(userId);
    } catch (error) {
        console.error("Failed to fetch websites:", error);
    }

    return (
        <div>
            <Navbar />
            
            <div style={{ paddingTop: '70px' }}>
                
                {/* User Bar */}
                <div className={styles.userBar}>
                    <span>Logged in as: User #{userId}</span>
                    <a href="/api/logout" className={styles.logOutButton}>
                        Log Out
                    </a>
                </div>

                {/* Main Content */}
                <div className={styles.portalContainer}>
                    <div id="welcome">
                        <h1 className={styles.largeTitleText}>Welcome</h1> 
                        <h2 className={styles.mediumTitleText}>Your Websites</h2> 
                    </div>
                    
                    {/* Dynamic Website List */}
                    <div className={styles.websiteList}>
                        {websites.length > 0 ? (
                            websites.map(site => (
                                <div key={site.siteID} className={styles.websiteCard}>
                                    <div className={styles.websitePreview}>
                                        Website Preview
                                    </div>
                                    <div className={styles.websiteInfo}>
                                        <h3>{site.websiteName}</h3>
                                        <p>Website Status: Live</p>
                                        <p>Description: {site.description || "No description."}</p>
                                    </div>
                                    <div className={styles.websiteActions}>
                                        <a href={`/api/website/${site.siteID}`} className={styles.actionButton}>
                                            Change Website
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You don't have any websites yet.</p>
                        )}
                    </div>

                    {/* Create Button */}
                    <div className={styles.createButtonContainer}>
                        
                        <form action="/api/create-website" method="POST">
                            {/* Pass the userId hidden so the API knows who owns the new site */}
                            <input type="hidden" name="userId" value={userId} />
                            <button type="submit" className={styles.createButton}>
                                Create New Website
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}