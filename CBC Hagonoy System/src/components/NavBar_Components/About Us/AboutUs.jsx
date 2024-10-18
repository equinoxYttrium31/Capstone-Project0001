import { intro_bg } from "../../../assets/Assets";
import {
  History_Photo,
  Intro_Photo,
} from "../../../assets/Church_Images/church_images";
import { useScrollAnimation } from './useScrollAnimation';
import "./about_us.css";

export default function AboutUs() {

  const [isVisiblePassage, passageRef] = useScrollAnimation(0.8); // Apply to passage
  const [isVisibleHistory, historyRef] = useScrollAnimation(0.8); // Apply to history

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
        <div 
          className="intoduction_container"
          >
          <div className="intoduction_container_row" ref={passageRef}>
            <div className="introduction_texts">
              <h1 className={`get_to_know_header ${isVisiblePassage ? 'slide-left' : ''}`}>Get to Know Us</h1>
              <p className={`get_to_know_introduction ${isVisiblePassage ? 'slide-left' : ''}`}
                >
                Welcome to Christian Bible Church of Hagonoy, where we are dedicated
                to proclaiming the gospel and nurturing disciples in our community.
                Established in 1985, our church has been a cornerstone in Hagonoy,
                Bulacan, Philippines, for over three decades, serving as a beacon of
                hope and faith.
              </p>
            </div>
            <img
              src={Intro_Photo}
              alt="Introduction Image"
              className={`get_to_know_image_intro ${isVisiblePassage ? 'fade-in' : ''}`}
              
            />
          </div>        
        </div>
        <div className="history_container" ref={historyRef}>
              <p className={`get_to_know_history ${isVisibleHistory ? 'slide-left':''}`}>
                Founded in 1985 by a group of passionate believers, Christian Bible
                Church of Hagonoy has grown from a small fellowship to a thriving
                congregation. Over the decades, we have celebrated numerous
                milestones, including expansions in our ministry and outreach efforts.
              </p>
              <img
                src={History_Photo}
                alt="History Image"
                className={`get_to_know_image_history ${isVisibleHistory ? 'fade-in' : ''}`}
              />
        </div>
    </div>
  );
}
