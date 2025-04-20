import Link from "next/link"

export default function Navbar() {
    return (
      <div className = "topBarBackground">
        <div className="navbar">
        <div className="nav-left">
            <Link href="/">
                <img title="Logo" src="images/Blueprint_trans.png" className="logoStyle"></img>
            </Link>
            <Link href="/Features" className="nav-button">Features</Link>
            <Link href="/Pricing" className="nav-button">Pricing</Link>
        </div>
        <Link href="login" className="nav-button">Login</Link>
        </div>
      </div>
    )
  }