import { useEffect, useState } from "react";

const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
  authChecked,
}) => {
  useEffect(() => {
    console.log("Auth Checked:", authChecked);
    console.log("Is Logged In:", isLoggedIn);

    if (authChecked && !isLoggedIn) {
      handleLoginClick("login");
      showOverlay(true);
    }
  }, [authChecked, isLoggedIn, handleLoginClick, showOverlay]);

  // Show loading message while checking auth
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // Render children if authenticated
  return isLoggedIn ? children : null;
};

export default ProtectedRoute;
