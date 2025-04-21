import { getCookie } from "@root/api/CookieController"
import { cookies } from "next/headers"
import Link from "next/link"

export default function Navbar({ children }) {
  return (
    <div className = "topBarBackground">
      <div className="navbar">
        <div className="nav-left">
            <Link href="/">
                <img title="Logo" src="images/Blueprint_trans.png" className="logoStyle"></img>
            </Link>
            <Link href="/Features" className="nav-button">Features</Link>
            <Link href="/Pricing" className="nav-button">Pricing</Link>
            <Link href="/FTU-main" className="nav-button">New Website</Link>
            {children}
            
        </div>
        <Link href="/account-creation" className="nav-button">Sign Up</Link>
      </div>
    </div>
  )
}