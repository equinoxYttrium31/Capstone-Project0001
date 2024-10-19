import "./Activity.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Activities() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchLatestAnnouncements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/fetch-latestAnnouncement"
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchLatestAnnouncements();
  }, []);

  const getImageType = (base64String) => {
    if (base64String.startsWith("/9j/")) {
      return "jpeg";
    } else if (base64String.startsWith("iVBOR")) {
      return "png";
    }
    // Add more types if needed
    return "jpeg"; // default to jpeg
  };

  return (
    <div className="activity">
      <div className="header-container">
        <h1 className="page-title">OUR LATEST ACTIVITIES</h1>
        <h3 className="page-subtitle">
          Stay connected and be inspired by our recent activities as we journey
          together in faith and service.
        </h3>
      </div>
      <div className="cards-container">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="event-card">
            <img
              src={`data:image/${getImageType(
                announcement.announcementPic
              )};base64,${announcement.announcementPic}`}
              alt="event-photo"
              className="event-photo"
            />
            <h5 className="title">{announcement.title}</h5>
          </div>
        ))}
      </div>
      <div className="button_see_more_container">
        <button
          className="see_more_button"
          onClick={() => handleNavigation("/event-page")}
        >
          See More Events...
        </button>
      </div>
    </div>
  );
}

export default Activities;
