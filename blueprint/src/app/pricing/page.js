import Navbar from "../components/navbar";  // Import the Navbar component
import styles from "./page.module.css"; // Import the CSS module for styling

export default function RawHTMLPage() {
      const planTypes = [ //array of dictionaries for the plan types
    {
        id: 1,
        name: "free",
        price: "$0",
        perk1: "template perk",
        perk2: "template perk",
        perk3: "template perk",
        perk4: "template perk"
    },
    {
        id: 2,
        name: "personal",
        price: "$5",
        perk1: "template perk",
        perk2: "template perk",
        perk3: "template perk",
        perk4: "template perk"
    },
    {
        id: 3,
        name: "business",
        price: "$15",
        perk1: "template perk",
        perk2: "template perk",
        perk3: "template perk",
        perk4: "template perk"
    },
    {
        id: 4,
        name: "enterprise",
        price: "custom pricing",
        perk1: "template perk",
        perk2: "template perk",
        perk3: "template perk",
        perk4: "template perk"
    }
  ];

    return (
    <>
        <Navbar />
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>There is a plan for everyone</h1>

                <div className={styles.plans}>
                    {planTypes.map((card) => (
                        <div key={card.id} className={styles.plan}>
                            <h2 className = "capitalize">{card.name} plan:</h2>
                            <p className = "capitalize"><strong>{card.price}</strong></p>
                            <ul className = "capitalize">
                                <li>{card.perk1}</li>
                                <li>{card.perk2}</li>
                                <li>{card.perk3}</li>
                                <li>{card.perk4}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    )
}

/*  original setup
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
*/