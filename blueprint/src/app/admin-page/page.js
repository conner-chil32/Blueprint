import Navbar from "../components/navbar";
import styles from "./page.module.css";

class User {
  
  constructor(id, name, sites) {
    this.id = id
    this.name = name
    this.sites = sites
  }
}

export default function RawHTMLPage() {
  const users = [new User(1, "Steve", ["http://localhost:8000/site1"]), new User(2, "Jeff", ["htttp://localhost:8000/site2"])]

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
        <div>Users:</div>
        <input className={styles.searchUser} type="text" placeholder="Search For Account" ></input>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <div className={styles.box}>
                  <div className={styles.listelement}>{user.name} 
                    <div className={styles.actions}>
                      <button>User Site</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}