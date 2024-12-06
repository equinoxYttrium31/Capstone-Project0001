import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie"; // To handle cookies

const ProtectedRoute = ({ children, handleLoginClick, showOverlay }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract attendanceID from the query parameters
  const searchParams = new URLSearchParams(location.search);
  const attendanceID = searchParams.get("attendanceID");

  useEffect(() => {
    const token = Cookies.get("token"); // Retrieve token from cookies

    if (!token) {
      // If no token, user is not logged in
      handleLoginClick("login"); // Trigger login modal
      showOverlay(true); // Show overlay for login/signup

      // Redirect to home after a delay
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000); // Adjust delay as necessary
    } else if (attendanceID) {
      // If token exists and attendanceID is provided, redirect
      navigate(
        `https://client-2oru.onrender.com/user-interface?attendanceID=${attendanceID}`
      );
    }
  }, [attendanceID, handleLoginClick, navigate, showOverlay]);

  // If the token exists but no attendanceID, render the children (protected page)
  const token = Cookies.get("token");
  if (token && !attendanceID) {
    return children;
  }

  // If the login state is being handled or redirecting, return null
  return null;
};

export default ProtectedRoute;
