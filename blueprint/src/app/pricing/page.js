import styles from "./page.module.css"; // Import the CSS module for styling
import { planTypes } from "./planTypes.js";
import CreateRouteButton from "../components/CreateRouteButton.js";

export default function RawHTMLPage() {
  return (
    <>
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
          <CreateRouteButton code="payment" />
        </div>
      </div>
    </>
  )
}