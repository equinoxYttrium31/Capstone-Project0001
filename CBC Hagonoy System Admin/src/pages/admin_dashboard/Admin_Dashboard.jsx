import React, { useState } from 'react';
import CustomCalendar from '../../components/CustomCalendar/customCalendar';
import './Admin_Dashboard.css';

function Admin_Dashboard() {
    return (
        <div className='admin_dashboard_main_container'>
            <div className="left_container_adminDash">
                <div className="left_container_upper">
                    <p className="church_name_admin">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
                    <h2 className="admin_title">Admin Dashboard</h2>
                </div>
                <div className="welcome_container">
                    <p className="welcome_text_admin">Welcome back,</p>
                    <p className="user_text_admin">Pastor</p>
                </div>
                <div className="left_container_lower">
                    <div className="lower_container_top">
                        <div className="content_container_top">
                            <p className="content_header_admin">Total Members: </p>
                            <h2 className="count_content_admin">Count</h2>
                        </div>
                        <div className="content_container_top">
                            <p className="content_header_admin">Total number of guests: </p>
                            <h2 className="count_content_admin">Count</h2>
                        </div>
                    </div>
                    <div className="lower_container_low">
                        <div className="content_container_top">
                            <p className="content_header_admin">Baptized Members: </p>
                            <h2 className="count_content_admin">Count</h2>
                        </div>
                        <div className="content_container_top">
                            <p className="content_header_admin">Cellgroups: </p>
                            <h2 className="count_content_admin">Count</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right_container_adminDash">
                <div className="right_top_container">
                    <CustomCalendar></CustomCalendar>
                </div>
                <div className="right_bot_container">
                    <h2 className="event_header_admin">Upcoming Events...</h2>
                    <div className="events_holder_scroll">
                        <div className="event_content_admin">
                            <h4 className="event_title_admin">Event Title0</h4>
                            <p className="event_details_admin">deets</p>
                        </div>
                        <div className="event_content_admin">
                            <h4 className="event_title_admin">Event Title1</h4>
                            <p className="event_details_admin">deets</p>
                        </div>
                        <div className="event_content_admin">
                            <h4 className="event_title_admin">Event Title2</h4>
                            <p className="event_details_admin">deets</p>
                        </div>
                        <div className="event_content_admin">
                            <h4 className="event_title_admin">Event Title3</h4>
                            <p className="event_details_admin">deets</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin_Dashboard;
