// create the React for userwebbackend, /userwebbackend will point to here

// src/app/UserWebBackend/page.js
import styles from './UserWebBackend.module.css';
import Link from 'next/link';
import Navbar from '../components/navbar'; // relative path might need adjusting

export default function UserWebBackend() {
  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        {/* Back Button */}
        <Link href="/">
          <button className={styles.backButton}>Back</button>
        </Link>
      </div>
    </>
  );
}