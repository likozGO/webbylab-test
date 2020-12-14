import React from "react"
import { Link } from "react-router-dom"
import Logo from "../images/logo.svg"

const Header = () => (
  <nav className="navbar navbar-expand">
    <Link to="/films" className="navbar-brand">
      <img src={Logo} alt="Test task" />
    </Link>
    <div className="navbar-nav mr-auto">
      <li className="nav-item fill">
        <Link to="/films" className="nav-link">
          Films
        </Link>
      </li>
      <li className="nav-item fill">
        <Link to="/add" className="nav-link">
          Add
        </Link>
      </li>
    </div>
  </nav>
)

export default Header
