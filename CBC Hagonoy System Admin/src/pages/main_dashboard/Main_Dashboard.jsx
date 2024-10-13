import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './Main_Dashboard.css';
import { menu } from '../../assets/Images';

// Lazy-loaded components
const Admin_Dashboard = React.lazy(() => import('../admin_dashboard/Admin_Dashboard'));
const Announcement_Management = React.lazy(() => import('../announcement_management/Announcement_Management'));
const Record_Monitoring = React.lazy(() => import('../record_monitoring/Record_Monitoring'));
const User_Management = React.lazy(() => import('../user_management/User_Management'));


function Main_Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isActive, setIsActive] = useState();
  
  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Automatically set the active link when the URL changes
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  return (
    <Router>
      <div className="dashboard_container_main">
        <div className={`left_dashboard_cont ${isSidebarVisible ? 'visible' : 'minimized'}`}>
          <div className="dashboard_title_left">
            <div className="dashboard_title_text">
                <p className="dashboard_title_p">DASHBOARD</p>
            </div>
            <img
              src={menu}
              alt="Menu"
              className="menu_icon_dashboard"
              onClick={handleSidebarToggle}
            />
          </div>
          <div className="dashboard_contents_left">
            <Link
              to="/announcement-management"
              className={`contents_dashboard ${isActive === '/announcement-management' ? 'active' : ''}`}
              onClick={() => setIsActive('/announcement-management')}>
              Announcement Management
            </Link>
            
            <Link
              to="/record-monitoring"
              className={`contents_dashboard ${isActive === '/record-monitoring' ? 'active' : ''}`}
              onClick={() => setIsActive('/record-monitoring')}>
              Recording Management
            </Link>
            
            <Link
              to="/admin-dashboard"
              className={`contents_dashboard ${isActive === '/admin-dashboard' ? 'active' : ''}`}
              onClick={() => setIsActive('/admin-dashboard')}>
              Monitoring and Analytics
            </Link>
            
            <Link
              to="/user-management"
              className={`contents_dashboard ${isActive === '/user-management' ? 'active' : ''}`}
              onClick={() => setIsActive('/user-management')}>
              User Management
            </Link>
            
            <Link
              to="/communication-tools"
              className={`contents_dashboard ${isActive === '/communication-tools' ? 'active' : ''}`}
              onClick={() => setIsActive('/communication-tools')}>
              Communication Tools
            </Link>
            
            <Link
              to="/audit-trail-logging"
              className={`contents_dashboard ${isActive === '/audit-trail-logging' ? 'active' : ''}`}
              onClick={() => setIsActive('/audit-trail-logging')}>
              Audit Trail and Logging
            </Link>
            
          </div>
        </div>
        <div className="right_dashboard_cont">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Announcement_Management />} /> {/* Default route */}
              <Route path="/announcement-management" element={<Announcement_Management />} />
              <Route path="/record-monitoring" element={<Record_Monitoring />} />
              <Route path="/admin-dashboard" element={<Admin_Dashboard />} />
              <Route path="/user-management" element={<User_Management />} />
            </Routes>
          </Suspense>
        </div>

        <div className="icons_container_admin">
          
        </div>
      </div>
    </Router>
  );
}

export default Main_Dashboard;
