import { intro_bg } from "../../../assets/Assets";
import {
  discipleship_ic,
  faith_ic,
  History_Photo,
  integrity_ic,
  Intro_Photo,
  love_ic,
  mission_header,
  Pastor_Ike,
  pastora_gigi,
  services_ic,
  welcoming_ic,
} from "../../../assets/Church_Images/church_images";
import { useScrollAnimation } from "./useScrollAnimation";
import ContactUs from "../../footer/Contact_Us";
import { useState, useEffect } from "react";
import "./about_us.css";
import Team_Page from "./TeamPage/Team_Page";

export default function AboutUs() {
  const [isVisiblePassage, passageRef] = useScrollAnimation(0.8); // Apply to passage
  const [isVisibleHistory, historyRef] = useScrollAnimation(0.8); // Apply to history
  const [isVisibleVaM, VaMRef] = useScrollAnimation(0.2);
  const [isVisibleMission, missionRef] = useScrollAnimation(0.6);
  const [isVisibleValues, valuesRef] = useScrollAnimation(0.6);
  const [isVisiblePastor, pastorRef] = useScrollAnimation(0.2);
  const [isVisibleDetail, detailRef] = useScrollAnimation(1);

  const [showTeamPage, setShowTeamPage] = useState(false);

  // Disable scrolling when modal is active
  useEffect(() => {
    if (showTeamPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Clean up on unmount
    };
  }, [showTeamPage]);

  const handleGUIsqBTN = () => {
    setShowTeamPage(!showTeamPage);
  };

  return (
    <div className="aboutUs_page_cont">
      {/**This will be the about us header */}
      <div className="greeting_container">
        <img
          src={intro_bg}
          alt="Intro Background"
          className="greating_header_image"
        />
        <div className="greeting_text_container">
          <h1 className="header_text">To Love God And To Love People</h1>
          <h3 className="intro_text">
            Welcome To Christian Bible Church of Hagonoy
          </h3>
        </div>
      </div>

      {/**This will be the start of introduction */}
      <div className="intoduction_container">
        <div className="intoduction_container_row" ref={passageRef}>
          <div className="introduction_texts">
            <h1
              className={`get_to_know_header ${
                isVisiblePassage ? "slide-left" : ""
              }`}
            >
              Get to Know Us
            </h1>
            <p
              className={`get_to_know_introduction ${
                isVisiblePassage ? "slide-left" : ""
              }`}
            >
              Welcome to Christian Bible Church of Hagonoy, where we are
              dedicated to proclaiming the gospel and nurturing disciples in our
              community. Established in 1985, our church has been a cornerstone
              in Hagonoy, Bulacan, Philippines, for over three decades, serving
              as a beacon of hope and faith.
            </p>
          </div>
          <img
            src={Intro_Photo}
            alt="Introduction Image"
            className={`get_to_know_image_intro ${
              isVisiblePassage ? "fade-in" : ""
            }`}
          />
        </div>
      </div>
      <div className="history_container" ref={historyRef}>
        <p
          className={`get_to_know_history ${
            isVisibleHistory ? "slide-left" : ""
          }`}
        >
          Founded in 1985 by a group of passionate believers, Christian Bible
          Church of Hagonoy has grown from a small fellowship to a thriving
          congregation. Over the decades, we have celebrated numerous
          milestones, including expansions in our ministry and outreach efforts.
        </p>
        <img
          src={History_Photo}
          alt="History Image"
          className={`get_to_know_image_history ${
            isVisibleHistory ? "fade-in" : ""
          }`}
        />
      </div>

      {/** Church Values and Mission*/}
      <div className="values_and_mission_container" ref={VaMRef}>
        <h1
          className={`values_and_mission_header ${
            isVisibleVaM ? "fly-in" : ""
          }`}
        >
          Our Values and Missions
        </h1>
        <div className="mission_statement_container" ref={missionRef}>
          <img
            src={mission_header}
            alt="mission header"
            className={`mission_header_image ${
              isVisibleMission ? "fly-in" : ""
            }`}
          />
          <h2
            className={`mission_statement_header ${
              isVisibleMission ? "fly-in" : ""
            }`}
          >
            Mission Statement
          </h2>
          <p
            className={`mission_statement_text ${
              isVisibleMission ? "fly-in" : ""
            }`}
          >
            At Christian Bible Church of Hagonoy, our mission is rooted in the
            love of God, service to others, and humility in Christ. We strive to
            impact our community and beyond through outreach programs, missions
            work, and fostering a welcoming environment for all.
          </p>
        </div>
        <div className="values_main_container" ref={valuesRef}>
          <h2 className={`values_header ${isVisibleValues ? "fly-in" : ""}`}>
            Our Values
          </h2>
          <div className="values_rows_container">
            <div className={`values_rows ${isVisibleValues ? "fade-in" : ""}`}>
              <div className="values_container">
                <img src={faith_ic} alt="Faith" className="values_icon" />
                <h4 className="values_title">Faith</h4>
                <p className="values_details">
                  We believe in the transformative power of faith in Jesus
                  Christ as the foundation of our lives and community.
                </p>
              </div>
              <div className="values_container">
                <img src={love_ic} alt="Love" className="values_icon" />
                <h4 className="values_title">Love</h4>
                <p className="values_details">
                  We are committed to loving God and loving others, reflecting
                  Christ&apos;s love in all our actions and relationships.
                </p>
              </div>
            </div>
            <div className={`values_rows ${isVisibleValues ? "fade-in" : ""}`}>
              <div className="values_container">
                <img src={services_ic} alt="Service" className="values_icon" />
                <h4 className="values_title">Service</h4>
                <p className="values_details">
                  We embrace the call to serve our community and the world,
                  meeting physical and spiritual needs through outreach and
                  missions.
                </p>
              </div>
              <div className="values_container">
                <img
                  src={welcoming_ic}
                  alt="Welcoming Atmosphere"
                  className="values_icon"
                />
                <h4 className="values_title">Welcoming Atmosphere</h4>
                <p className="values_details">
                  We strive to create a warm and inviting environment where
                  everyone feels valued and included, regardless of their
                  background.
                </p>
              </div>
            </div>
            <div className={`values_rows ${isVisibleValues ? "fade-in" : ""}`}>
              <div className="values_container">
                <img
                  src={discipleship_ic}
                  alt="Discipleship"
                  className="values_icon"
                />
                <h4 className="values_title">Discipleship</h4>
                <p className="values_details">
                  We prioritize spiritual growth through teaching, mentorship,
                  and community, encouraging one another to deepen our
                  relationship with God.
                </p>
              </div>
              <div className="values_container">
                <img
                  src={integrity_ic}
                  alt="Integrity"
                  className="values_icon"
                />
                <h4 className="values_title">Integrity</h4>
                <p className="values_details">
                  We uphold honesty and transparency in all we do, striving to
                  reflect Christ&apos;s character in our decisions and actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/**Leadership Pastor */}
      <div className="leadership_pastor_container" ref={pastorRef}>
        <h2
          className={`leadership_header_text ${
            isVisiblePastor ? "fade-in" : ""
          }`}
        >
          Leadership and Staff
        </h2>
        <p
          className={`leadership_context_text ${
            isVisiblePastor ? "fade-in" : ""
          }`}
          ref={detailRef}
        >
          Meet our dedicated team of leaders who guide our congregation.
        </p>
        <div className="pastors_container">
          <div className="pastor_container">
            <div className={`image_handler ${isVisibleDetail ? "fly-in" : ""}`}>
              <img
                src={Pastor_Ike}
                alt="Leadership Pastor"
                className="image_pastor"
              />
            </div>
            <h3 className="leader_pastor_name">Pastor Ike Serapio</h3>
            <p className="leader_descrption">
              Senior Pastor – Providing spiritual leadership and preaching.
            </p>
          </div>
          <div className="pastora_container">
            <div className={`image_handler ${isVisibleDetail ? "fly-in" : ""}`}>
              <img
                src={pastora_gigi}
                alt="Leadership Pastor"
                className="image_pastor"
              />
            </div>
            <h3 className="leader_pastor_name">Pastora Gigi Serapio</h3>
            <p className="leader_descrption">
              Senior Pastor – Providing spiritual leadership and preaching.
            </p>
          </div>
        </div>
        <button className="meet_the_team_btn" onClick={handleGUIsqBTN}>
          Meet The GUIsq
        </button>
      </div>

      {showTeamPage && (
        <div className="teamPage_modal_overlay" onClick={handleGUIsqBTN}>
          <div
            className="teamPage_modal_content"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            <Team_Page handleGUIsqBTN={handleGUIsqBTN} />
          </div>
        </div>
      )}

      {/**Footer */}
      <ContactUs />
    </div>
  );
}
