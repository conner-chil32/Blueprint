import Navbar from "../components/navbar";
import styles from "./page.module.css";

export default function RawHTMLPage() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Sidebar: Logo & Server Status */}
        <div className={styles.box}>
          <div className={styles.logo}>Blueprint Logo</div>
          <div className={styles.statusSummary}>
            <h3>Server status summary:</h3>
            <div>Ping: ##ms</div>
            <div>Mem. usage: ##%</div>
            <div>Disk Used ##%</div>
          </div>
        </div>

        {/* Center Section: Selected User Summary & Admin Actions */}
        <div className={styles.box}>
          <h3>Selected user summary:</h3>
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Email address" />
          <input type="text" placeholder="Phone number" />
          <input type="text" placeholder="Name" />
          
          <h3>Admin actions:</h3>
          <div className={styles.actions}>
            <button>Delete account</button>
            <button>Temporarily ban user</button>
            <button>Permanently ban user</button>
            <button>Add note</button>
          </div>
        </div>

        {/* Right Section: Modify Accounts */}
        <div className={styles.box}>
          <h3>Modify Accounts:</h3>
          <input type="text" placeholder="Search For Account" />
          <div className={styles.accountList}>
            <div>Username</div>
            <div>Username</div>
            <div>Username</div>
            <div>Username</div>
          </div>
          <button className={styles.addAccount}>Add Account</button>
        </div>

        {/* Bottom Section: Server Status Graphs */}
        <div className={styles.graphContainer}>
          <h3>Server Status Graphs (Placeholder)</h3>
        </div>
      </div>
    </>
  );
}