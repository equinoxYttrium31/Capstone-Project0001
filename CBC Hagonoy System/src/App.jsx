import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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

import "./App.css";

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initial loading animation
  useEffect(() => {
    const initLoading = setTimeout(() => {
      setFadeOut(true);
      const finishLoading = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(finishLoading);
    }, 4000);
    return () => clearTimeout(initLoading);
  }, []);

  // Check if we need to show the login modal
  useEffect(() => {
    if (location.state?.showLoginModal) {
      setOverlayType("login");
      setShowOverlay(true);
      // Clear the state after triggering modal
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Check for attendanceID in the URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const attendanceID = searchParams.get("attendanceID");

    if (attendanceID) {
      navigate(`/user-interface?attendanceID=${attendanceID}`);
    }
  }, [location, navigate]);

  // Toggle the mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Handle login overlay
  const handleLoginClick = (type) => {
    setMenuOpen(false);
    setOverlayType(type);
    setShowOverlay(true);
  };

  const handleClose = () => setShowOverlay(false);

  const toggleOverlayType = () =>
    setOverlayType((prevType) => (prevType === "login" ? "signup" : "login"));

  // Check authentication on app load or refresh
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token"); // Assuming 'token' is the cookie name
      console.log("Token from cookies:", token);

      if (token) {
        try {
          const response = await axios
            .get("https://capstone-project0001-2.onrender.com/check-auth", {
              headers: {
                Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
              },
            })
            .then((response) => {
              console.log("Auth check response:", response);
              setIsLoggedIn(response.data.isLoggedIn);
            })
            .catch((error) => {
              console.error("Auth check error:", error);
              setIsLoggedIn(false);
            });

          console.log("Auth check response:", response.data); // Log the response from server

          // Check if the response is correct
          setIsLoggedIn(response.data.isLoggedIn || false);
        } catch (error) {
          console.error("Error checking auth:", error.message);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false); // If there's no token, set logged in status to false
      }

      setAuthChecked(true); // Set authChecked to true after checking auth
      setIsLoading(false); // Stop loading once check is complete
    };

    checkAuth();
  }, []);

  // Prevent scrolling when overlay is visible
  useEffect(() => {
    document.body.style.overflow = showOverlay ? "hidden" : "auto";
  }, [showOverlay]);

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
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <>
                  <Hero_Section />
                  <Activities />
                  <Qoutes />
                  <Schedule />
                  <Contact_Us />
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
