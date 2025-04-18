import Navbar from "../components/navbar";  // Import the Navbar component
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; // Import the CSS module for styling

export default function Recovery() {
        return (
        <>
            <Navbar />
            <div className={styles.loginContainer}>
                <img src="images/pog_web_logo.png" className={styles.logo}></img>
                <AccountCollecter currentPage="/recovery" />
            </div>
        </>
    );
}