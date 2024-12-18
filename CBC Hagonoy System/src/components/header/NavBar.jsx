import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cbc_logo } from "../../assets/Assets";
import PropTypes from "prop-types";
import "./NavBar.css";

function NavBar({ onLoginClick, menuOpen, toggleMenu }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    toggleMenu(); // Close the menu after navigation
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="container">
      <div className="navbar-contents">
        <img
          src={cbc_logo}
          alt="CBC Hagonoy Logo"
          className="navbar_logo"
          onClick={() => handleNavigation("/")}
        />

        {/* Combined Container for Buttons and Nav Links */}
        <div className={`combined-container ${menuOpen ? "active" : ""}`}>
          {/* Hamburger Menu Icon */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div
            className={`maincontainer_navbar_navigations ${
              menuOpen ? "active" : ""
            }`}
          >
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
            <div
              className={`buttons-container-navbar ${menuOpen ? "active" : ""}`}
            >
              <button
                className="sign-up"
                onClick={() => onLoginClick("signup")}
              >
                SIGN UP
              </button>
              <button className="login" onClick={() => onLoginClick("login")}>
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

NavBar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default NavBar;
