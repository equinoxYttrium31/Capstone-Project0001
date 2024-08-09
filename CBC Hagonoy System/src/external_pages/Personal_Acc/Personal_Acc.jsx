import React, { useState, useEffect } from 'react';
import './Personal_Acc.css';
import { 
    edit_ic,
    user_placeholder
 } from '../../assets/Assets';
import { getCurrentMonth } from '../../Utility Functions/utility_setmonth';
import { getCurrentWeekNumber } from '../../Utility Functions/utility_date';

function Personal_Acc() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentWeek, setCurrentWeek] = useState('');

  useEffect(() => {
    setCurrentMonth(getCurrentMonth());
    setCurrentWeek(getCurrentWeekNumber());
  }, []);

  return (
    <div className='personal_user_acc_main_cont'>
        <div className="personal_title_cont">
            <h2 className='personal_title'>My Personal Record</h2>
        </div>    
        <div className="personal_user_info">
            <div className="personal_img_holder">
                <img src={user_placeholder} alt="user_profile" className="personal_profile_pic" />
            </div>
            <div className="personal_user_info_text">
                <h2 className="personal_user_name">Name</h2>
                <p className="personal_age_gender">age, gender</p>
            </div>
        </div>
        <div className="personal_record_cont">
            <div className="date_edit_container">
                <h4 className="month_text">{currentMonth}</h4> {/* Display current month */}
                <h4 className="week_text">Week {currentWeek}</h4> {/* Display current week number */}
                <img src={edit_ic} alt="edit_icon" className="edit_icon" />
            </div>
            <div className="record_info_checker">
                <div className="left_side_container">
                    <div className="personal_checkboxes_cont">
                        <input type="checkbox" id="Cell_Group" className="personal_checkboxes" />
                        <label htmlFor="Cell_Group" className="personal_checkboxes_label">Cell Group</label>
                    </div>
                    <div className="personal_checkboxes_cont">
                        <input type="checkbox" id="Personal_Devotion" className="personal_checkboxes" />
                        <label htmlFor="Personal_Devotion" className="personal_checkboxes_label">Personal Devotion</label>
                    </div>
                    <div className="personal_checkboxes_cont">
                        <input type="checkbox" id="Family_Devotion" className="personal_checkboxes" />
                        <label htmlFor="Family_Devotion" className="personal_checkboxes_label">Family Devotion</label>
                    </div>
                </div>
                <div className="right_side_container">
                    <div className="personal_checkboxes_cont">
                        <input type="checkbox" id="Prayer_Meeting" className="personal_checkboxes" />
                        <label htmlFor="Prayer_Meeting" className="personal_checkboxes_label">Prayer Meeting</label>
                    </div>
                    <div className="personal_checkboxes_cont">
                        <input type="checkbox" id="Worship_Service" className="personal_checkboxes" />
                        <label htmlFor="Worship_Service" className="personal_checkboxes_label">Worship Service</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Personal_Acc;
