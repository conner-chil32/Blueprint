import Navbar from "../components/navbar";
import styles from "./page.module.css";

async function getUserData() {
  const res = await fetch(`http://${process.env.ADDRESS}:8000/wp-json/wp/v2/users`)
  return res.json()
}

export default async function RawHTMLPage() {
  const users = await getUserData()
  console.log(users)

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