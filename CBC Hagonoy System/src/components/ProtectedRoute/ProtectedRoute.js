import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children, showOverlay }) => {
  // If the user is not logged in, show the overlay and prevent access to the protected page
  if (!isLoggedIn) {
    showOverlay(); // Trigger the overlay display
    return <Navigate to="/" />; // Optionally redirect to the home page or wherever you'd like
  }

  // If logged in, render the children (protected page)
  return children;
};

export default ProtectedRoute;
