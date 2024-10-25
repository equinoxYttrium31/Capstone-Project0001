import "./notifications.css";
import { useEffect, useState } from "react";

// Define timeSince function
function timeSince(date) {
  const now = new Date();
  const postDate = new Date(date);
  const secondsAgo = Math.floor((now - postDate) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(secondsAgo / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${key} ago` : `${interval} ${key}s ago`;
    }
  }

  return "just now";
}

export default function Notifications() {
  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);

  useEffect(() => {
    const fetchRegularAnnouncements = async () => {
      try {
        const response = await fetch(
          "https://capstone-project0001-2.onrender.com/fetch-announcements"
        );
        const data = await response.json();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const userAnn = data.filter(
          (announcement) => announcement.audience === "all_cellgroups"
        );
        setEvents(userAnn);
      } catch (error) {
        console.error("Error fetching regular announcements:", error);
      }
    };

    const fetchArchivedAnnouncements = async () => {
      try {
        const response = await fetch(
          "https://capstone-project0001-2.onrender.com/fetch-archived-announcements"
        );
        const data = await response.json();
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setArchivedEvents(data);
      } catch (error) {
        console.error("Error fetching archived announcements:", error);
      }
    };

    fetchRegularAnnouncements();
    fetchArchivedAnnouncements();
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
    <div className="main_container_notifications">
      <div className="notifications_header_container">
        <h2 className="notification_header_text">Notifications</h2>
      </div>

      <div className="notification_list_container">
        {/* Regular Notifications Section */}
        <div className="notification_contents_container">
          <h3 className="section_label">Recent Notifications</h3>
          {events.length > 0 ? (
            events.map((event) => (
              <div className="notification_container" key={event.id}>
                <div className="event_notification_header">
                  <h3 className="notification_title">{event.title}</h3>
                  <p className="notification_date">
                    {formatDate(event.publishDate)} -{" "}
                    {formatDate(event.endDate)}
                  </p>
                </div>
                <p className="notification_time">
                  {timeSince(event.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="no_announcement_text">Currently No Notifications</p>
          )}
        </div>

        <div className="notification_contents_container">
          <h3 className="section_label">Past Events</h3>
          {archivedEvents.length > 0 ? (
            archivedEvents.map((event) => (
              <div className="notification_container" key={event.id}>
                <div className="event_notification_header">
                  <h3 className="notification_title">{event.title}</h3>
                  <p className="notification_date">
                    {formatDate(event.publishDate)} -{" "}
                    {formatDate(event.endDate)}
                  </p>
                </div>
                <p className="notification_time">
                  {timeSince(event.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="no_announcement_text">No Archived Notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}
