"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from "../components/navbar";
import styles from "./page.module.css";

export default function PortalPage() {

    useEffect(() => {
        // Fetch websites from API route instead of direct database access
        fetch(`/api/sites?userId=${userId}`)
            .then(res => res.json())
            .then(data => setWebsites(data.sites || []))
            .catch(error => {
                console.error("Failed to fetch websites:", error);
            });
    }, [userId]);

      {/* Top bar */}
      <div className={styles.userBar}>
        <span>Welcome to your Portal</span>
      </div>

            <div id="websites">
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th rowSpan="3" align="center" className={styles.tableHeader}>Website Preview image</th>
                                <td className={styles.tableData}>Statistics</td>
                                <td className={styles.tableData}>
                                    <Link href="/canvas">
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
                                    <Link href="/admin-account-view">
                                        <button className={styles.linkButton}>
                                            Website Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {/* Button to create website */}
      <div className={styles.createButtonContainer}>
        <Link href="/canvas">
          <button className={styles.createButton}>Create Website</button>
        </Link>
      </div>
      
    </div>
  );
}
