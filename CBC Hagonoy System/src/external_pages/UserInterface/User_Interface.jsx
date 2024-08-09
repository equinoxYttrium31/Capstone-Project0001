import React from 'react'
import User_Chart from '../User_Chart/user_chart'
import Personal_Acc from '../Personal_Acc/Personal_Acc'
import User_NavBar from '../UserNavigationBar/User_NavBar'
import Cellgroup_File from '../Cellgroup_Record_Files/Cellgroup_File'
import Network_Record from '../Network_Record_Files/Network_Record'

import './User_Interface.css'
import {
    menus
} from '../../assets/Assets'

function User_Interface() {
  return (
    <div className='user_interface_cont'>
        <div className="nav_bar_user">
            <User_NavBar/>
        </div>
        <div className="main_user_cont">
            <div className='user_dashboard_cont'>
                <div className="upper_dashboard">
                    <p className="dashboard_main_text">DASHBOARD</p>
                    <img src={menus} alt="hamburger_menu" className="hamburger_menu" />
                </div>
                <div className="content_list_dashboard">
                    <p className="personal_record">Personal Record</p>
                    <div className="divider"></div>
                    <p className="cellgroup_record">Cellgroup Record</p>
                    <div className="divider"></div>
                    <p className="network_monitoring">Network Monitoring</p>
                    <div className="divider"></div>
                </div>
            </div>
            <div className="container_network_record">
                <Network_Record></Network_Record>
            </div>
            <div className="container_cellgroup">
                <Cellgroup_File></Cellgroup_File>
            </div>
            <div className="dynamic_container_personal">
                <div className='user_personal_cont'>
                    <Personal_Acc/>
                </div>
                <div className='user_chart_cont'>
                    <User_Chart/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default User_Interface
