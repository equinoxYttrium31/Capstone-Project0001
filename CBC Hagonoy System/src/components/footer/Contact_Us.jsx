import React from 'react'
import { header_footer, facebook_icon_dark, twitter_icon_dark, instagram_icon_dark } from '../../assets/Assets'
import './Contact_Us.css'

function Contact_Us() {
  return (
    <div className='footer_container'>
        <div className='header-img'>
            <img src={header_footer} alt="blue_header" className="header-image" />
        </div>
        <div className="footer-contact">
            <div className='header-title'>
                <h1 className="contactUs-title">Contact Us</h1>
            </div>
            <div className='deets-container'>
                <div className="address-bar">
                    <div className="adress">
                        <p className="address-text">
                            Molave Street, MQH, San Sebastian, Hagonoy, Philippines, 3002
                        </p>
                    </div>
                    <div className="contact-numbers">
                        <p className="tel-num">
                            Telephone: (123) 456-7890
                        </p>
                        <p className="cell-num">
                            Mobile: (123) 456-7890
                        </p>
                    </div>
                    <div className="email_address_footer">
                        <p className="email-text">
                            hello@reallygreatsite.com
                        </p>
                    </div>
                </div>
                <div className="office-hours">
                    <h3>Parish Office Hours</h3>
                    <p>Monday: Closed</p>
                    <p>Tuesday: 8am – 5pm</p>
                    <p>Wednesday: 8am – 5pm</p>
                    <p>Thursday: 8am – 12nn</p>
                    <p>Friday: 8am – 5pm</p>
                    <p>Saturday: 8am – 7pm</p>
                    <p>Sunday: 7am – 7pm</p>
                </div>
                <div className="social-bar">
                    <h3>Social</h3>
                    <div className="icon-container">
                        <img src={facebook_icon_dark} alt="facebook-icon" className="facebook" />
                        <img src={twitter_icon_dark} alt="x-icon" className="x" />
                        <img src={instagram_icon_dark} alt="instagram-icon" className="instagram" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact_Us