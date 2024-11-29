import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
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

import "./App.css";

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true); // Trigger fade-out effect
      setTimeout(() => {
        setIsLoading(false); // Hide loading screen after fade-out
      }, 600); // Match the duration of the fadeOut animation (0.5s)
    }, 4000); // Initial loading time before fade-out begins
  }, []);

  // Function to toggle the menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/check-auth",
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error(
          "Error checking auth:",
          error.response ? error.response.data : error.message
        );
        // Handle unauthorized error
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated");
          setIsLoggedIn(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Effect to lock/unlock scrolling
  useEffect(() => {
    document.body.style.overflow =
      showOverlay || isLoggedIn ? "hidden" : "auto";
  }, [showOverlay, isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowOverlay(false);
    navigate("/user-interface"); // Redirect to user interface page
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://capstone-project0001-2.onrender.com//logout",
        {},
        { withCredentials: true }
      );
      document.cookie = "token=; Max-Age=0"; // Clear the token
      setIsLoggedIn(false); // Set isLoggedIn to false
      document.body.style.overflow = "auto"; // Re-enable scrolling after logout
      navigate("/"); // Redirect to the landing page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="App">
      {/* Toast notifications */}
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
          {/* Conditionally render either the NavBar or User_NavBar */}
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

            <Route path="/user-interface" element={<User_Interface />} />
          </Routes>

          {/* Login/signup overlay */}
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
