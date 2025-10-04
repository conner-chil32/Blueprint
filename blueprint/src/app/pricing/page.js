import Navbar from "../components/navbar";  // Import the Navbar component
import styles from "./page.module.css"; // Import the CSS module for styling

export default function RawHTMLPage() {
  const planTypes = [ //array of dictionaries for the plan types
    {
      id: 1,
      name: "free",
      price: "$0",
      /* perk1: "template perk",
      perk2: "template perk",
      perk3: "template perk",
      perk4: "template perk", */
      icon: "🆓"
    },
    {
      id: 2,
      name: "personal",
      price: "$5",
      /* perk1: "template perk",
      perk2: "template perk",
      perk3: "template perk",
      perk4: "template perk", */
      icon: "👤"
    },
    {
      id: 3,
      name: "business",
      price: "$15",
      /* perk1: "template perk",
      perk2: "template perk",
      perk3: "template perk",
      perk4: "template perk", */
      icon: "🏢"
    },
    {
      id: 4,
      name: "enterprise",
      price: "custom pricing",
      /* perk1: "template perk",
      perk2: "template perk",
      perk3: "template perk",
      perk4: "template perk", */
      icon: "🏭"
    }
  ];

  return (
    <>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>There is a plan for everyone</h1>

          <div className={styles.plans}>
            {planTypes.map((card, index) => (
              <div key={card.id} className={`${styles.plan} ${styles.planCard}`} style={{ animationDelay: `${0.2 * index}s` }}>
                <div className={styles.planIcon}>{card.icon}</div>
                <h2 className="capitalize">{card.name} plan:</h2>
                <p className="capitalize"><strong>{card.price}</strong></p>
                <ul className="capitalize">
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