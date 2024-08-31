import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './Main_Dashboard.css';
import { menu } from '../../assets/Images';

// Lazy-loaded components
const Admin_Dashboard = React.lazy(() => import('../admin_dashboard/Admin_Dashboard'));
const Announcement_Management = React.lazy(() => import('../announcement_management/Announcement_Management'));
const Record_Monitoring = React.lazy(() => import('../record_monitoring/Record_Monitoring'));

function Main_Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

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
            <Link to="/announcement-management" className="contents_dashboard">
              Announcement Management
            </Link>
            <div className="divider_dashboard_content"></div>
            <Link to="/record-monitoring" className="contents_dashboard">
              Recording Management
            </Link>
            <div className="divider_dashboard_content"></div>
            <Link to="/admin-dashboard" className="contents_dashboard">
              Monitoring and Analytics
            </Link>
            <div className="divider_dashboard_content"></div>
            <Link to="/user-management" className="contents_dashboard">
              User Management
            </Link>
            <div className="divider_dashboard_content"></div>
            <Link to="/communication-tools" className="contents_dashboard">
              Communication Tools
            </Link>
            <div className="divider_dashboard_content"></div>
            <Link to="/audit-trail-logging" className="contents_dashboard">
              Audit Trail and Logging
            </Link>
            <div className="divider_dashboard_content"></div>
          </div>
        </div>
        <div className="right_dashboard_cont">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/announcement-management" element={<Announcement_Management />} />
              <Route path="/record-monitoring" element={<Record_Monitoring />} />
              <Route path="/admin-dashboard" element={<Admin_Dashboard />} />
              {/* Add more routes here as needed */}
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default Main_Dashboard;
