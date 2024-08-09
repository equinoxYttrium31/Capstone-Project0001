import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/header/NavBar';
import Hero_Section from './pages/hero/Hero_Section';
import Activities from './pages/activities/Activities';
import Qoutes from './pages/qoutes/Qoutes';
import Schedule from './pages/schedule/Schedule';
import Contact_Us from './components/footer/Contact_Us';
import Login_Signup from './components/login_signup/Login_Signup';

import User_Interface from './external_pages/UserInterface/User_Interface';
import './App.css';

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState('');

  const handleLoginClick = (type) => {
    setOverlayType(type);
    setShowOverlay(true);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setOverlayType('');
  };

  const toggleOverlayType = () => {
    setOverlayType((prevType) => (prevType === 'login' ? 'signup' : 'login'));
  };

  // Effect to lock/unlock scrolling
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showOverlay]);

  return (
    <Router>
      <div className='App'>
        <NavBar onLoginClick={handleLoginClick} />
        <Routes>
          <Route path="/" element={
            <>
              <div className='herosection'>
                <Hero_Section />
              </div>
              <div className='activity'>
                <Activities />
              </div>
              <div className='qoutesection'>
                <Qoutes />
              </div>
              <div className='schedules'>
                <Schedule />
              </div>
              <div className="footer">
                <Contact_Us />
              </div>
              <div className='testing_of_external_page'>
                  <User_Interface/>
              </div>
            </>
          } />
        </Routes>

        {/* Overlay Component */}
        {showOverlay && (
          <div className='overlay'>
            <Login_Signup type={overlayType} onClose={handleClose} toggleOverlayType={toggleOverlayType} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
