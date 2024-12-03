import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, handleLoginClick, showOverlay }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Function to check if the user is authenticated via API
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/check-auth",
        {
          withCredentials: true,
        }
      );
      return response.data.isLoggedIn; // API response to indicate login status
    } catch (error) {
      console.error(
        "Error checking auth:",
        error.response ? error.response.data : error.message
      );
      return false; // Default to false if an error occurs
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticatedFromAPI = await checkAuth();

      if (!isAuthenticatedFromAPI) {
        // User is not authenticated, handle login
        handleLoginClick("login"); // Trigger login functionality
        showOverlay(true); // Display overlay if applicable

        // Redirect to the login page or home page
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);

        setLoading(false); // Stop loading after redirect preparation
        return;
      }

      setIsAuthenticated(true); // User is authenticated, allow access
      setLoading(false); // Stop loading
    };

    checkAuthentication();
  }, [navigate, handleLoginClick, showOverlay]);

  // Show a loading spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children components if authenticated
  if (!isAuthenticated) {
    return children;
  }

  // Render null or a fallback UI while redirecting
  return null;
};

export default ProtectedRoute;
