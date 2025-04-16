import Link from "next/link"

export default function Navbar() {
    return (
      <div className = "topBarBackground">
        <div className="navbar">
        <div className="nav-left">
            <Link href="/HomePage">
                <img title="Logo" src="images/Blueprint_trans.png" class="logoStyle"></img>
            </Link>
            <Link href="/Features" className="nav-button">Features</Link>
            <Link href="/Pricing" className="nav-button">Pricing</Link>
        </div>
        <Link href="Login.html" className="nav-button">Login</Link>
        </div>
      </div>
    )
  }