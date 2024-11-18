import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./Main_Dashboard.css";
import {
  menu,
  CT_notSelected,
  CT_selected,
  AM_notSelected,
  AM_selected,
  ATL_notSelected,
  ATL_selected,
  UM_notSelected,
  UM_selected,
  MA_notSelected,
  MA_selected,
  RM_notSelected,
  RM_selected,
  AL_notSelected,
  AL_selected,
} from "../../assets/Images";

// Lazy-loaded components
const Admin_Dashboard = React.lazy(() =>
  import("../admin_dashboard/Admin_Dashboard")
);
const AuditAndTrailing = React.lazy(() =>
  import("../audit_and_trailing/AuditAndTrailing")
);
const Announcement_Management = React.lazy(() =>
  import("../announcement_management/Announcement_Management")
);
const Record_Monitoring = React.lazy(() =>
  import("../record_monitoring/Record_Monitoring")
);
const User_Management = React.lazy(() =>
  import("../user_management/User_Management")
);
const Communication_Tools = React.lazy(() =>
  import("../communication_tools/Communication_Tools")
);
const Announcement_List = React.lazy(() =>
  import("../announcement_list/Announcement_List")
);

function Main_Dashboard() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isActive, setIsActive] = useState("/");

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
        <div
          className={`left_dashboard_cont ${
            isSidebarVisible ? "visible" : "minimized"
          }`}
        >
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
              className={`contents_dashboard ${
                isActive === "/announcement-management" ? "active" : ""
              }`}
              onClick={() => setIsActive("/announcement-management")}
            >
              Announcement Management
            </Link>

            <Link
              to="/record-monitoring"
              className={`contents_dashboard ${
                isActive === "/record-monitoring" ? "active" : ""
              }`}
              onClick={() => setIsActive("/record-monitoring")}
            >
              Recording Management
            </Link>

            <Link
              to="/admin-dashboard"
              className={`contents_dashboard ${
                isActive === "/admin-dashboard" ? "active" : ""
              }`}
              onClick={() => setIsActive("/admin-dashboard")}
            >
              Monitoring and Analytics
            </Link>

            <Link
              to="/user-management"
              className={`contents_dashboard ${
                isActive === "/user-management" ? "active" : ""
              }`}
              onClick={() => setIsActive("/user-management")}
            >
              User Management
            </Link>

            <Link
              to="/communication-tools"
              className={`contents_dashboard ${
                isActive === "/communication-tools" ? "active" : ""
              }`}
              onClick={() => setIsActive("/communication-tools")}
            >
              Communication Tools
            </Link>

            <Link
              to="/audit-trail-logging"
              className={`contents_dashboard ${
                isActive === "/audit-trail-logging" ? "active" : ""
              }`}
              onClick={() => setIsActive("/audit-trail-logging")}
            >
              Audit Trail and Logging
            </Link>

            <Link
              to="/announcement-records"
              className={`contents_dashboard ${
                isActive === "/announcement-records" ? "active" : ""
              }`}
              onClick={() => setIsActive("/announcement-records")}
            >
              Announcement Lists
            </Link>
          </div>
        </div>

        {/* Right side content */}
        <div className="right_dashboard_cont">
          <Suspense
            fallback={
              <div className="loader_container">
                <div className="loader"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/admin-dashboard" />} />{" "}
              {/* Default route */}
              <Route
                path="/announcement-management"
                element={<Announcement_Management />}
              />
              <Route
                path="/record-monitoring"
                element={<Record_Monitoring />}
              />
              <Route path="/admin-dashboard" element={<Admin_Dashboard />} />
              <Route path="/user-management" element={<User_Management />} />
              <Route
                path="/communication-tools"
                element={<Communication_Tools />}
              />
              <Route
                path="/audit-trail-logging"
                element={<AuditAndTrailing />}
              />
              <Route
                path="/announcement-records"
                element={<Announcement_List />}
              />
            </Routes>
          </Suspense>
        </div>

        {/* Conditionally render icon container when sidebar is minimized */}
        {!isSidebarVisible && (
          <div className="icons_container_admin">
            <Link
              className={`dashboard_icon ${
                isActive === "/announcement-management" ? "active" : ""
              }`}
              to="/announcement-management"
              onClick={() => setIsActive("/announcement-management")}
            >
              <img
                src={
                  isActive === "/announcement-management"
                    ? AM_selected
                    : AM_notSelected
                }
                alt="Announcement Icon"
                className="icon"
              />
              <p className="dashboard_label">Announcement Management</p>
            </Link>

            <Link
              to="/record-monitoring"
              className={`dashboard_icon ${
                isActive === "/record-monitoring" ? "active" : ""
              }`}
              onClick={() => setIsActive("/record-monitoring")}
            >
              <img
                src={
                  isActive === "/record-monitoring"
                    ? RM_selected
                    : RM_notSelected
                }
                alt="Record Icon"
                className="icon"
              />
              <p className="dashboard_label">Recording Management</p>
            </Link>

            <Link
              className={`dashboard_icon ${
                isActive === "/admin-dashboard" ? "active" : ""
              }`}
              to="/admin-dashboard"
              onClick={() => setIsActive("/admin-dashboard")}
            >
              <img
                src={
                  isActive === "/admin-dashboard" ? MA_selected : MA_notSelected
                }
                alt="Admin Icon"
                className="icon"
              />
              <p className="dashboard_label">Monitoring and Analytics</p>
            </Link>

            <Link
              className={`dashboard_icon ${
                isActive === "/user-management" ? "active" : ""
              }`}
              to="/user-management"
              onClick={() => setIsActive("/user-management")}
            >
              <img
                src={
                  isActive === "/user-management" ? UM_selected : UM_notSelected
                }
                alt="User Icon"
                className="icon"
              />
              <p className="dashboard_label">User Management</p>
            </Link>
            <Link
              className={`dashboard_icon ${
                isActive === "/communication-tools" ? "active" : ""
              }`}
              to="/communication-tools"
              onClick={() => setIsActive("/communication-tools")}
            >
              <img
                src={
                  isActive === "/communication-tools"
                    ? CT_selected
                    : CT_notSelected
                }
                alt="Communication Icon"
                className="icon"
              />
              <p className="dashboard_label">Communication Tools</p>
            </Link>

            <Link
              className={`dashboard_icon ${
                isActive === "/audit-trail-logging" ? "active" : ""
              }`}
              to="/audit-trail-logging"
              onClick={() => setIsActive("/audit-trail-logging")}
            >
              <img
                src={
                  isActive === "/audit-trail-logging"
                    ? ATL_selected
                    : ATL_notSelected
                }
                alt="Audit Icon"
                className="icon"
              />
              <p className="dashboard_label">Audit Trail and Logging</p>
            </Link>

            <Link
              className={`dashboard_icon ${
                isActive === "/announcement-records" ? "active" : ""
              }`}
              to="/announcement-records"
              onClick={() => setIsActive("/announcement-records")}
            >
              <img
                src={
                  isActive === "/announcement-records"
                    ? AL_selected
                    : AL_notSelected
                }
                alt="Audit Icon"
                className="icon"
              />
              <p className="dashboard_label">Announcement Lists</p>
            </Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default Main_Dashboard;
