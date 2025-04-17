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
                            <h1><b>Server Status Summary:</b></h1>
                            <dl className = {styles.infoText}>
                                <dt>Ping: 00ms</dt>
                                <dt>Mem. Usage: 0%</dt>
                                <dt>Disk Used: 0%</dt>
                            </dl>
                        </div>
                        <div className={styles.cell}>
                            <h1><b>Selected User Summary:</b></h1>
                            <dl className = {styles.infoText}>
                                <dt>Username</dt>
                                <dt>Email address</dt>
                                <dt>Phone number</dt>
                                <dt>Name</dt>
                            </dl>
                        </div>
                        <div className={styles.cell}>
                            <h1><b>Admin Actions:</b></h1>
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
                            <h1><b>Server Status:</b></h1>
                            <img src="images/usage_demo.png"></img>
                        </div>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.cell}>
                        <h1><b>Modify Accounts:</b></h1>
                        <input className={styles.searchUser} type="text" placeholder="Search For Account" />
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



