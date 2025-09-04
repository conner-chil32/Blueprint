import Navbar from "../components/navbar"
import AccountCollecter from "../components/accountCollecter";
import styles from './page.module.css'; // Import the CSS module for styling

export default function SignUpPage() {

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
            text: "Password"
        },
        {
            id: 'password2',
            text: "Re-enter Password"
        },
        {
            id: 'phone' ,
            text: "Phone Number (Optional)"
        }
    ];

    return (
    <>
        <Navbar />
            <div className={styles.body}>
                <div className={`${styles.bodySection} ${styles.createSection}`}>
                    {infoBoxes.map((box) => (
                        <div key={box.id} className={styles.infoBox}>
                            <input type="text" placeholder={box.text}></input>
                        </div>
                    ))}
                    <div className={styles.form}>
                        <form>
                            <input type="checkbox" id="marketing" value="Yes"/>
                            <label> I am interested in future marketing</label><br/>
                        </form>
                    </div>
                </div>
                <div className={`${styles.bodySection} ${styles.reqsSection}`}>
                    <p>
                        Password Must Contain at least: <br/>
                        - 1 Uppercase Letter <br/>
                        - 1 Lowercase Letter <br/>
                        - 1 Number Value {'(0 - 9)'} <br/>
                        - 1 Special Character {'(#,$,%,&,!)'} <br/>
                        - Minimum of 8 Characters <br/>
                    </p>
                </div>
            
            {/* <AccountCollecter currentPage = "/signup" /> */}
            </div>
    </>
    )
}