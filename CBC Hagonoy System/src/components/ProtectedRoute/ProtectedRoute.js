import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ isLoggedIn, children, showOverlay }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Show overlay when not logged in
      showOverlay();

      // Redirect to home page or login page after a delay if needed
      setTimeout(() => {
        navigate("/", { replace: true }); // This will redirect to the home page (or login)
      }, 500); // Adjust the delay if you want to show the overlay first
    }
  }, [isLoggedIn, navigate, showOverlay]);

  // If logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null temporarily (the redirect will happen)
  return null;
};

export default ProtectedRoute;
