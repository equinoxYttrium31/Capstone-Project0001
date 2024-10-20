import "./Event_Page.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Event_Page() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-announcements"
        );
        const today = new Date();
        // Set today's time to 00:00:00 to compare only the date
        today.setHours(0, 0, 0, 0);

        // Filter events where endDate is today or in the future
        const filteredEvents = response.data.filter((announcement) => {
          const publishDate = new Date(announcement.endDate);
          const endDate = new Date(announcement.endDate);
          endDate.setHours(0, 0, 0, 0);
          publishDate.setHours(0, 0, 0, 0); // Set endDate's time to 00:00:00
          return endDate >= today && publishDate <= today; // Compare only dates
        });

        // Filter events where endDate is today or in the future
        const filteredUpcomingEvents = response.data.filter((announcement) => {
          const publishDate = new Date(announcement.publishDate);
          publishDate.setHours(0, 0, 0, 0); // Set endDate's time to 00:00:00
          return publishDate >= today; // Compare only dates
        });

        setUpcomingEvents(filteredUpcomingEvents);
        setCurrentEvents(filteredEvents); // Set the filtered events to state
      } catch (error) {
        console.error("Error Fetching Announcements", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()]; // Get month name
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`; // Format: Month Day, Year
  };

  return (
    <div className="event_page_container">
      {/**this is the header */}
      <div className="header_container_event">
        <h1 className="header_text_event">
          Christian Bible Church of Hagonoy Events
        </h1>
        <h3 className="header_subtext_event">
          Connect, engage, and grow in faith with our community activities!
        </h3>
      </div>

      {/**Current Events */}
      <div className="current_events_container">
        <h2 className="current_events_header">Current Events:</h2>
        <div className="current_events_list">
          {currentEvents.length > 0 ? (
            currentEvents.map((announcement, index) => (
              <div className="event_content_admin" key={index}>
                <h4 className="event_title_admin">{announcement.title}</h4>
                <p className="event_date_admin">
                  {formatDate(announcement.publishDate)} -{" "}
                  {formatDate(announcement.endDate)}
                </p>
                <div
                  className="event_details_admin"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <img
                  src={`data:image/jpeg;base64,${announcement.announcementPic}`} // Base64 image
                  alt={announcement.title}
                  className="event_image_admin"
                />
              </div>
            ))
          ) : (
            <p>No current events available.</p>
          )}
        </div>
      </div>
      <div className="upcoming_event_container">
        <h2 className="header_upcoming_events">Upcoming Events:</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((announcement, index) => (
            <div className="event_content_admin" key={index}>
              <h4 className="event_title_admin">{announcement.title}</h4>
              <p className="event_date_admin">
                {formatDate(announcement.publishDate)} -{" "}
                {formatDate(announcement.endDate)}
              </p>
              <div
                className="event_details_admin"
                dangerouslySetInnerHTML={{ __html: announcement.content }}
              />
              <img
                src={`data:image/jpeg;base64,${announcement.announcementPic}`} // Base64 image
                alt={announcement.title}
                className="event_image_admin"
              />
            </div>
          ))
        ) : (
          <p>No upcoming events available.</p>
        )}
      </div>
    </div>
  );
}
