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

import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; 
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(()=>{
        if (window.document.cookie.includes("UserCookie")) window.location.href = "/";
    });
    const [invalidInputs, setInvalidInputs] = useState({
      username: false,
      password1: false,
    });
    const [isError, setIsError] = useState(false);

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
    setIsError(false);
    setInvalidInputs({ username: false, password1: false });

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
        setIsError(false);
        setTimeout(5000); //in this time, cookies are set to denote user has signed in
        window.location.href = "/";
        //redirect to set cookie
      } else {
        setIsError(true);
        setMessage((data.error || "Unknown error"));
        setInvalidInputs({ username: true, password1: true });
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Server error, please try again later.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className={styles.body}>
        <div className={`${styles.bodySection} ${styles.createSection}`}>
          <form onSubmit={handleSubmit}>
            {infoBoxes.map((box) => {
              const isInvalid = Boolean(invalidInputs[box.id]);

              return(
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
                    className={isInvalid ? styles.invalidInput : ""}
                    onInput={() =>
                      setInvalidInputs((prev) => ({ ...prev, [box.id]: false }))
                    }
                    aria-invalid={isInvalid ? "true" : "false"}
                  />
                </div>
              );
            })}


            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "CREATING..." : <>LOG IN <br /> </>}
            </button>
          </form>

          {message && <p className={`${styles.message} ${isError ? styles.messageError : styles.messageSuccess}`}>{message}</p>}
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