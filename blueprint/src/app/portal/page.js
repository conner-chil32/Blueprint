"use client";

import { useEffect, useState } from 'react';
import { getSitesByUser } from "../../../lib/siteQueries";
import Navbar from "../components/navbar";
import styles from "./page.module.css";

export default function PortalPage() {
    const [websites, setWebsites] = useState([]);
    const userId = 1; // TODO: Get from session/cookie

    useEffect(() => {
        getSitesByUser(userId)
            .then(sites => setWebsites(sites))
            .catch(error => {
                console.error("Failed to fetch websites:", error);
            });
    }, [userId]);

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