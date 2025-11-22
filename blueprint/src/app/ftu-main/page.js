'use client';


//import { Main } from "next/document"; Causing errors
import styles from "./FTU.module.css"; // Import FTU.modules.css for styling

export default function RawHTMLPage() {
    // Handler to open the WordPress dashboard
    const handleOpenWordPress = () => {
        window.open("http://localhost:8000", "_blank");
    };

    return (
    <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FTU-Main</title>

        {/* Integrate the top bar component */}
        <div className="topBarBackground">
        </div>
        
        <div className={`${styles.body} ${styles.content}`}>
            <h1 className={`${styles.h1}`}>Get Started On <br /> Your Website!</h1>
            <h1><br /></h1>
            <p className={`${styles.p}`}>With Blueprint, you will be on your way to creating your dream website in no time.</p>
            <h1><br /></h1>

            <form action="/api/website" method="POST">
                <input type="text" id="name" name="name"></input>
                <button className={`${styles.createButton}`}>
                    Create New Website<br />
                    <b>+</b>
                </button>
            </form>

            {/* Button to open WordPress Dashboard */}
            <div style={{ marginTop: "2rem" }}>
                <button
                    onClick={handleOpenWordPress}
                    style={{
                        backgroundColor: "#0073aa",
                        color: "#fff",
                        padding: "0.75rem 1.5rem",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                >
                    Open WordPress Dashboard
                </button>
            </div>
        </div>
    </>
    );
}
