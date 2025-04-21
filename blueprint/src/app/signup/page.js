import Navbar from "../components/navbar"
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; // Import the CSS module for styling

export default function SignUpPage() {

    return (
    <>
        <Navbar />
        <div className = {styles.loginContainer}>
            <img src = "images/pog_web_logo.png" className = {styles.logo}></img>
            <AccountCollecter currentPage = "/signup" />
        </div>
    </>
    )
}