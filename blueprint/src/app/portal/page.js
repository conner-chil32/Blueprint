"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function PortalPage() {
  const [userId, setUserId] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read cookie on client
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("UserCookie="));

    const value = cookie ? cookie.split("=")[1] : null;
    setUserId(value);

    if (value) {
      loadUserWebsites(value);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch websites for this user
  async function loadUserWebsites(userId) {
    try {
      const res = await fetch(`/api/websites/by-user?id=${userId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setWebsites(data);
      } else {
        setWebsites([]);
      }
    } catch (err) {
      console.error("Failed to load websites:", err);
      setWebsites([]);
    }
    setLoading(false);
  }

  return (
    <div className={styles.portalContainer}>
      {/* Top bar */}
      <div className={styles.userBar}>
        <span>
          {userId ? (
            <>Logged in as: <strong>User #{userId}</strong></>
          ) : (
            <>Not logged in</>
          )}
        </span>

        {userId && (
          <button
            className={styles.logOutButton}
            onClick={() => {
              document.cookie =
                "UserCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.reload();
            }}
          >
            Log Out
          </button>
        )}
      </div>

      <h1 className={styles.largeTitleText}>Your Projects</h1>
      <h2 className={styles.mediumTitleText}>
        Manage the websites you have created.
      </h2>

      {loading && <p style={{ color: "#ccc" }}>Loading...</p>}

      {/* Dashboard Grid */}
      {!loading && (
        <div className={styles.gridContainer}>
          {websites.length === 0 && (
            <div className={styles.emptyWrapper}>
              <p className={styles.emptyState}>
                You don’t have any saved websites yet.
              </p>
            </div>
          )}

          {websites.map((website) => {
            const siteId = website.id;
            const siteName = website.site_name || `Website #${siteId}`;
            const domain = website.domain || "Not published";
            const updated = website.updated_at
              ? new Date(website.updated_at).toLocaleDateString()
              : "Unknown";

            return (
              <div key={siteId} className={styles.siteCard}>
                <div className={styles.thumbnail}>Preview not available</div>

                <h3 className={styles.siteTitle}>{siteName}</h3>

                <p className={styles.siteMeta}>
                  <strong>Domain:</strong> {domain}
                </p>

                <p className={styles.siteMeta}>
                  <strong>Last updated:</strong> {updated}
                </p>

                <div className={styles.buttonRow}>
                  <Link
                    href={`/api/website?site_id=${siteId}`}
                    className={styles.actionButton}
                  >
                    View Live
                  </Link>

                  <Link
                    href={`/canvas?site=${siteId}`}
                    className={styles.actionButton}
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/portal/${siteId}`}
                    className={styles.detailsButton}
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.createButtonContainer}>
        <Link href="/canvas">
          <button className={styles.createButton}>Create Website</button>
        </Link>
      </div>
    </div>
  );
}
