import CreateButton from "./CreateRouteButton.js"
import CreateImage from "./CreateRouteImage.js"

export default function Navbar() {
    return (
      <div className = "topBarBackground">
        <div className="navbar">
        <div className="nav-left">
            <CreateImage code="logo" />
            <CreateButton code="features" />
            <CreateButton code="pricing" />
        </div>
        <CreateButton code="login" />
        </div>
      </div>
    )
  }