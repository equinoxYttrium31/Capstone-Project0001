import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import NavBar from "./components/header/NavBar";
import Hero_Section from "./pages/hero/Hero_Section";
import Activities from "./pages/activities/Activities";
import Qoutes from "./pages/qoutes/Qoutes";
import Loading from "./components/loadingScreenClient/Loading";
import Schedule from "./pages/schedule/Schedule";
import Contact_Us from "./components/footer/Contact_Us";
import Setting_Page from "./external_pages/SettingFolder/Setting_Page";
import Login_Signup from "./components/login_signup/Login_Signup";
import User_Interface from "./external_pages/UserInterface/User_Interface";
import BiblePage from "./components/NavBar_Components/Bible/BiblePage";
import AboutUs from "./components/NavBar_Components/About Us/AboutUs";
import Beliefs from "./components/NavBar_Components/Beliefs/Beliefs";
import Ministries from "./components/NavBar_Components/Ministries/ministries";
import Events_Page from "./components/events_page/Event_Page";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; // Import ProtectedRoute

import "./App.css";

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Initial loading animation
  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }, 4000);
  }, []);

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Handle login overlay
  const handleLoginClick = (type) => {
    setMenuOpen(false);
    setOverlayType(type);
    setShowOverlay(true);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setOverlayType("");
  };

  const toggleOverlayType = () => {
    setOverlayType((prevType) => (prevType === "login" ? "signup" : "login"));
  };

  // Check authentication on app load or refresh
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await axios.get(
            "https://capstone-project0001-2.onrender.com/check-auth",
            { withCredentials: true }
          );
          if (response.data.isLoggedIn) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking auth:", error.message);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Prevent scrolling when overlay is visible
  useEffect(() => {
    document.body.style.overflow =
      showOverlay || isLoggedIn ? "hidden" : "auto";
  }, [showOverlay, isLoggedIn]);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowOverlay(false);
    navigate("/user-interface");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://capstone-project0001-2.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      Cookies.remove("token"); // Clear the token
      setIsLoggedIn(false); // Update state
      document.body.style.overflow = "auto"; // Enable scrolling
      navigate("/"); // Redirect to landing page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="App">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={3}
        toastOptions={{
          duration: 2000,
          style: { zIndex: 999999 },
        }}
      />
      {isLoading && <Loading fadeOut={fadeOut} />}
      {!isLoading && (
        <>
          <NavBar
            onLoginClick={handleLoginClick}
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
          />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="herosection">
                    <Hero_Section />
                  </div>
                  <div className="activity">
                    <Activities />
                  </div>
                  <div className="qoutesection">
                    <Qoutes />
                  </div>
                  <div className="schedules" id="schedule">
                    <Schedule />
                  </div>
                  <div className="footer">
                    <Contact_Us />
                  </div>
                </>
              }
            />
            <Route
              path="/settings"
              element={<Setting_Page onLogout={handleLogout} />}
            />
            <Route path="/event-page" element={<Events_Page />} />
            <Route path="/bible" element={<BiblePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/beliefs" element={<Beliefs />} />
            <Route
              path="/ministries"
              element={<Ministries onLoginClick={handleLoginClick} />}
            />

            {/* Protected Routes */}
            <Route
              path="/user-interface"
              element={
                <ProtectedRoute
                  isLoggedIn={isLoggedIn}
                  handleLoginClick={handleLoginClick}
                  showOverlay={setShowOverlay}
                >
                  <User_Interface />
                </ProtectedRoute>
              }
            />
          </Routes>

          {showOverlay && (
            <div className="overlay">
              <Login_Signup
                type={overlayType}
                onClose={handleClose}
                toggleOverlayType={toggleOverlayType}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
