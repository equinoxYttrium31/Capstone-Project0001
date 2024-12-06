import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // To handle cookies

const ProtectedRoute = ({ children, handleLoginClick, showOverlay }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track the authentication state

  // Extract attendanceID from the query parameters
  const searchParams = new URLSearchParams(location.search);
  const attendanceID = searchParams.get("attendanceID");

  useEffect(() => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    console.log("Token:", token);
    console.log("AttendanceID:", attendanceID);

    if (!token) {
      // If no token, user is not logged in
      handleLoginClick("login"); // Trigger login modal
      showOverlay(true); // Show overlay for login/signup

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
      setIsAuthenticated(false); // Update state to reflect the unauthenticated state
    } else if (attendanceID) {
      // If token exists and attendanceID is provided, redirect externally
      console.log("Redirecting to user-interface...");
      window.location.href = `https://client-2oru.onrender.com/user-interface?attendanceID=${attendanceID}`;
    } else {
      setIsAuthenticated(true); // Set authenticated if there's a valid token and no attendanceID
    }
  }, [handleLoginClick, navigate, showOverlay, attendanceID]); // Include attendanceID in the dependency array

  // Conditionally render children based on authentication state
  if (isAuthenticated === null) {
    // Return null while checking authentication
    return null;
  }

  if (isAuthenticated) {
    // If the token exists and no attendanceID is present, render the children (protected page)
    return children;
  }

  // If not authenticated or redirecting, return null
  return null;
};

export default ProtectedRoute;
