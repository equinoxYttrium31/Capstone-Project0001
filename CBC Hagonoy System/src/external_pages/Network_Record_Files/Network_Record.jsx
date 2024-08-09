import React, { useState, useEffect } from 'react';
import './Network_Record.css';

function Network_Record() {

  const [progress, setProgress] = useState(50); // Example progress value

  const maleColor = '#36a2eb';
  const femaleColor = '#ffce56';

  return (
    <div className='network_container'>
        <div className="network_toplayer">
          <p className="network_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
          <h3 className="network_title">Network Monitoring</h3>
        </div>
        <div className="network_bottomlayer">
          <div className="network_bottomlayer_leftside">
              <div className="data_container_right">
                <div className="data_info_cont">
                  <p className="data_info_title">Total Members:</p>
                  <h3 className="data_info_count">Count</h3>
                </div>
                <div className="data_info_cont">
                  <p className="data_info_title">Baptized Members</p>
                  <h3 className="data_info_count">Count</h3>
                </div>
              </div>
              <div className="data_container_left">
                <div className="data_info_cont">
                  <p className="data_info_title">Total number of guests:</p>
                  <h3 className="data_info_count">Count</h3>
                </div>
                <div className="data_info_cont">
                  <p className="data_info_title">Cellgroups</p>
                  <h3 className="data_info_count">Count</h3>
                </div>
              </div>
          </div>
          <div className="network_bottomlayer_rightside">
              <div className="network_chart_cont">
                  <div className="net_chart"
                  style={{
                    background: `conic-gradient(
                      ${maleColor} ${progress * 3.6}deg, 
                      ${femaleColor} ${progress * 3.6}deg 360deg)`
                  }}>
                  </div>
              </div>
              <div className="network_chart_labels">
                <div className="net_chart_label">
                  <div className="color_box" style={{ backgroundColor: maleColor }}></div>
                  Male: {progress}%
                </div>
                <div className="net_chart_label">
                   <div className="color_box" style={{ backgroundColor: femaleColor }}></div>
                  Female: {100 - progress}%
                </div>
              </div>
          </div>
        </div>
    </div>
  );
}

export default Network_Record;
