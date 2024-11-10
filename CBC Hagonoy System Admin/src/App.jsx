import "./App.css";
import Header from "./components/header/Header";
import Main_Dashboard from "./pages/main_dashboard/Main_Dashboard";
import Loading from "./components/loadingScreen/Loading";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true); // Trigger fade-out effect
      setTimeout(() => {
        setIsLoading(false); // Hide loading screen after fade-out
      }, 600); // Match the duration of the fadeOut animation (0.5s)
    }, 4000); // Initial loading time before fade-out begins
  }, []);

  return (
    <div className="main_cont">
      {isLoading && <Loading fadeOut={fadeOut} />}
      {!isLoading && (
        <>
          <div className="header">
            <Header />
          </div>
          <div className="dashboard">
            <Main_Dashboard />
          </div>
          {/* Toast notifications */}
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
