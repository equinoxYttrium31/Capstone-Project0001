import React from 'react'
import { 
    Sunday_Service,
    Prayer_Meeting,
    Fasting
} from '../../assets/Assets'
import './Activity.css'

function Activities() {
  return (
    <div className='activity'>
        <div className='header-container'>
            <h1 className='page-title'>OUR LATEST ACTIVITIES</h1>
            <h3 className='page-subtitle'>Stay connected and be inspired by our recent activities as we journey together in faith and service.</h3>
        </div>
        <div className='cards-container'>
            <div className='event-card'>
                <img src={Prayer_Meeting} alt="event-photo" className='event-photo'/>
                <h5 className='title'>CBC Hagonoy & Malolos Prayer Meeting</h5>
            </div>
            <div className='event-card'>
                <img src={Sunday_Service} alt="event-photo" className='event-photo'/>
                <h5 className='title'>Sunday Worship</h5>
            </div>
            <div className='event-card'>
                <img src={Fasting} alt="event-photo" className='event-photo'/>
                <h5 className='title'>Morning Intercession Prayer with Fasting</h5>
            </div>
        </div>
    </div>
  )
}

export default Activities