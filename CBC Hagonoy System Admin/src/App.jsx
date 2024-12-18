import "./App.css";
import Header from "./components/header/Header";
import Main_Dashboard from "./pages/main_dashboard/Main_Dashboard";
import Loading from "./components/loadingScreen/Loading";
import AdminNotif from "./components/AdminNotification/AdminNotif";
import AdminLogin from "./components/adminLogin/adminLogin"; // Import AdminLogin
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [toggleNotif, setToggleNotif] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }, 4000);
  }, []);

  // Toggle the notification modal visibility
  const toggleNotification = () => {
    setToggleNotif((prev) => !prev);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="main_cont">
      {isLoading && <Loading fadeOut={fadeOut} />}
      {!isLoading && !isLoggedIn && <AdminLogin onLogin={handleLogin} />}
      {!isLoading && isLoggedIn && (
        <>
          <div className="header">
            <Header toggleNotification={toggleNotification} />
          </div>
          <div className="notif_container">{toggleNotif && <AdminNotif />}</div>
          <div className="dashboard">
            <Main_Dashboard />
          </div>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={3}
            toastOptions={{
              duration: 3000,
              style: {
                zIndex: 9999,
                width: 300,
                height: 70,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
