import { useEffect } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
}) => {
  useEffect(() => {
    if (!isLoggedIn) {
      // Trigger the modal to show (login or signup)
      handleLoginClick("login"); // You can change this to 'signup' based on your logic
      showOverlay(true); // Make sure overlay is visible
    }
  }, [isLoggedIn, handleLoginClick, showOverlay]);

  // If the user is logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null while redirecting
  return null;
};

export default ProtectedRoute;
