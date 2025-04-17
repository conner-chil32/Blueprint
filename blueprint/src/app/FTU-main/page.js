//import { Main } from "next/document"; Causing errors
import Navbar from "../components/navbar";  // Import the Navbar component
import styles from "./FTU.module.css"; // Import FTU.modules.css for styling


export default function RawHTMLPage() {

    return (
    <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FTU-Main</title>

    {/*Integrate the top bar component*/}
    <div className="topBarBackground">
        <Navbar />
    </div>
    
    <div className={`${styles.body} ${styles.content}`}>

        <h1 className={`${styles.h1}`} >Get Started On <br /> Your Website!</h1>
        <h1><br /></h1>
        <p className={`${styles.p}`}>With Blueprint, you will be on your way to creating your dream website in no time.</p>
        <h1><br /></h1>

        <a href="./canvas">
            <button className={`${styles.createButton}`}>
                Create New Website<br />
                <b>+</b>
            </button>
        </a>
    </div>
    </>
    );
}