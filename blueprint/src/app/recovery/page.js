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
            text: "Email/Phone Number"
        },
        {
            id: 'password',
            text: "Password"
        }
    ];

    return (
    <>
        <Navbar />
            <div className={styles.body}>
                <div className={`${styles.bodySection}`}>
                    <p>I Forgot My Username</p>
                    <form>
                        {infoBoxes
                            .filter((box) => box.id !== 'username')
                            .map((box) => (
                            <div key={box.id} className={styles.infoBox}>
                                <input type="text" name={box.id} placeholder={box.text} required={box.id !== 'phone'}></input>
                            </div>
                        ))}
                        <button className="submit-button" type="submit">CONTINUE</button>
                    </form>
                </div>

                <div className={`${styles.bodySection}`}>
                    <p>I Forgot My Password</p>
                    <form>
                        {infoBoxes
                            .filter((box) => box.id !== 'password')
                            .map((box) => (
                            <div key={box.id} className={styles.infoBox}>
                                <input type="text" name={box.id} placeholder={box.text} required={box.id !== 'phone'}></input>
                            </div>
                        ))}
                        <button className="submit-button" type="submit">CONTINUE</button>
                    </form>
                </div>
            </div>
    </>
    )
}