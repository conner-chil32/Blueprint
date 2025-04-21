// create the React for userwebbackend, /userwebbackend will point to here

// src/app/UserWebBackend/page.js
'use client'                          

import Link from 'next/link'
import { useState } from 'react'
import styles from './UserWebBackend.module.css'

export default function UserWebBackend() {
  // feature state (for demonstration)
  const [features, setFeatures] = useState({
    mailing: false,
    subscriptions: true,
    storefront: false,
  })

  const toggle = (key) =>
    setFeatures((f) => ({ ...f, [key]: !f[key] }))

  return (
    <div className={styles.wrapper}>
      {/* fixed top-left controls */}
      <Link href="/">
        <button className={styles.backButton}>Back</button>
      </Link>
      <button className={styles.deleteButton}>Delete</button>

      {/* main flex area */}
      <div className={styles.content}>
        {/* sidebar */}
        <aside className={styles.sidebar}>
          {/* FEATURES box */}
          <div className={styles.featuresBox}>
            <h2 className={styles.boxTitle}>Features:</h2>
            <div className={styles.featureItem}>
              <span>Mailing List:</span>
              <input
                type="checkbox"
                checked={features.mailing}
                onChange={() => toggle('mailing')}
              />
            </div>
            <div className={styles.featureItem}>
              <span>Subscriptions:</span>
              <input
                type="checkbox"
                checked={features.subscriptions}
                onChange={() => toggle('subscriptions')}
              />
            </div>
            <div className={styles.featureItem}>
              <span>Storefront:</span>
              <input
                type="checkbox"
                checked={features.storefront}
                onChange={() => toggle('storefront')}
              />
            </div>
          </div>

          {/* CONNECTIONS box */}
          <div className={styles.connectionsBox}>
            <h2 className={styles.boxTitle}>Connections:</h2>
            <button className={styles.connectionButton}>Twitter</button>
            <button className={styles.connectionButton}>Facebook</button>
          </div>
        </aside>

        {/* main panel */}
        <main className={styles.main}>
          <div className={styles.header}>Website 1</div>

          <section className={styles.statsPanel}>
            <h2 className={styles.boxTitle}>Website Stats:</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <img src="/stats1.png" alt="Disk time chart" />
              </div>
              <div className={styles.statItem}>
                <img src="/stats2.png" alt="Ping chart" />
              </div>
              <div className={styles.statItem}>
                <img src="/stats3.png" alt="Disk used chart" />
              </div>
              <div className={styles.statItem}>
                <img src="/stats4.png" alt="Memory usage chart" />
              </div>
            </div>
            <div className={styles.statsFooter}>
              <span>Viewers: XXXX</span>
              <span>Subscribers: XXXX</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}




/*
import styles from './UserWebBackend.module.css';
import Link from 'next/link';
import Navbar from '../components/navbar'; // relative path might need adjusting

export default function UserWebBackend() {
  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        {/* Back Button *//*}
        <Link href="/">
          <button className={styles.backButton}>Back</button>
        </Link>
      </div>
    </>
  );
}
*/