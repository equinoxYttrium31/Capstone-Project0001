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
      console.log("Auth response:", response.data); // Log the API response
      return response.data.isLoggedIn; // API response to indicate login status
    } catch (error) {
      console.error(
        "Error checking auth:",
        error.response ? error.response.data : error.message
      );
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticatedFromAPI = await checkAuth();
      console.log("Is user authenticated from API:", isAuthenticatedFromAPI);

      if (!isAuthenticatedFromAPI) {
        // User is not authenticated, handle login
        handleLoginClick("login");
        showOverlay(true);

        // Ensure navigation happens only after the check
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        setLoading(false); // Stop loading after redirect preparation
        return;
      }

      // User is authenticated, allow access
      setIsAuthenticated(true);
      setLoading(false); // Stop loading
    };

    checkAuthentication();
  }, [navigate, handleLoginClick, showOverlay]);

  // Show a loading spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, render the children components
  if (!isAuthenticated) {
    console.log("User is authenticated, rendering children.");
    return children;
  }

  // If not authenticated, render null
  console.log("User is not authenticated, rendering null.");
  return null;
};

export default ProtectedRoute;
