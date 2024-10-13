import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cbc_logo } from "../../assets/Assets";
import "./NavBar.css";

function NavBar({ onLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false); // Close the menu after navigation
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="container">
      <div className="navbar-contents">
        <img
          src={cbc_logo}
          alt="CBC Hagonoy Logo"
          className="navbar_logo"
          onClick={() => handleNavigation("/")}
        />

        {/* Hamburger Menu Icon */}
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li
            className={isActive("/about")}
            onClick={() => handleNavigation("/about")}
          >
            About Us
          </li>
          <li
            className={isActive("/beliefs")}
            onClick={() => handleNavigation("/beliefs")}
          >
            Beliefs
          </li>
          <li
            className={isActive("/ministries")}
            onClick={() => handleNavigation("/ministries")}
          >
            Ministries
          </li>
          <li
            className={isActive("/bible")}
            onClick={() => handleNavigation("/bible")}
          >
            Bible
          </li>
        </ul>

        {/* Sign Up and Login Buttons */}
        <div className={`buttons-container-navbar ${menuOpen ? "active" : ""}`}>
          <button className="sign-up" onClick={() => onLoginClick("signup")}>
            SIGN UP
          </button>
          <button className="login" onClick={() => onLoginClick("login")}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
