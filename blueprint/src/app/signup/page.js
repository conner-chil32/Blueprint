"use client";

import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; 
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState({
    password1: false,
    password2: false,
    email: false,
  });
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (document.cookie.includes("UserCookie")) {
      window.location.href = "/";
    }
  }, []);
  
  

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
    setInvalidInputs({ email: false, password1: false, password2: false });

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password1 = formData.get("password1");
    const password2 = formData.get("password2");
    const phone = formData.get("phone") || null;
    const marketing = formData.get("marketing") === "Yes";
    const securityQuestion = formData.get("securityQuestion");
    const securityAnswer = formData.get("securityAnswer");
    

    // Test to ensure the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      setInvalidInputs(prev => ({ ...prev, email: true }));
      setLoading(false);
      setIsError(true);
      return;
    }

    if (password1 !== password2) {//error if passwords dont match
      setMessage("Passwords do not match.");
      setInvalidInputs(prev => ({ ...prev, password1: true, password2: true }));
      setLoading(false);
      setIsError(true);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&!]).{8,}$/;

    if (!passwordRegex.test(password1)) {
      setMessage("Password does meet requirements.");
      setInvalidInputs(prev => ({ ...prev, password1: true, password2: true }));
      setLoading(false);
      setIsError(true);
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
        setIsError(false);
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
      <div className={styles.body}>
        <div className={`${styles.bodySection} ${styles.createSection}`}>
          <form onSubmit={handleSubmit}>
            {infoBoxes.filter(b => b.id !== 'phone').map((box) => {
              const isInvalid = Boolean(invalidInputs[box.id]);
              const inputType = box.id === 'email' ? 'email' : (box.type || 'text');

              return (
              <div key={box.id} className={styles.infoBox}>
                <input type={inputType} name={box.id} placeholder={box.text} required
                className={`${styles.emailInput} ${invalidInputs.email ? styles.invalidInput : ""}`}
                onChange={() => setInvalidInputs(prev => ({ ...prev, email: false }))}
                />
              </div>
              );
            })}
            <div className={styles.infoBox}>
              <input type={showPassword ? "text" : "password"} name="password1" placeholder="Password" required className={invalidInputs.password1 ? styles.invalidInput : ""}/>
            </div>
            <div className={styles.infoBox}>
              <input type={showPassword ? "text" : "password"} name="password2" placeholder="Re-enter Password" required className={invalidInputs.password2 ? styles.invalidInput : ""}/>
            </div>
            <div className={styles.infoBox}>
              <input type="text" name="phone" placeholder="Phone Number (Optional)" />
            </div>
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
            <div>
              <label className={styles.showPasswordToggle}>
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                /> Show Password
              </label>
            </div>
            <div>
            <input type="checkbox" id="marketing" name="marketing" value="Yes"/>
              <label> I am interested in future marketing</label><br />
            </div>
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : <>CREATE <br/> ACCOUNT</>}
            </button>
            {message && <div className={`${styles.message} ${isError ? styles.messageError : styles.messageSuccess}`}>{message}</div>}
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a href="/account-recovery" className={styles.recoveryLink}>
                Forgot Username/Password?
              </a>
            </div>
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
