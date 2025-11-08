'use client'

import Navbar from "../components/navbar";  // Import the Navbar component
import styles from './page.module.css'; // Import the CSS module for styling
import ActionButton from "../components/adminActions";
import { useEffect, useState } from 'react';
const placeholder = "00";
const placeholdertext = "placeholder";

export default function admin_view() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedUserID, setSelectedUserID] = useState(null);
    const [noteText, setNoteText] = useState("");
    const [showNotePopup, setshowNotePopup] = useState(false);
    const [showBanPopup, setShowBanPopup] = useState(false);
    const [showHistoryPopup, setShowHistoryPopup] = useState(false);
    const [selectedUserHistory, setSelectedUserHistory] = useState([]);
    const [customDurationValue, setCustomDurationValue] = useState(1);
    const [customDurationUnit, setCustomDurationUnit] = useState("days");


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

    const openNoteModal = () => {
        if (selectedUser) {
            setNoteText(selectedUser.adminNote || "");
        } setshowNotePopup(true)
    };
        
    const closeNoteModal = () => {

        setshowNotePopup(false);
        setNoteText("");
    };

    const openBanModal = () => {
        if (!selectedUser) return;
        setShowBanPopup(true);
    };

    const closeBanModal = () => {
        setShowBanPopup(false);
        setCustomDurationValue(1);
        setCustomDurationUnit("days");
    };

    const openHistoryModal = async () => {
        console.log("Selected user:", selectedUser);
        if (!selectedUser) return;

        try {
            const res = await fetch(`/api/login-history/${selectedUser.userID}`);
            const data = await res.json();
            console.log("Login history API result:", data);

            if (data.success) {
                setSelectedUserHistory(data.logins || []);
                setShowHistoryPopup(true);
            } else {
                console.error("Failed to load login history:", data.error);
                setSelectedUserHistory([]);
                setShowHistoryPopup(true);
            }
        } catch (err) {
            console.error("Error fetching login history:", err);
        }
    };


    const closeHistoryModal = () => {
        setShowHistoryPopup(false);
        setSelectedUserHistory([]);
    }

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
                closeNoteModal();
            } else {
                console.error("Failed to save note:", data.error);
            }
        } catch (err) {
            console.error("Error submitting note:", err);
        }
    };

    const handleUserBan = async (durationMs) => {
        const selectedDurationEnd = new Date(Date.now() + durationMs);
        const bannedUntil = selectedDurationEnd.toISOString().slice(0, 19).replace('T', ' ');

        if (!selectedUser) return;

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: selectedUser.userID,
                    bannedUntil
                }),
            });

            const data = await res.json();

            if (data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.userID === selectedUser.userID
                            ? { ...u, bannedUntil }
                            : u
                    )
                );
                closeBanModal();
            } else {
                console.error("Failed to ban user:", data.error);
            }
        } catch (err) {
            console.error("Error banning user:", err);
        }
    };


    const deleteUser = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            const res = await fetch("/api/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID: selectedUser.userID }),
            });

            const data = await res.json();

            if (data.success) {
                setUsers((prevUsers) =>
                    prevUsers.filter((u) => u.userID !== selectedUser.userID)
                );
                setSelectedUserID(null);
                fetchUsers()
            } else {
                console.error("Failed to delete user:", data.error);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
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
                                <ActionButton label="Delete account" onClick={(e) => deleteUser(e)} />
                                <ActionButton label="Ban user" onClick={openBanModal} />
                                <ActionButton label="Login history" onClick={openHistoryModal} />
                                <ActionButton label="Add note" onClick={openNoteModal} />
                                </div>
                                {showNotePopup && (
                                    <div className={styles.popupOverlay}>
                                        <div className={styles.popupWindow}>
                                            <h3>Add Admin Note</h3>
                                            <textarea
                                                className={styles.popupTextarea}
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                            />
                                            <div className={styles.popupActions}>
                                                <button onClick={closeNoteModal} className={styles.actions}>Cancel</button>
                                                <button onClick={(e) => handleNoteSubmit(e)} className={styles.actions}>
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showBanPopup && (
                                    <div className={styles.popupOverlay}>
                                        <div className={styles.popupWindow}>
                                            <h3>Ban User</h3>
                                            <p>Select ban duration:</p>

                                            <div className={styles.presetButtons}>
                                                <button onClick={() => handleUserBan(1 * 60 * 60 * 1000)}>1 hour</button>
                                                <button onClick={() => handleUserBan(12 * 60 * 60 * 1000)}>12 hours</button>
                                                <button onClick={() => handleUserBan(24 * 60 * 60 * 1000)}>1 day</button>
                                                <button onClick={() => handleUserBan(3 * 24 * 60 * 60 * 1000)}>3 days</button>
                                                <button onClick={() => handleUserBan(7 * 24 * 60 * 60 * 1000)}>1 week</button>
                                            </div>

                                            <div className={styles.customDuration}>
                                                <p>or set custom duration:</p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={customDurationValue}
                                                    onChange={(e) => setCustomDurationValue(e.target.value)}
                                                />
                                                <select
                                                    value={customDurationUnit}
                                                    onChange={(e) => setCustomDurationUnit(e.target.value)}
                                                >
                                                    <option value="hours">hours</option>
                                                    <option value="days">days</option>
                                                    <option value="weeks">weeks</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        let multiplier = 0;
                                                        if (customDurationUnit === "hours") multiplier = 60 * 60 * 1000;
                                                        else if (customDurationUnit === "days") multiplier = 24 * 60 * 60 * 1000;
                                                        else if (customDurationUnit === "weeks") multiplier = 7 * 24 * 60 * 60 * 1000;

                                                        handleUserBan(customDurationValue * multiplier);
                                                    }}
                                                >
                                                    Apply
                                                </button>
                                            </div>

                                            <div className={styles.popupActions}>
                                                <button onClick={closeBanModal} className={styles.actions}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showHistoryPopup && (
                                    <div className={styles.popupOverlay}>
                                        <div className={styles.popupWindow}>
                                            <h3>Login History for {selectedUser?.userName}</h3>
                                            {selectedUserHistory.length > 0 ? (
                                                <ul>
                                                    {selectedUserHistory.map((entry, index) => (
                                                        <li key={index}>
                                                            {new Date(entry.loginTime).toLocaleString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No login history found.</p>
                                            )}
                                            <div className={styles.popupActions}>
                                                <button onClick={closeHistoryModal} className={styles.actions}>Close</button>
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


