import "./App.css";
import Header from "./components/header/Header";
import Main_Dashboard from "./pages/main_dashboard/Main_Dashboard";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Always hide overflow
    return () => {
      document.body.style.overflow = "auto"; // Cleanup to reset overflow when the component unmounts
    };
  }, []);

  return (
    <div className="main_cont">
      <div className="header">
        <Header></Header>
      </div>
      <div className="dashboard">
        <Main_Dashboard></Main_Dashboard>
      </div>
      {/* Toast notifications */}
      <Toaster
        position="top-center" // Use this and custom CSS to manage the vertical position
        reverseOrder={false}
        gutter={3}
        toastOptions={{
          duration: 2000,
          style: {
            zIndex: 9999,
            width: 550,
            height: 300,

            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Center horizontally and vertically
          },
        }}
      />
    </div>
  );
}

export default App;
