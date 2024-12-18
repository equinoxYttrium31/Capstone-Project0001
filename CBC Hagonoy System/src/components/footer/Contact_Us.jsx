import { header_footer, facebook_icon_dark } from "../../assets/Assets";
import "./Contact_Us.css";

function Contact_Us() {
  return (
    <div className="footer_container">
      <div className="header-img">
        <img src={header_footer} alt="blue_header" className="header-image" />
      </div>
      <div className="footer-contact">
        <div className="header-title">
          <h1 className="contactUs-title">Contact Us</h1>
        </div>
        <div className="deets-container">
          <div className="address-bar">
            <div className="adress">
              <p className="address-text">
                Molave Street, MQH, San Sebastian, Hagonoy, Philippines, 3002
              </p>
            </div>
          </div>
          <div className="contact_details_cont">
            <div className="contact-numbers">
              <a href="tel:" className="tel-num">
                Telephone: <span>(+44) 8123-4567</span>
              </a>
              <a href="tel:09557007745" className="cell-num">
                Mobile: <span>(+63)955-700-7745</span>
              </a>
            </div>
            <div className="email_address_footer">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:johnmarkflameno@gmail.com"
                className="email-text"
              >
                johnmarkflameno@gmail.com
              </a>
            </div>
          </div>
          <div className="office-hours">
            <h3>Parish Office Hours</h3>
            <p>
              <b>Monday:</b> Closed
            </p>
            <p>
              <b>Tuesday:</b> 8:00am – 5:00pm
            </p>
            <p>
              <b>Wednesday:</b> 8:00am – 5:00pm
            </p>
            <p>
              <b>Thursday:</b> 8:00am – 12:00nn
            </p>
            <p>
              <b>Friday:</b> 8:00am – 5:00pm
            </p>
            <p>
              <b>Saturday:</b> 8:00am – 7:00pm
            </p>
            <p>
              <b>Sunday:</b> 7:00am – 7:00pm
            </p>
          </div>
          <div className="social-bar">
            <h3>Social</h3>
            <div className="icon-container">
              <img
                src={facebook_icon_dark}
                alt="facebook-icon"
                className="facebook"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact_Us;
