import React from 'react'
import './User_NavBar.css'
import { 
    cbc_logo, 
    account_icon_light, 
    setting_ic_light,
    notif_ic_light} from '../../assets/Assets'

function User_NavBar() {
  return (
    <div className='nav_bar_cont'>
        <div className="main_cont_nav">
            <div className="left_side_nav">
                <img src={cbc_logo} alt="cbc_logo" className="user_nav_logo" />
            </div>
            <div className="right_side_nav">
                <div className="user_nav_links">
                    <ul className="user_nav_links_contents">
                        <li>About Us</li>
                        <li>Beliefs</li>
                        <li>Ministerial</li>
                        <li>Bible</li>
                    </ul>
                </div>
                <div className="user_nav_icons">
                    <img src={notif_ic_light} alt="notification_bell" className="user_nav_notification_bell" />
                    <img src={account_icon_light} alt="user_profile_picture" className="user_nav_profile" />
                    <img src={setting_ic_light} alt="settings_icon" className="user_nav_settings" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default User_NavBar