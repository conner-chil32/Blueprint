/*import Navbar from "../components/navbar";  // Import the Navbar component
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; // Import the CSS module for styling

export default function Login() {

    return (
        <>
            <Navbar />
            <div className = {styles.loginContainer}>
                <img src = "images/pog_web_logo.png" className = {styles.logo}></img>
                <AccountCollecter currentPage = "/login" />
            </div>
        </>
    );
}
*/
"use client"; //Allows page to be able to make api calls, makes it a client component rather than server component 

import Navbar from "../components/navbar"
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; 
import { useState } from "react";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const infoBoxes = [
        {
            id: 'username',
            text: "Username"
        },
        {
            id: 'password1',
            text: "Password"
        }
    ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password1 = formData.get("password1");



    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: password1,
        }),
      });

      const data = await res.json();
      if (data.success) {//debug messages can remove later or simplify for end user
        setMessage("Logged in successfully!");
        e.target.reset();
      } else {
        setMessage("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.body}>
        <div className={`${styles.bodySection} ${styles.createSection}`}>
          <form onSubmit={handleSubmit}>
            {infoBoxes.map((box) => (
              <div key={box.id} className={styles.infoBox}>
                <input
                  type={
                    box.id.includes("password")
                      ? "password"
                      : box.id === "email"
                      ? "email"
                      : "text"
                  }
                  name={box.id}
                  placeholder={box.text}
                  required={box.id !== "phone"}
                />
              </div>
            ))}


            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "CREATING..." : <>LOG IN <br /> </>}
            </button>
          </form>

          {message && <p className={styles.message}>{message}</p>}
        </div>

        <div className={`${styles.bodySection} ${styles.reqsSection}`}>
            <p>
                Dont have an account yet?<br></br> Don't miss out!<br></br> create one down below. 
            </p>
            <button className="submit-button" type="submit"><a href='/signup'>CREATE ACCOUNT</a></button>
            
        </div>
    
    {/* <AccountCollecter currentPage = "/signup" /> */}
    </div>  
    </>
    )
}