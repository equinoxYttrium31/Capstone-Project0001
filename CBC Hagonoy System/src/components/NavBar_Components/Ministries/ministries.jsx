import "./ministries.css";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { ideals_bg } from "../../../assets/Assets";
import {
  contactUs_image_call,
  denomination_header,
  image_four,
  image_one,
  image_three,
  image_two,
  joinUs_image_call,
  prayer_ic,
  service_image_call,
} from "../../../assets/Church_Images/church_images";
import Contact_Us from "../../footer/Contact_Us";

export default function Ministries({ onLoginClick }) {
  const navigate = useNavigate();
  const targetRef = useRef(null); // Create a reference for the target div

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleScheduleScroll = () => {
    window.scrollTo({ top: 2300, behavior: "smooth" });
    setTimeout(() => {
      handleNavigation("/");
    }, 100);
  };

  const handleScrollToDiv = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

  const handleScrollToFooter = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to the div smoothly
    }
  };

  const handleGetInvolvedClick = () => {
    handleScrollToDiv(); // Scroll to the top first
    setTimeout(() => {
      onLoginClick("signup"); // Show the signup modal after scrolling
    }, 700); // Adjust the delay as needed to ensure scrolling completes
  };

  //Prayer Request Functions
  const [valueName, setValueName] = useState();
  const [valuePrayer, setValuePrayer] = useState();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setValueName(value);
    } else if (name === "prayer") {
      setValuePrayer(value);
    }
  };

  const resetForm = () => {
    setValueName("");
    setValuePrayer("");
  };

  const submitPrayer = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/send-prayer", {
        name: valueName,
        prayer: valuePrayer,
      });

      if (response.status === 201) {
        toast.success("Prayer Request Sent Successfully");
        console.log("Prayer Sent");
        resetForm();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="ministries_main_container">
      <div className="ministries_header_container">
        <img
          src={ideals_bg}
          alt="ministries header"
          className="ministries_header_image"
        />
      </div>

      {/** Commitment to Community */}
      <div className="commitment_to_community_container">
        <h2 className="commitment_to_community_header">
          Commitment to Community
        </h2>
        <div className="gallery_on_scatter">
          <div className="image-container">
            <img src={image_one} alt="Image 1" className="image-item" />
          </div>
          <div className="image-container">
            <img src={image_two} alt="Image 2" className="image-item" />
          </div>
          <div className="image-container">
            <img src={image_three} alt="Image 3" className="image-item" />
          </div>
          <div className="image-container">
            <img src={image_four} alt="Image 4" className="image-item" />
          </div>
        </div>
        <p className="commitment_to_community_context">
          We are committed to making a difference in the lives of others.
          Through our outreach efforts, missions work, and service projects, we
          aim to meet the practical and spiritual needs of our local and global
          communities.
        </p>
      </div>

      {/** Church Denomination */}
      <div className="church_denomination_container">
        <img
          src={denomination_header}
          alt="denomination_header"
          className="church_denomination_image"
        />
        <h2 className="church_denomination_header">Church Denomination</h2>
        <p className="church_denomination_context">
          Christian Bible Church of Hagonoy is proudly affiliated with the
          Baptist denomination. Rooted in the evangelical tradition, we embrace
          the principles of believer&apos;s baptism and congregational autonomy.
        </p>
      </div>

      {/** Call to Action */}
      <div className="call_to_action_container">
        <h1 className="call_to_action_header">
          Join us for worship, fellowship, and growth
        </h1>
        <div className="cta-card-container">
          <div className="cta-card card-one">
            <img
              src={service_image_call}
              alt="Attend a Service"
              className="cta-card-image"
            />
            <div className="cta-card-overlay">
              <h3 className="cta-title">Attend a Service</h3>
              <p>Experience our vibrant worship and community.</p>
              <button className="cta-button" onClick={handleScheduleScroll}>
                Learn More
              </button>
            </div>
          </div>
          <div className="cta-card card-two">
            <img
              src={joinUs_image_call}
              alt="Join Us"
              className="cta-card-image"
            />
            <div className="cta-card-overlay">
              <h3 className="cta-title">Join Us!</h3>
              <p>Deepen your faith and relationships.</p>
              <button
                onClick={handleGetInvolvedClick} // Update to call the new handler
                className="cta-button"
              >
                Get Involved
              </button>
            </div>
          </div>
          <div className="cta-card card-three">
            <img
              src={contactUs_image_call}
              alt="Contact Us"
              className="cta-card-image"
            />
            <div className="cta-card-overlay">
              <h3 className="cta-title">Contact Us</h3>
              <p>Learn more about our ministries.</p>
              <button className="cta-button" onClick={handleScrollToFooter}>
                Reach Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/** Prayer Requests */}
      <div className="prayer_request_container">
        <div className="prayer_request_form_main">
          <div className="prayer_request_form_header">
            <h1 className="form_header_mainText">Prayer Request</h1>
            <h4 className="form_header_subText">
              We are pleased to join you in prayer for specific needs.
            </h4>
          </div>
          <div className="prayer_main_div">
            <div className="image_holder_prayer">
              <img
                src={prayer_ic}
                alt="Prayer_request_icon"
                className="prayer_side_image"
              />
            </div>
            <div className="main_form_prayer">
              <div className="name_form_prayer">
                <label className="name_form_label">Name: </label>
                <input
                  name="name"
                  value={valueName}
                  type="text"
                  onChange={handleOnchange}
                  className="name_form_input"
                  placeholder="First Name, Last Name..."
                />
              </div>
              <div className="prayer_form_prayer">
                <label className="prayer_form_label">Prayer:</label>
                <textarea
                  placeholder="Prayer Request..."
                  name="prayer"
                  value={valuePrayer}
                  onChange={handleOnchange}
                ></textarea>
              </div>
              <div className="button_holder_prayer">
                <button className="submit_prayer" onClick={submitPrayer}>
                  Submit Prayer
                </button>
              </div>
            </div>
          </div>
          <div className="footer_form_prayer">
            <p className="footer_form_text">
              <b>
                And Jesus said to him, “&apos;If you can&apos;! All things are
                possible for one who believes.”
              </b>{" "}
              Mark 9:23
            </p>
          </div>
        </div>
      </div>

      {/**Footer */}
      <div className="footer_ministry_container" ref={targetRef}>
        <Contact_Us />
      </div>
    </div>
  );
}

Ministries.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
};
