import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    // Check if the token exists in the cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ey"));
    return token ? true : false;
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthenticatedFromCookies = checkAuth();

      if (!isAuthenticatedFromCookies) {
        // If no token, redirect to the login page
        navigate("/", { replace: true });
        return;
      }

      // If the token exists, assume the user is authenticated
      setIsAuthenticated(true);
      setLoading(false); // Stop loading
    };

    checkAuthentication();
  }, [navigate]);

  // If the component is still loading, show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children components if authenticated
  if (isAuthenticated) {
    return children;
  }

  // Return null if not authenticated
  return null;
};

export default ProtectedRoute;
