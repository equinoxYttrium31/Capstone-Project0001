import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, handleLoginClick, showOverlay }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check if the user is authenticated via API
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/check-auth",
        {
          withCredentials: true, // Ensure the request sends cookies with credentials
        }
      );
      console.log("Auth response:", response.data); // Log the API response
      return response.data.isLoggedIn;
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
        // If user is not authenticated, handle login logic
        handleLoginClick("login"); // Trigger login popup/dialog
        showOverlay(true); // Show the overlay for login
        setLoading(false); // Stop loading once the redirect is prepared
        navigate("/", { replace: true }); // Redirect to the home or login page
        return;
      }

      // If authenticated, set the state to allow access to the children
      setIsAuthenticated(true);
      setLoading(false); // Stop loading
    };

    checkAuthentication();
  }, [navigate, handleLoginClick, showOverlay]);

  // If the component is still loading, show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the children components if authenticated
  if (isAuthenticated) {
    console.log("User is authenticated, rendering children.");
    return children;
  }

  // If not authenticated, return null or a fallback UI
  console.log("User is not authenticated, rendering null.");
  return null;
};

export default ProtectedRoute;
