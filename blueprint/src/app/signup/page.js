"use client";

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
      id: 'email',
      text: "Email"
    },
    {
      id: 'password1',
      text: "Password",
      type: "password"
    },
    {
      id: 'password2',
      text: "Re-enter Password",
      type: "password"
    },
    {
      id: 'phone' ,
      text: "Phone Number (Optional)"
    }
  ];

  const securityQuestions = [
    "What was your childhood nickname?",
    "What is the name of your favorite childhood friend?",
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the make of your first car?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password1 = formData.get("password1");
    const password2 = formData.get("password2");
    const phone = formData.get("phone") || null;
    const marketing = formData.get("marketing") === "Yes";
    const securityQuestion = formData.get("securityQuestion");
    const securityAnswer = formData.get("securityAnswer");

    if (password1 !== password2) {//error if passwords dont match
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password: password1,
          phone,
          marketing,
          securityQuestion,
          securityAnswer,
        }),
      });

      const data = await res.json();
      if (data.success) {//debug messages can remove later or simplify for end user
        setMessage("Account created successfully!");
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
                  type={box.type || "text"}
                  name={box.id}
                  placeholder={box.text}
                  required={box.id !== "phone"}
                />
              </div>
            ))}
            <div className={styles.infoBox}>
              <select name="securityQuestion" className = {styles.selectInput} required>
                <option value="">Select a security question</option>
                {securityQuestions.map((q, idx) => (
                  <option key={idx} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div className={styles.infoBox}>
              <input
                type="text"
                name="securityAnswer"
                placeholder="Your Answer"
                required
              />
            </div>
            <input type="checkbox" id="marketing" name="marketing" value="Yes"/>
            <label> I am interested in future marketing</label><br />
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : <>CREATE <br/> ACCOUNT</>}
            </button>
            {message && <div>{message}</div>}
          </form>
        </div>
        <div className={`${styles.bodySection} ${styles.reqsSection}`}>
          <p>
            Password Must Contain at least: <br/>
            - 1 Uppercase Letter <br/>
            - 1 Lowercase Letter <br/>
            - 1 Number (0 - 9) <br/>
            - 1 Special Character (#,$,%,&,!) <br/>
            - 8 Characters Minimum<br/>
          </p>
          <button className="submit-button" type="button">
            <a href='/login'>BACK TO LOGIN</a>
          </button>
        </div>
        {/* <AccountCollecter currentPage = "/signup" /> */}
      </div>  
    </>
  )
}
