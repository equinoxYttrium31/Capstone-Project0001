import { useEffect, useState } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Simulate an auth check delay
      setTimeout(() => {
        setIsCheckingAuth(false);
        if (!isLoggedIn) {
          handleLoginClick("login");
          showOverlay(true);
        }
      }, 500); // Replace with real auth check logic
    };

    checkAuthStatus();
  }, [isLoggedIn, handleLoginClick, showOverlay]);

  // Show a loading indicator while checking authentication
  if (isCheckingAuth) {
    return <div>Loading...</div>; // Replace with your actual loading component or skeleton UI
  }

  // If the user is logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null while redirecting
  return null;
};

export default ProtectedRoute;
