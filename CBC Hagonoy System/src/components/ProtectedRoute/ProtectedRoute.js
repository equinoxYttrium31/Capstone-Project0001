import { useNavigate, useEffect } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
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
    }
  }, [isLoggedIn, navigate, handleLoginClick, showOverlay]);

  // If logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null temporarily (the redirect will happen)
  return null;
};

export default ProtectedRoute;
