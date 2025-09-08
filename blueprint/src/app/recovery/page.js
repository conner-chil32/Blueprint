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
            id: 'password',
            text: "Password"
        },
        {
            id: 'phone',
            text: "Phone Number (Optional)"
        }
    ];

    return (
    <>
        <Navbar />
            <div className={styles.body}>
                <div className={`${styles.bodySection} ${styles.createSection}`}>
                    <p>Forgot Username</p>
                    <form>
                        {infoBoxes.map((box) => (
                            <div key={box.id} className={styles.infoBox}>
                                <input type="text" name={box.id} placeholder={box.text} required={box.id !== 'phone'}></input>
                            </div>
                        ))}
                        <input type="checkbox" id="marketing" value="Yes"/>
                        <label> I am interested in future marketing</label><br />
                        <button className="submit-button" type="submit">CREATE <br/> ACCOUNT</button>
                    </form>
                </div>

                <div className={`${styles.bodySection} ${styles.createSection}`}>
                    <p>Forgot Password</p>
                    <form>
                        {infoBoxes.map((box) => (
                            <div key={box.id} className={styles.infoBox}>
                                <input type="text" name={box.id} placeholder={box.text} required={box.id !== 'phone'}></input>
                            </div>
                        ))}
                        <input type="checkbox" id="marketing" value="Yes" />
                        <label> I am interested in future marketing</label><br />
                        <button className="submit-button" type="submit">CREATE <br /> ACCOUNT</button>
                    </form>
                </div>
            
            {/* <AccountCollecter currentPage = "/signup" /> */}
            </div>
    </>
    )
}