import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, handleLoginClick, showOverlay }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if the user is authenticated via API
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/check-auth",
        {
          withCredentials: true,
        }
      );
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

      if (!isAuthenticatedFromAPI) {
        // User is not authenticated, handle login
        handleLoginClick("login");
        showOverlay(true);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuthentication();
  }, [navigate, handleLoginClick, showOverlay]);

  // If authenticated, render the children components
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, temporarily render null
  return null;
};

export default ProtectedRoute;
