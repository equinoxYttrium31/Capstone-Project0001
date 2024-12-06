const ProtectedRoute = ({
  isLoggedIn,
  children,
  handleLoginClick,
  showOverlay,
}) => {
  if (!isLoggedIn) {
    // Trigger modal actions
    handleLoginClick("login");
    showOverlay(true);

    // Redirect using browser API
    window.location.href = "/";
    return null;
  }

  // Render children if logged in
  return children;
};

export default ProtectedRoute;
