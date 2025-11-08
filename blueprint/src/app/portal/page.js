import { getSitesByUser } from "@lib/siteQueries";
import Navbar from "../components/navbar";  
import styles from "./page.module.css";
import Link from "next/link"

export default function RawHTMLPage() {

    return (
        <div>
			<Navbar /> 
            <div id="welcome">
                <h1 className={styles.largeTitleText}>Welcome</h1> 
                <h2 className={styles.mediumTitleText}>Your Websites</h2> 
            </div>
            
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
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.tableData}>Description</td>
                                <td className={styles.tableData}>
                                    <Link href="./admin-account-view">{/*Page not present at time of writing*/}
									<button className={styles.linkButton}>
                                            Website Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                        }
                    </table>
                </div>
            </div>
        </div>
    );
}