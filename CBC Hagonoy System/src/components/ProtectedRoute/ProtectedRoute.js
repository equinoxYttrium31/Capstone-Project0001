import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
  attendanceID, // Add attendanceID as a prop
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Trigger the modal to show (login or signup)
      handleLoginClick("login"); // You can change this to 'signup' based on your logic
      showOverlay(true); // Make sure overlay is visible

      // Optionally, after a short delay, redirect to the home page or login page
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000); // Adjust delay as necessary
    } else if (attendanceID) {
      // If logged in and attendanceID is present, redirect to the specific URL
      navigate(
        `https://client-2oru.onrender.com/user-interface?attendanceID=${attendanceID}`
      );
    }
  }, [isLoggedIn, attendanceID, navigate, handleLoginClick, showOverlay]);

  // If logged in and no attendanceID, render the children (protected page)
  if (isLoggedIn && !attendanceID) {
    return children;
  }

  // If not logged in or attendanceID is being handled, return null temporarily
  return null;
};

export default ProtectedRoute;
