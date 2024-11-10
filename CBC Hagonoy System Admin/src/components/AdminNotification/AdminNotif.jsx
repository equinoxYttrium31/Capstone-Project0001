import { useEffect, useState } from "react";
import "./AdminNotif.css";
import { new_user_icon, prayer_request_icon } from "../../assets/Images";
import axios from "axios";

const timeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSec = diffInMs / 1000; // seconds
  const diffInMin = diffInSec / 60; // minutes
  const diffInHours = diffInMin / 60; // hours
  const diffInDays = diffInHours / 24; // days
  const diffInWeeks = diffInDays / 7; // weeks
  const diffInMonths = diffInDays / 30; // months

  if (diffInMonths >= 1) return `${Math.floor(diffInMonths)} month(s) ago`;
  if (diffInWeeks >= 1) return `${Math.floor(diffInWeeks)} week(s) ago`;
  if (diffInDays >= 1) return `${Math.floor(diffInDays)} day(s) ago`;
  if (diffInHours >= 1) return `${Math.floor(diffInHours)} hour(s) ago`;
  return `${Math.floor(diffInMin)} minute(s) ago`; // default for minute-level difference
};

export default function AdminNotif() {
  const [notifications, setNotifications] = useState([]); // Store both prayer requests and new users

  const getPrayerRequest = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/fetch-prayers"
      );
      return response.data; // Return prayer requests
    } catch (error) {
      console.error("Error fetching prayer requests", error);
      return []; // Return empty array on error
    }
  };

  const fetchNewUser = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/fetch-newusers"
      );
      return response.data; // Return new users
    } catch (error) {
      console.error("Error fetching new users", error);
      return []; // Return empty array on error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const prayerRequests = await getPrayerRequest(); // Fetch prayer requests
      const newUsers = await fetchNewUser(); // Fetch new users

      const combinedNotifications = [
        ...prayerRequests.map((item) => ({ ...item, type: "prayer" })),
        ...newUsers.map((item) => ({ ...item, type: "newUser" })),
      ];

      // Sort by dateSubmitted or createdAt in descending order (latest first)
      combinedNotifications.sort(
        (a, b) =>
          new Date(b.dateSubmitted || b.createdAt) -
          new Date(a.dateSubmitted || a.createdAt)
      );

      setNotifications(combinedNotifications); // Set sorted notifications
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once on component mount

  return (
    <div className="notification_mainContainer">
      <div className="notification_cont">
        <div className="notification_header_container">
          <h2 className="notification_header">Notifications</h2>
        </div>
        <div className="notification_body_container">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="notification_item">
                <img
                  src={
                    notification.type === "prayer"
                      ? prayer_request_icon
                      : new_user_icon
                  }
                  alt="icons"
                  className="notification_icon"
                />
                <div className="notifications_deets_container">
                  <h3 className="notification_title">
                    {notification.type === "prayer"
                      ? notification.name
                      : `${notification.firstName} ${notification.lastName}`}{" "}
                  </h3>
                  <p className="notification_content">
                    {notification.type === "prayer"
                      ? notification.prayer
                      : `${notification.firstName} ${notification.lastName} has joined`}
                  </p>
                  <p className="notification_time">
                    {timeAgo(
                      notification.dateSubmitted || notification.createdAt
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
