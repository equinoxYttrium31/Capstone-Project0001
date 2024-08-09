import React from 'react'
import { filter_ic, search_ic, user_placeholder } from '../../assets/Assets'
import './Cellgroup_File.css'

function Cellgroup_File() {
  return (
    <div className='cellgroup_main_cont'>
      <div className="cellgroup_toplayer_cont">
        <div className="cellgroup_title_cont">
            <p className="cellgroup_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
            <h3 className="cellgroup_title">Cellgroup Records</h3>
        </div>
        <div className="search_and_menu_cont">
            <input type="text" className="search_cellgroup" placeholder='search...' />
            <img src={search_ic} alt="search_ic" className="search_ic" />
            <img src={filter_ic} alt="filter_ic" className="filter_ic" />
        </div>
      </div>
      <div className="cellgroup_bottomlayer_cont">
          <div className="cellgroup_bottomlayer_cont_rows">
            <div className="cellgroup_member_cont">
              <div className="cellgroup_member_profpic">
                <img src={user_placeholder} alt="member_photo" className="member_prof_pic" />
              </div>
              <div className="cellgroup_member_info">
                <h4 className="cellgroup_member_name">Name</h4>
                <div className="age_and_gender">
                  <p className="cellgroup_member_age">age</p>
                  <p className="cellgroup_member_coma">,</p>
                  <p className="cellgroup_member_gender">gender</p>
                </div>
                <div className="cellgroup_member_class_container">
                  <p className="cellgroup_member_class">Member</p>
                </div>
              </div>
          </div>

          <div className="cellgroup_member_cont">
              <div className="cellgroup_member_profpic">
                <img src={user_placeholder} alt="member_photo" className="member_prof_pic" />
              </div>
              <div className="cellgroup_member_info">
                <h4 className="cellgroup_member_name">Name</h4>
                <div className="age_and_gender">
                  <p className="cellgroup_member_age">age</p>
                  <p className="cellgroup_member_coma">,</p>
                  <p className="cellgroup_member_gender">gender</p>
                </div>
                <div className="cellgroup_member_class_container">
                  <p className="cellgroup_member_class">Member</p>
                </div>
              </div>
          </div>

          <div className="cellgroup_member_cont">
              <div className="cellgroup_member_profpic">
                <img src={user_placeholder} alt="member_photo" className="member_prof_pic" />
              </div>
              <div className="cellgroup_member_info">
                <h4 className="cellgroup_member_name">Name</h4>
                <div className="age_and_gender">
                  <p className="cellgroup_member_age">age</p>
                  <p className="cellgroup_member_coma">,</p>
                  <p className="cellgroup_member_gender">gender</p>
                </div>
                <div className="cellgroup_member_class_container">
                  <p className="cellgroup_member_class">Member</p>
                </div>
              </div>
          </div>
          </div>
      </div>
    </div>
  )
}

export default Cellgroup_File