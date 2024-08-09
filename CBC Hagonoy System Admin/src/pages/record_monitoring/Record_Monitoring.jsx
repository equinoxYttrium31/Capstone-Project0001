import React from 'react'
import './Record_Monitoring.css'
import { search_ic, filter_ic } from '../../assets/Images'

function Record_Monitoring() {
  return (
    <div className='record_monitoring_mainCont'>
        <div className="record_upper_part">
            <div className="record_header_cont">
                <p className="church_name_record">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
                <h2 className="record_monitor_title">Recording Management</h2>
            </div>
            <div className="search_record">
                <div className="search_bar_cont">
                    <input type="text" name="search" id="search_record" className='search_record'/>
                    <img src={search_ic} alt="search_icon" className="search_record_icon" />
                </div>
                <img src={filter_ic} alt="filter_icon" className="filter_record_icon" />
            </div>
        </div>

        <div className="record_lower_part">

        </div>
    </div>
  )
}

export default Record_Monitoring