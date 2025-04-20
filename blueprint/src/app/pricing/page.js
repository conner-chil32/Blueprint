import Navbar from "../components/navbar";  // Import the Navbar component
import styles from "./page.module.css"; // Import the CSS module for styling

export default function RawHTMLPage() {
    return (
    <>
        <Navbar />  {/* Render the Navbar component */}
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>There is a plan for everyone</h1>

                <div className={styles.plans}>
                    <div className={styles.plan}>
                        <h2>FREE PLAN</h2>
                        <p>$0</p>
                        <ul>
                            <li>PERK 1 OF FREE</li>
                            <li>PERK 2 OF FREE</li>
                            <li>PERK 3 OF FREE</li>
                            <li>PERK 4 OF FREE</li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h2>PERSONAL PLAN</h2>
                        <p>$5/mo</p>
                        <ul>
                            <li>ALL PERKS OF FREE</li>
                            <li>PERK 1 OF PERSONAL</li>
                            <li>PERK 2 OF PERSONAL</li>
                            <li>PERK 3 OF PERSONAL</li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h2>BUSINESS PLAN</h2>
                        <p>$15/mo</p>
                        <ul>
                            <li>ALL PERKS OF PERSONAL</li>
                            <li>PERK 1 OF BUSINESS</li>
                            <li>PERK 2 OF BUSINESS</li>
                            <li>PERK 3 OF BUSINESS</li>
                        </ul>
                    </div>

                    <div className={styles.plan}>
                        <h2>ENTERPRISE PLAN</h2>
                        <p>Custom Pricing</p>
                        <ul>
                            <li>ALL PERKS OF BUSINESS</li>
                            <li>PERK 1 OF ENTERPRISE</li>
                            <li>PERK 2 OF ENTERPRISE</li>
                            <li>PERK 3 OF ENTERPRISE</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}