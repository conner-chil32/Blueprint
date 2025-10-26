'use client'

import Navbar from "../components/navbar";  // Import the Navbar component
import styles from './page.module.css'; // Import the CSS module for styling
import ActionButton from "../components/adminActions";
import { useEffect, useState, useRef } from 'react';
const placeholder = "00";
const placeholdertext = "placeholder";

export default function admin_view() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedUserID, setSelectedUserID] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [showPopup, setShowPopup] = useState(false);

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

    const selectedUser = users.find((u) => u.userID === selectedUserID);

    const openModal = () => {
        if (selectedUser) {
            setNoteText(selectedUser.adminNote || "");
        } setShowPopup(true)
    };
        
    const closeModal = () => {

        setShowPopup(false);
        setNoteText("");
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser) return;

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: selectedUser.userID,
                    adminNote: noteText
                }),
            });

            const data = await res.json();

            if (data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.userID === selectedUser.userID
                            ? { ...u, adminNote: noteText }
                            : u
                    )
                );
                closeModal();
            } else {
                console.error("Failed to save note:", data.error);
            }
        } catch (err) {
            console.error("Error submitting note:", err);
        }
    };


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
                                {selectedUser ? (
                                    <dl className={styles.infoText}>
                                        <dt>Username: {selectedUser.userName}</dt>
                                        <dt>Email address: {selectedUser.userEmail}</dt>
                                        <dt>Phone number: {selectedUser.userPhone}</dt>
                                        <dt>Last login: {selectedUser.userLastLogin}</dt>
                                    </dl>
                                ) : (
                                    <dl className={styles.infoText}>
                                        <dt>Username: </dt>
                                        <dt>Email address: </dt>
                                        <dt>Phone number: </dt>
                                        <dt>Last login: </dt>
                                    </dl>
                                )}
                        </div>
                        <div className={styles.cell}>
                            <h1><b>Admin Actions:</b></h1>
                            <div className={styles.ActionButtonsList}>
                                <ActionButton label="Delete account" />
                                <ActionButton label="Temporarily ban user" />
                                <ActionButton label="Permanently ban user" />
                                <ActionButton label="Add note" onClick={openModal} />
                                </div>
                                {showPopup && (
                                    <div className={styles.popupOverlay}>
                                        <div className={styles.popupWindow}>
                                            <h3>Add Admin Note</h3>
                                            <textarea
                                                className={styles.popupTextarea}
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                            />
                                            <div className={styles.popupActions}>
                                                <button onClick={closeModal} className={styles.actions}>Cancel</button>
                                                <button onClick={(e) => handleNoteSubmit(e)} className={styles.actions}>
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                            <button className={`${styles.userButton} ${selectedUserID === user.userID ? styles.selectedUser : ''}`}
                                                onClick={() => setSelectedUserID(user.userID)}>
                                                {user.userName} — {user.userEmail}
                                            </button>
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


