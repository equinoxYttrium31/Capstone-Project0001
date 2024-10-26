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

        // Define today once and set it to the start of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Utility function to set date to start of the day
        const setToStartOfDay = (date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          return d;
        };

        // Calculate start (Monday) and end (Sunday) of the current week based on today
        const startOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if today is Sunday
        startOfWeek.setDate(today.getDate() + daysUntilMonday); // Monday

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

        console.log("Start of week:", startOfWeek); // Debugging: Check start of the week
        console.log("End of week:", endOfWeek); // Debugging: Check end of the week

        // Current events: Ending within the current week and published today or earlier
        const currentWeekEvents = response.data.filter((announcement) => {
          if (announcement.audience === "all_cellgroups") {
            const publishDate = setToStartOfDay(announcement.publishDate);
            const endDate = setToStartOfDay(announcement.endDate);

            // Debugging: Log announcement dates
            console.log(
              `Checking event: PublishDate=${publishDate}, EndDate=${endDate}`
            );

            return (
              publishDate >= startOfWeek &&
              endDate >= startOfWeek &&
              endDate <= endOfWeek
            );
          }
          return false;
        });

        setAnnouncements(currentWeekEvents);
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
