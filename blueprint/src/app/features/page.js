import styles from './page.module.css';
import Navbar from "../components/navbar";

export default function BlueprintFeatures() {
  // Feature card data
  const featureCards = [
    {
      id: 1,
      text: "Dozens of Templates!<br><br><br><br>For all of your website needs."
    },
    {
      id: 2,
      text: "Edit your website at any time.<br><br><br>For maximum convenience and efficiency"
    },
    {
      id: 3,
      text: "World class customer support<br><br><br><br>A service that you can count on."
    },
    {
      id: 4,
      text: "Choose your own domain...<br><br><br><br>Enter a world of possibilities."
    },
    {
      id: 5,
      text: "And many more features..."
    }
  ];
  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.mainContent}>
        <h1>Blueprint Features</h1>
        <h2>Webdesign for goldfish</h2>

        <div className={styles.featuresSection}>
          <h3>Features List</h3>
          <div className={styles.featuresGrid}>
            {featureCards.map((card) => (
              <div key={card.id} className={styles.featureCard}>
                <p 
                  className={styles.featureText}
                  dangerouslySetInnerHTML={{ __html: card.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}