// create the React for userwebbackend, /userwebbackend will point to here

// src/app/UserWebBackend/page.jsç
import styles from './UserWebBackend.module.css';
import Image from 'next/image';
import Link from 'next/link'; 


export default function UserWebBackend() {
 return (
   <div>
     {/* Top Bar */}
     <div className={styles.topBar}>
       {/* Logout Button */}
       <Link href="/login">
         <button className={`${styles.logoutButton}`}>Log Out</button>
       </Link>


       {/* Logo that links to home */}
       <Link href="/">
         <Image
           src="/Blueprint_trans.png"
           alt="Logo"
           className={styles.logoStyle}
           width={120}
           height={40}
         />
       </Link>
     </div>


     {/* Back Button */}
     <div>
       <Link href="/">
         <button className={`${styles.backButton}`}>Back</button>
       </Link>
     </div>
   </div>
 );
}



