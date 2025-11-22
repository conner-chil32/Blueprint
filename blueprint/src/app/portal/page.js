import { getSitesByUser } from "../../../lib/siteQueries";
import Navbar from "../components/navbar";
import styles from "./page.module.css";

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

            <div id="websites">
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        {

                            <tbody>
                                <tr>
                                    <th rowSpan="3" align="center" className={styles.tableHeader}>Website Preview image</th>
                                    <td className={styles.tableData}>Statistics</td>
                                    <td className={styles.tableData}>
                                        <Link href="/api/website?site_id=1">
                                            <button className={styles.linkButton}>
                                                Website
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.tableData}>Status</td>
                                    <td className={styles.tableData}>
                                        <Link href="/userwebbackend">
                                            <button className={styles.linkButton}>
                                                Website Backend
                                            </button>
                                            <a href="#" className={styles.actionButton}>
                                                Website Details
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        }
                    </table>
                </div>
            </div> {/* This closes the new paddingTop div */}
        </div>
    );
}