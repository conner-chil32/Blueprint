import Navbar from "../components/navbar";  // Import the Navbar component
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; // Import the CSS module for styling
import Link from "next/link";

export default function Page() {
        return (
        <>
            <Navbar><Link href="/admin-account-view" className="nav-button">Admin</Link></Navbar>
            <div className={styles.loginContainer}>
                <img src="images/pog_web_logo.png" className={styles.logo}></img>
                <AccountCollecter currentPage="/signup" />
            </div>
        </>
    );
}