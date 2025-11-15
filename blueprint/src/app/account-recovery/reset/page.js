"use client"; 

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css'; // Use styles from the parent
import Navbar from '../../components/navbar';

import componentStyles from '../../components/styles.module.css';

/**
 * Account Recovery Reset Page
 * This is the final step. The user provides a new password.
 * The page validates the JWT token from the URL.
 */

export default function ResetPassword() {
    // Get URL parameters
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // State for the component
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Check for token existence
    if (!token) {
        return (
            <>
                <Navbar />
                <div className={styles.loginContainer}>
                    <p style={{ color: 'red' }}>
                        Invalid or missing recovery token. Please start the recovery process over.
                    </p>
                </div>
            </>
        );
    }

    // Handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Stop the default form POST
        setError(null);

        // --- START: Updated Validation Logic ---
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // This regex is from your app/signup/page.js file
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&!]).{8,}$/;
        
        if (!passwordRegex.test(password)) {
            setError("Password does not meet requirements. (Must include uppercase, lowercase, number, and special character: #,$,%,&,!)");
            return;
        }
        // --- END: Updated Validation Logic ---

        setIsSubmitting(true);

        try {
            // Send the data to our new API route
            const response = await fetch('/api/account-recovery/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If response is not ok, throw an error with the server's message
                throw new Error(data.error || "An unknown error occurred.");
            }

            // Success! Redirect to login with a success message
            window.location.href = '/login?reset=success';

        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.loginContainer}>
                <img src="/images/pog_web_logo.png" alt="pog web design logo" className={styles.logo} />
                
                <form onSubmit={handleSubmit} className={componentStyles.AccountCollecter}>
                    
                    <p style={{ fontWeight: 'bold' }}>Enter Your New Password</p>

                    {/* New Password Input */}
                    <div className={componentStyles.passFieldContainer}>
                        <input 
                            name="password" 
                            placeholder="New Password" 
                            type="password" 
                            className={componentStyles.passField}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    {/* Confirm Password Input */}
                    <div className={componentStyles.passFieldContainer}>
                        <input 
                            name="confirmPassword" 
                            placeholder="Confirm New Password" 
                            type="password" 
                            className={componentStyles.passField}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required 
                        />
                    </div>

                    {/* Display errors here */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {/* Submit button */}
                    <button type="submit" className={`${componentStyles.accountSubmit} submit-button`} disabled={isSubmitting}>
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </>
    );
}