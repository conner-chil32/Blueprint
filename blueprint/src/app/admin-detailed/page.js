"use client";
import styles from "./page.module.css"; // Import the CSS module for styling

export default function RawHTMLPage() {
      const planTypes = [ //array of dictionaries for the plan types
    {
        id: 1,
        name: "Login History",
              text: (
                  <>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                      Day / Month / Year <br/>
                  </>
              ),
        },
    {
        id: 2,
        name: "Projects",
        text: "Proj 1",
    },
    {
        id: 3,
        name: "Client Info",
        text: (
            <>
            Username:<br />
            User's username<br/>

            Name:<br />
            Name of User<br/>

            Phone number:<br />
            111 - 111 - 1111<br/>

            Email:<br />
            example@example.com
                  </>
              ),
    },
    {
        id: 4,
        name: "Notes",
        text: "Note about this person. Written by and only visible to the admin."
    }
  ];

    return (
    <>
       
        <div className={styles.container}>
                <div className={styles.titleRow}>
                    <h1 className={styles.title}>User's username</h1>
                    <button
                        className={styles.backButton}
                        onClick={() => (window.location.href = "/admin-account-view")}
                    >
                        Back
                    </button>
                </div>
                <div className={styles.infoBox}>
                    {planTypes.map((card) => (
                        <div key={card.id} className={styles.box}>
                            <h2 className="capitalize">{card.name}:<br></br><br></br></h2>
                            <ul className = "capitalize">
                            <li>
                                {card.id === 2 ? (
                                    <span
                                        className={styles.projectsText}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => alert("Imagine: A page with details from this user's project")}
                                    >
                                        {card.text}
                                    </span>
                                ) : (
                                    card.text
                                )}
                            </li>
                            </ul>
                        </div>
                    ))}
                </div>
        </div>
    </>
    )
}