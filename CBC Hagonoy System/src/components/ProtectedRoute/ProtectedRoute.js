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

      // Navigate after showing the login modal
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate, handleLoginClick, showOverlay]);

  // If the user is logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null while redirecting
  return null;
};

export default ProtectedRoute;
