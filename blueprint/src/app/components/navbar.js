import Link from "next/link"

export default function Navbar() {
    return (
      <div class = "topBarBackground">
        <div class="navbar">
        <div class="nav-left">
            <Link href="/HomePage">
                <img title="Logo" src="images/Blueprint_trans.png" class="logoStyle"></img>
            </Link>
            <Link href="/Features" class="nav-button">Features</Link>
            <Link href="/Pricing" class="nav-button">Pricing</Link>
        </div>
        <Link href="Login.html" class="nav-button">Login</Link>
        </div>
      </div>
    )
  }