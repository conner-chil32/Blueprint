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
            <CreateButton code="canvas" />

        </div>
        <CreateButton code='navtest' />
        <CreateButton code="login" />
        </div>
      </div>
    )
  }
//remove line 13 when testing complete