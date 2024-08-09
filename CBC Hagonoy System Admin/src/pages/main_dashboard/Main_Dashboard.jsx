import React from 'react'
import './Main_Dashboard.css'
import { menu } from '../../assets/Images'
import Admin_Dashboard from '../admin_dashboard/Admin_Dashboard'
import Announcement_Management from '../announcement_management/Announcement_Management'
import Record_Monitoring from '../record_monitoring/Record_Monitoring'

function Main_Dashboard() {
  return (
    <div className="dashboard_container_main">
        <div className='left_dashboard_cont'>
            <div className="dashboard_title_left">
                <p className="dashboar_title_p">DASHBOARD</p>
                <img src={menu} alt="Menu" className="menu_icon_dashboard" />
            </div>
            <div className="dashboard_contents_left">
                <p className="contents_dashboard">Announcement Management</p>
                <div className="divider_dashboard_content"></div>
                <p className="contents_dashboard">Recording Management</p>
                <div className="divider_dashboard_content"></div>
                <p className="contents_dashboard">Monitoring and Analytics</p>
                <div className="divider_dashboard_content"></div>
                <p className="contents_dashboard">User Management</p>
                <div className="divider_dashboard_content"></div>
                <p className="contents_dashboard">Communication Tools</p>
                <div className="divider_dashboard_content"></div>
                <p className="contents_dashboard">Audit Trail and Logging</p>
                <div className="divider_dashboard_content"></div>
            </div>
        </div>
        <div className="right_dashboard_cont">
            <div className="record_management_tab">
                <Record_Monitoring></Record_Monitoring>
            </div>
            <div className="announcement_management_admin">
                <Announcement_Management></Announcement_Management>
            </div> 
            <div className="admin_dashboard">
                <Admin_Dashboard></Admin_Dashboard>
            </div>
        </div>
    </div>
  )
}

export default Main_Dashboard