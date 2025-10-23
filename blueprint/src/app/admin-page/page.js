'use client'

import Navbar from "../components/navbar";  // Import the Navbar component
import styles from './page.module.css'; // Import the CSS module for styling
import ActionButton from "../components/adminActions";
import { useEffect, useState } from 'react';

// async function getUserData() {
//   const res = await fetch(`http://${process.env.ADDRESS}:8000/wp-json/wp/v2/users`)
//   return res.json()
// }
const placeholder = "00";
const placeholdertext = "placeholder";

export default function admin_view() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error('Failed to fetch user list');
                const data = await res.json();

                if (data.success) {
                    setUsers(data.userList);
                } else {
                    throw new Error(data.error || 'Unknown server error');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return (
        <>
            <Navbar />
            <div className={styles.body}>
                <div className = {styles.quickView}>
                <div className = {styles.leftSide}>
                    <div className={styles.topRow}>
                        <div className={styles.cell}>
                            <h1><b>Server Status Summary:</b></h1>
                            <dl className = {styles.infoText}>
                                <dt>Ping: {placeholder}</dt>
                                <dt>Mem. Usage: {placeholder}%</dt>
                                <dt>Disk Used: {placeholder}%</dt>
                            </dl>
                        </div>
                        <div className={styles.cell}>
                            <h1><b>Selected User Summary:</b></h1>
                            <dl className = {styles.infoText}>
                                <dt>Username: {placeholdertext}</dt>
                                <dt>Email address: {placeholdertext}</dt>
                                <dt>Phone number: {placeholdertext}</dt>
                                <dt>Name: {placeholdertext}</dt>
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
                            <img src="images/usage_demo.png" alt="demo graph of server usage"></img>
                        </div>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.cell}>
                        <h1><b>Modify Accounts:</b></h1>
                        <input className={styles.searchUser} type="text" placeholder="Search For Account" />
                            <dl className={styles.accountList}>
                                {loading || error ? (
                                    <>
                                        <dt>{placeholdertext}</dt>
                                        <dt>{placeholdertext}</dt>
                                        <dt>{placeholdertext}</dt>
                                        <dt>{placeholdertext}</dt>
                                    </>)
                                    : users.map((user) => (
                                        <dt key={user.userID}>
                                            {user.userName} — {user.userEmail}
                                        </dt>
                                    ))
                                }
                            </dl>
                        <ActionButton label="Add Account" />
                    </div>
                </div>
        </div>
        </div>
        </>
    );
}


