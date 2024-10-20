import "./Communication_Tools.css";
import { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { placeholdericons, search_ic } from "../../assets/Images";

export default function Communication_Tools() {
  const [groupedPrayerRequests, setGroupedPrayerRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserId, setActiveUserId] = useState();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchGroupedPrayerRequests = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/prayer-requests/grouped"
        );
        if (response.status === 200) {
          setGroupedPrayerRequests(response.data);
        }
      } catch (error) {
        console.error("Error fetching grouped prayer requests:", error);
      }
    };

    fetchGroupedPrayerRequests();
  }, []);

  const handleScrollToDiv = () => {
    window.scrollTo({ bottom: 0, behavior: "smooth" }); // Scroll to the top smoothly
  };

  useEffect(() => {
    handleScrollToDiv();
  }, []);

  const handleFocus = () => {
    handleScrollToDiv();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = groupedPrayerRequests
    .filter((group) => {
      const name = group._id.toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.startsWith(term); // Match names starting with the search term
    })
    .sort((a, b) => {
      const latestA =
        a.prayerRequests.length > 0
          ? Math.max(
              ...a.prayerRequests.map((req) => new Date(req.dateSubmitted))
            )
          : 0;
      const latestB =
        b.prayerRequests.length > 0
          ? Math.max(
              ...b.prayerRequests.map((req) => new Date(req.dateSubmitted))
            )
          : 0;

      return latestB - latestA; // Sort in descending order
    });

  const handleUserClick = (userId) => {
    setActiveUserId(userId);
  };

  const activeUserRequests = activeUserId
    ? [
        ...(groupedPrayerRequests.find((group) => group._id === activeUserId)
          ?.prayerRequests || []),
      ].reverse()
    : [];

  return (
    <div className="communication_tools_container">
      <div className="communication_main_container">
        <div className="communication_header_container">
          <p className="communication_church_name">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </p>
          <h1 className="communication_header_Lbl">Communication Tools</h1>
        </div>

        <div className="communication_main_comms">
          <div className="list_of_contacts">
            <div className="list_of_contacts_header">
              <input
                type="text"
                className="communication_search_bar"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <img
                src={search_ic}
                alt="search_icon"
                className="communication_search_ic"
              />
            </div>

            <div className="list_of_user_container">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((group) => (
                  <div
                    key={group._id}
                    className={`communication_user_container ${
                      activeUserId === group._id ? "active" : ""
                    }`}
                    onClick={() => handleUserClick(group._id)}
                  >
                    <img
                      src={placeholdericons}
                      alt="user_profile"
                      className="communication_user_profile"
                    />
                    <h3 className="communication_user_name">{group._id}</h3>
                  </div>
                ))
              ) : (
                <p className="error_placeholder">No prayer requests found.</p>
              )}
            </div>
          </div>

          <div className="prayer_request_area">
            <div className="header_prayer_request_area">
              <img
                src={placeholdericons}
                alt="user_profile"
                className="profile_prayer_request_area"
              />
              <h3 className="username_prayer_request_area">
                {activeUserId || "Username"}
              </h3>
            </div>
            <div className="prayer_request_area_cont">
              <div
                ref={scrollRef}
                onFocus={handleFocus}
                tabIndex={0}
                className="messages_container"
              >
                {activeUserRequests.length > 0 ? (
                  activeUserRequests.map((request) => (
                    <div key={request._id} className="prayer_request_message">
                      <p>{request.prayer}</p>
                      <span className="message_time">
                        {request.dateSubmitted
                          ? format(parseISO(request.dateSubmitted), "Pp")
                          : "Invalid Date"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="error_placeholder">
                    No messages available for this user.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
