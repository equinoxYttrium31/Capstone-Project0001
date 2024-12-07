import { useEffect, useState } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
  authChecked,
}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("Auth Checked:", authChecked);
    console.log("Is Logged In:", isLoggedIn);

    if (authChecked) {
      setIsCheckingAuth(false);
      if (!isLoggedIn) {
        handleLoginClick("login");
        showOverlay(true);
      }
    }
  }, [authChecked, isLoggedIn, handleLoginClick, showOverlay]);

  // Show a loading indicator while authentication status is being checked
  if (isCheckingAuth) {
    return <div>Loading...</div>; // Replace with your actual loading component or skeleton UI
  }

  // Render children if the user is authenticated
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, return null (overlay handles redirection)
  return null;
};

export default ProtectedRoute;
