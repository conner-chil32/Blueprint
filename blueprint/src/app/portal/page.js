import Link from "next/link";
import { getSitesByUser } from "../../../lib/siteQueries";
import styles from "./page.module.css";

/**
 * PortalPage
 * ----------
 * Server component that loads all websites for the current user
 * and displays them in a simple dashboard-style portal.
 */
export default async function PortalPage() {
  // TODO: Replace with real session / auth lookup
  const userId = 1;

  let websites = [];
  try {
    websites = await getSitesByUser(userId);
  } catch (error) {
    console.error("Failed to fetch websites:", error);
    // Page still renders; we'll show an empty state
  }

  return (
    <div className={styles.portalContainer}>
      {/* Top right: logged-in bar */}
      <div className={styles.userBar}>
        <span>
          Logged in as: <strong>User #{userId}</strong>
        </span>
        <button className={styles.logOutButton}>Log Out</button>
      </div>

      {/* Titles */}
      <h1 className={styles.largeTitleText}>Your Website Portal</h1>
      <h2 className={styles.mediumTitleText}>
        Manage and view the sites you’ve created.
      </h2>

      {/* Website list */}
      <div className={styles.websiteList}>
        {(!websites || websites.length === 0) && (
          <p className={styles.emptyState}>
            You don’t have any websites yet. Click{" "}
            <span className={styles.emptyHighlight}>Create Website</span> to
            start building your first one.
          </p>
        )}

        {websites?.map((website) => {
          // Try to be flexible with field names from the DB
          const siteId = website.site_id ?? website.id;
          const siteName =
            website.site_name ?? website.name ?? `Website #${siteId}`;
          const status = website.status ?? "Draft";
          const domain = website.domain ?? website.url ?? "Not published";
          const lastUpdatedRaw =
            website.updated_at ?? website.last_modified ?? website.created_at;
          const lastUpdated = lastUpdatedRaw
            ? new Date(lastUpdatedRaw).toLocaleDateString()
            : "Unknown";

          return (
            <div className={styles.websiteCard} key={siteId}>
              {/* Preview / thumbnail area */}
              <div className={styles.websitePreview}>
                {/* Later: replace with real <Image /> when you have screenshots */}
                Preview not available
              </div>

              {/* Info column */}
              <div className={styles.websiteInfo}>
                <h3>{siteName}</h3>
                <p>
                  <strong>Status:</strong> {status}
                </p>
                <p>
                  <strong>Domain:</strong> {domain}
                </p>
                <p>
                  <strong>Last updated:</strong> {lastUpdated}
                </p>
              </div>

              {/* Actions column */}
              <div className={styles.websiteActions}>
                {siteId && (
                  <>
                    <Link
                      href={`/api/website?site_id=${siteId}`}
                      className={styles.actionButton}
                    >
                      View Live Site
                    </Link>

                    <Link
                      href={`/userwebbackend?site_id=${siteId}`}
                      className={styles.actionButton}
                    >
                      Website Backend
                    </Link>

                    <Link
                      href={`/portal/${siteId}`}
                      className={styles.accountViewButton}
                    >
                      View Details
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider + Create button */}
      <div className={styles.createButtonContainer}>
        <Link href="/canvas">
          <button className={styles.createButton}>Create Website</button>
        </Link>
      </div>
    </div>
  );
}
