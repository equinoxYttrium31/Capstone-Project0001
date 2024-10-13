import { useState } from 'react';
import User_Chart from '../User_Chart/user_chart';
import Personal_Acc from '../Personal_Acc/Personal_Acc';
import User_NavBar from '../UserNavigationBar/User_NavBar';
import Cellgroup_File from '../Cellgroup_Record_Files/Cellgroup_File';
import Network_Record from '../Network_Record_Files/Network_Record';

import './User_Interface.css';
import { cellgroup_ic, menus, network_ic, personal_ic } from '../../assets/Assets'; // Import your images here

function User_Interface() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeContent, setActiveContent] = useState('Personal'); // Set 'Personal' as the default

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleContentClick = (content) => {
    setActiveContent(content);
  };

  return (
    <div className="user_interface_cont">
      <div className="nav_bar_user">
        <User_NavBar />
      </div>
      <div className="main_user_cont">
        <div className={`user_dashboard_cont ${isSidebarVisible ? '' : 'minimized'}`}>
          <div className="upper_dashboard">
            <p className="dashboard_main_text">DASHBOARD</p>
            <img
              src={menus}
              alt="Menu"
              className="hamburger_menu"
              onClick={handleSidebarToggle}
            />
          </div>

          

          <div className="icon_container">
              <img src={personal_ic} alt="Personal Icon" className="icon_personal_user" />
              <p className="icon_label personal">Personal Account</p>
          </div>
          <div className="icon_container">
              <img src={cellgroup_ic} alt="Cellgroup Icon" className="icon_cellgroup_user" />
              <p className="icon_label cellgroup">Cellgroup Record</p>
          </div>
          <div className="icon_container">
              <img src={network_ic} alt="Network Icon" className="icon_network_user" />
              <p className="icon_label network">Network Monitoring</p>
          </div>

          

          <div className="content_list_dashboard">
            <p
              className={`content_item ${activeContent === 'Personal' ? 'active' : ''}`}
              onClick={() => handleContentClick('Personal')}
            >
                  Personal Record
            </p>

            <p
              className={`content_item ${activeContent === 'Cellgroup' ? 'active' : ''}`}
              onClick={() => handleContentClick('Cellgroup')}
            >
                  Cellgroup Record
            </p>

            <p
              className={`content_item ${activeContent === 'Network' ? 'active' : ''}`}
              onClick={() => handleContentClick('Network')}
            >
                  Network Monitoring
            </p>
          </div>
          <div className="credits_group">
              <p className="credits_text">&copy; 2024 All Rights Reserved.</p>
          </div>  
        </div>
        <div className={`content_display_area ${isSidebarVisible ? '' : 'expanded'}`}>
          {activeContent === 'Network' && (
            <div className="container_network_record active">
              <Network_Record />
            </div>
          )}
          {activeContent === 'Cellgroup' && (
            <div className="container_cellgroup active">
              <Cellgroup_File />
            </div>
          )}
          {activeContent === 'Personal' && (
            <div className="dynamic_container_personal active">
              <Personal_Acc />
              <User_Chart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User_Interface;
