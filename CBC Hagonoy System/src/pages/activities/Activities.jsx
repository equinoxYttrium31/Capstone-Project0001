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
          "https://capstone-project0001-2.onrender.com/fetch-announcements",
          "https://capstone-project0001-2.onrender.com//archive-announcement"
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter events where endDate is today or in the future
        const filteredEvents = response.data.filter((announcement) => {
          const audience = announcement.audience;
          const publishDate = new Date(announcement.endDate);
          const endDate = new Date(announcement.endDate);
          endDate.setHours(0, 0, 0, 0);
          publishDate.setHours(0, 0, 0, 0);

          if (audience === "all_cellgroups") {
            return endDate <= today && publishDate >= today;
          }
        });

        setAnnouncements(filteredEvents);
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
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
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
          ))
        ) : (
          <p className="loading_text">Fetching Announcements...</p>
        )}
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
