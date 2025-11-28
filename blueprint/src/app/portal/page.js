"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function PortalPage() {

  return (
    <div className={styles.portalContainer}>

      {/* Top bar */}
      <div className={styles.userBar}>
        <span>Welcome to your Portal</span>
      </div>

      <h1 className={styles.largeTitleText}>Your Projects</h1>
      <h2 className={styles.mediumTitleText}>
        Manage the websites you create.
      </h2>

      {/* Empty state since we aren’t loading anything */}
      <div className={styles.gridContainer}>
        <div className={styles.emptyWrapper}>
          <p className={styles.emptyState}>
            You don’t have any websites yet.
          </p>
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
