import React from 'react';
import './Record_Monitoring.css';
import { search_ic, filter_ic, user_placeholder, add_ic, archived_ic, delete_ic} from '../../assets/Images';
import { groupCards } from '../../components/Utility Functions/layoutUtility.js';  // Import the utility function

function Record_Monitoring() {
  // Simulating an array of records for example
  const records = Array(10).fill({
    name: "Name",
    ageGender: "Age, Gender",
    type: "Member",
    profilePic: user_placeholder
  });

  const groupedRecords = groupCards(records, 3); // Grouping the records into rows of 3

  return (
    <div className='record_monitoring_mainCont'>
        <div className="record_upper_part">
            <div className="record_header_cont">
                <p className="church_name_record">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
                <h2 className="record_monitor_title">Recording Management</h2>
            </div>
            <div className="search_record">
                <div className="search_bar_cont">
                    <input type="text" name="search" id="search_record" className='search_record_input'/>
                    <img src={search_ic} alt="search_icon" className="search_record_icon" />
                </div>
                <img src={filter_ic} alt="filter_icon" className="filter_record_icon" />
            </div>
        </div>
        <div className="record_lower_part">
            <div className="record_lower_part_left">
              {groupedRecords.map((group, index) => (
                <div className="record_row" key={index}>
                  {group.map((record, idx) => (
                    <div className="record_content_card" key={idx}>
                      <img src={record.profilePic} alt="profile_picture" className='record_container_profile'/>
                      <div className="record_content_card_deets">
                        <h2 className="record_person_name">{record.name}</h2>
                        <p className="record_person_age_and_gender">{record.ageGender}</p>
                        <div className="record_person_type">
                          <h2 className="record_type_text">{record.type}</h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="divider_lower"></div>
            <div className="record_lower_part_right">
               <div className="selection_container_record">
                  <img src={add_ic} alt="add_record_ic" className="selection_icon" />
                  <h2 className="selection_title">Create New Record</h2>
               </div>
               <div className="selection_container_record">
                  <img src={add_ic} alt="add_cell_group_ic" className="selection_icon" />
                  <h2 className="selection_title">Add New Cell Group</h2>
               </div>
               <div className="selection_container_record">
                  <img src={archived_ic} alt="archive_records_ic" className="selection_icon" />
                  <h2 className="selection_title">Archived Records</h2>
               </div>
               <div className="selection_container_record">
                  <img src={delete_ic} alt="delete_record_ic" className="selection_icon" />
                  <h2 className="selection_title">Deleted Records</h2>
               </div>
            </div>
        </div>
    </div>
  );
}

export default Record_Monitoring;
