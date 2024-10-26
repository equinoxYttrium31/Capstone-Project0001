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

        console.log("Fetched current week events:", currentWeekEvents); // Debugging: Check filtered events

        // Upcoming events: Both publish date and end date must be after the end of the current week
        const filteredUpcomingEvents = response.data.filter((announcement) => {
          if (announcement.audience === "all_cellgroups") {
            const publishDate = setToStartOfDay(announcement.publishDate);
            const endDate = setToStartOfDay(announcement.endDate);
            return (
              publishDate >= today && // Event is published today or later
              endDate > endOfWeek // Event ends after the current week
            );
          }
          return false;
        });

        setCurrentEvents(currentWeekEvents);
        setUpcomingEvents(filteredUpcomingEvents);
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
        <div className="upcoming_events_list">
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
    </div>
  );
}
