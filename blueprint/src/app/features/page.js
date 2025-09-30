// page.js
"use client";
import styles from './page.module.css';
import Navbar from "../components/navbar";
import { useEffect, useRef } from 'react';

function getIcon(type) {
  const icons = {
    templates: '📄',
    edit: '✏️',
    support: '🛠️',
    domain: '🌐',
    more: '➕'
  };
  return icons[type] || '';
}

export default function BlueprintFeatures() {
  // Feature card data
  const featureCards = [
    {
      id: 1,
      text: "Dozens of Templates!<br><br><br><br>For all of your website needs.",
      icon: "templates"
    },
    {
      id: 2,
      text: "Edit your website at any time.<br><br><br>For maximum convenience and efficiency",
      icon: "edit"
    },
    {
      id: 3,
      text: "World class customer support<br><br><br><br>A service that you can count on.",
      icon: "support"
    },
    {
      id: 4,
      text: "Choose your own domain...<br><br><br><br>Enter a world of possibilities.",
      icon: "domain"
    },
    {
      id: 5,
      text: "And many more features...",
      icon: "more"
    }
  ];

  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    if (featuresRef.current) observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.mainContent}>
        <h1>Blueprint Features</h1>
        <h2>Webdesign for goldfish</h2>

        <div ref={featuresRef} className={`${styles.featuresSection} ${styles.hidden}`}>
          <h3>Features List</h3>
          <div className={styles.featuresGrid}>
            {featureCards.map((card) => (
              <div key={card.id} className={styles.featureCard}>
                {card.icon && <div className={styles.featureIcon}>{getIcon(card.icon)}</div>}
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