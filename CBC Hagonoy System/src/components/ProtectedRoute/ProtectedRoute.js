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
      // Wait for the auth check to complete in the parent component
      setIsCheckingAuth(false);
    };

    checkAuthStatus();
  }, []);

  // Show a loading indicator while checking authentication
  if (isCheckingAuth) {
    return <div>Loading...</div>; // Replace with your actual loading component or skeleton UI
  }

  // If the user is logged in, render the children (protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, trigger the login overlay
  useEffect(() => {
    if (!isLoggedIn) {
      handleLoginClick("login");
      showOverlay(true);
    }
  }, [isLoggedIn, handleLoginClick, showOverlay]);

  // If not logged in, return null while redirecting
  return null;
};

export default ProtectedRoute;
