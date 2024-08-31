import React, { useState } from 'react';
import User_Chart from '../User_Chart/user_chart';
import Personal_Acc from '../Personal_Acc/Personal_Acc';
import User_NavBar from '../UserNavigationBar/User_NavBar';
import Cellgroup_File from '../Cellgroup_Record_Files/Cellgroup_File';
import Network_Record from '../Network_Record_Files/Network_Record';

import './User_Interface.css';
import { menus } from '../../assets/Assets';

function User_Interface() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
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
          <div className="content_list_dashboard">
            <p className="content_item">Personal Record</p>
            <div className="divider"></div>
            <p className="content_item">Cellgroup Record</p>
            <div className="divider"></div>
            <p className="content_item">Network Monitoring</p>
            <div className="divider"></div>
          </div>
        </div>
        <div className={`content_display_area ${isSidebarVisible ? '' : 'expanded'}`}>
          <Network_Record />
          <Cellgroup_File />
          <div className="dynamic_container_personal">
            <Personal_Acc />
            <User_Chart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default User_Interface;
