import Navbar from "../components/navbar";  // Import the Navbar component
import styles from './adminView.module.css'; // Import the CSS module for styling
import adminActions from "../components/adminActions";
import ActionButton from "../components/adminActions";




export default function admin_view() {
    return (
        <>
            <Navbar />
            <body className={styles.quickView}>
                <div className={styles.leftSide}>
                    <div className={styles.topRow}>
                        <div className={styles.cell}>
                            <h1>Server Status Summary:</h1>
                            <dl className = {styles.infoText}>
                                <dt>Ping: 00ms</dt>
                                <dt>Mem. Usage: 0%</dt>
                                <dt>Disk Used: 0%</dt>
                            </dl>
                        </div>
                        <div className={styles.cell}>
                            <h1>Selected User Summary:</h1>
                            <dl className = {styles.infoText}>
                                <dt>Username</dt>
                                <dt>Email address</dt>
                                <dt>Phone number</dt>
                                <dt>Name</dt>
                            </dl>
                        </div>
                        <div className={styles.cell}>
                            <h1>Admin Actions:</h1>
                            <div className={styles.ActionButtonsList}>
                                <ActionButton label="Delete account" />
                                <ActionButton label="Temporarily ban user" />
                                <ActionButton label="Permanently ban user" />
                                <ActionButton label="Add note" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottomRow}>
                        <div className={styles.cell}>
                            <h1>Server Status</h1>
                            <img src="images/usage_demo.png"></img>
                        </div>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.cell}>
                        <h1>Modify Accounts:</h1>
                        <input type="text" placeholder="Search For Account" />
                        <dl className={styles.accountList}>
                            <dt>Username</dt>
                            <dt>Username</dt>
                            <dt>Username</dt>
                            <dt>Username</dt>
                        </dl>
                        <ActionButton label="Add Account" />
                    </div>
                </div>
        </body>
        </>
    );

}



