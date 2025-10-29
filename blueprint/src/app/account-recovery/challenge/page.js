"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../page.module.css'; // Use styles from the parent
import Navbar from '../../components/navbar';

// use the same styles from the AccountCollecter
import componentStyles from '../../components/styles.module.css';

/**
 * Account Recovery Challenge Page
 * This page retrieves a user's security question based on the email in the
 * URL and asks them to provide an answer.
 */

export default function RecoveryChallenge() {
    // Get URL parameters
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    // State for the component
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // This effect runs once on component load
    useEffect(() => {
        if (!email) {
            setError("No email address provided. Please go back and try again.");
            setIsLoading(false);
            return;
        }

        // Fetch the security question from a new API route
        async function fetchQuestion() {
            try {
                // We'll create this API route next
                const response = await fetch(`/api/account-recovery/get-question?email=${email}`);
                
                if (!response.ok) {
                    throw new Error("Failed to retrieve security question. Please try again.");
                }

                const data = await response.json();
                setQuestion(data.question);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestion();
    }, [email]); // Dependency array ensures this only runs if 'email' changes

    
    // Renders the main content
    const renderContent = () => {
        if (isLoading) {
            return <p>Loading security question...</p>;
        }
        
        if (error) {
            return <p style={{ color: 'red' }}>{error}</p>;
        }

        if (!question) {
            return <p style={{ color: 'red' }}>This account does not have a security question set up. Cannot proceed with recovery.</p>;
        }

        // If all is well, show the form
        return (
            // This form will POST to a new API route we'll create
            <form action="/api/account-recovery/validate-answer" method="POST" className={componentStyles.AccountCollecter}>
                
                {/* Hidden input to pass the email along with the form */}
                <input type="hidden" name="email" value={email} />

                {/* Display the question */}
                <div style={{ padding: '10px 0', fontWeight: 'bold' }}>
                    <p>Security Question:</p>
                    <p>{question}</p>
                </div>

                {/* Answer input */}
                <div className={componentStyles.userFieldContainer}>
                    <input 
                        name="answer" 
                        placeholder="Enter Your Answer" 
                        type="text" 
                        className={componentStyles.userField}
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        required 
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className={`${componentStyles.accountSubmit} submit-button`}>
                    Submit Answer
                </button>
            </form>
        );
    };

    return (
        <>
            <Navbar />
            <div className={styles.loginContainer}>
                <img src="/images/pog_web_logo.png" alt="pog web design logo" className={styles.logo} />
                {renderContent()}
            </div>
        </>
    );
}