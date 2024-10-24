import { useState, useEffect } from "react";
import axios from "axios";
import "./Network_Record.css";

function Network_Record() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [cellGroups, setCellGroups] = useState([]);
  const [totalCellGroups, setTotalCellGroups] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [totalBaptized, setTotalBaptized] = useState(0);
  const [networkAnnouncements, setNetworkAnnouncements] = useState([]);

  useEffect(() => {
    const fetchNetworkAnnouncements = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-announcements"
        );

        const networkAnn = response.data.filter((announcement) => {
          const audience = announcement.audience;
          return audience === "network_leaders"; // Return the entire announcement object
        });

        setNetworkAnnouncements(networkAnn);
      } catch (error) {
        console.log("Error fetching network announcements");
      }
    };

    fetchNetworkAnnouncements();
  }, []);

  //Fetching of Announcements, Users, and Cell Groups
  useEffect(() => {
    const fetchUsersAndCellGroups = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get(
          "https://capstone-project0001-2.onrender.com/records"
        );

        // Count total members excluding guests
        const filteredMembers = usersResponse.data.filter(
          (user) => user.memberType !== "Guest"
        );
        setTotalMembers(filteredMembers.length); // Count of total members

        // Filter guests
        const filterGuests = usersResponse.data.filter(
          (guest) =>
            guest.memberType !== "Member" &&
            guest.memberType !== "Cellgroup Leader" &&
            guest.memberType !== "Network Leader"
        );
        setTotalGuests(filterGuests.length);

        // Filter Baptized
        const filterBaptized = usersResponse.data.filter(
          (baptized) =>
            baptized.isBaptized !== "Scheduled" &&
            baptized.isBaptized !== "Not Baptize" &&
            baptized.isBaptized !== "Guest"
        );
        setTotalBaptized(filterBaptized.length);

        // Fetch all cell groups
        const cellGroupsResponse = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
        );

        // Filter out specific cell groups
        const filteredCellGroups = cellGroupsResponse.data.filter(
          (group) =>
            group.cellgroupName !== "Marc Dexter Raymundo's CellGroup" &&
            group.cellgroupName !== "Guest Lists"
        );
        setCellGroups(filteredCellGroups);
        setTotalCellGroups(filteredCellGroups.length); // Set the count of filtered cell groups
      } catch (error) {
        console.error("Error fetching users or cell groups", error);
      }
    };

    fetchUsersAndCellGroups();
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
    <div className="network_container">
      <div className="network_toplayer">
        <p className="network_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
        <h3 className="network_title">Network Monitoring</h3>
      </div>
      <div className="network_bottomlayer">
        <div className="network_bottomlayer_leftside">
          <h2 className="info_header_database">User Analytics</h2>
          <div className="container_leftside_top">
            <div className="data_container_right">
              <div className="data_info_cont">
                <p className="data_info_title">Total Members:</p>
                <h3 className="data_info_count">{totalMembers}</h3>
              </div>
              <div className="data_info_cont">
                <p className="data_info_title">Baptized Members</p>
                <h3 className="data_info_count">{totalBaptized}</h3>
              </div>
            </div>
            <div className="data_container_left">
              <div className="data_info_cont">
                <p className="data_info_title">Total number of guests:</p>
                <h3 className="data_info_count">{totalGuests}</h3>
              </div>
              <div className="data_info_cont">
                <p className="data_info_title">Cellgroups</p>
                <h3 className="data_info_count">{totalCellGroups}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="network_bottomlayer_rightside">
          <div className="network_announcement_container">
            <div className="header_announcement_network_cont">
              <h2 className="header_text_announcement">Announcements</h2>
            </div>
            <div className="main_announcements_container">
              {networkAnnouncements.length > 0 ? (
                networkAnnouncements.map((announcement) => (
                  <div
                    className="announcement_container_network"
                    key={announcement._id}
                  >
                    <div className="announcement_header_container_network">
                      <h3 className="network_announcement_header">
                        {announcement.title}
                      </h3>
                      <p className="dates_container_network">
                        {formatDate(announcement.publishDate)} -{" "}
                        {formatDate(announcement.endDate)}
                      </p>
                    </div>
                    <div
                      className="content_container_network"
                      dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />
                  </div>
                ))
              ) : (
                <p className="no_announcement_text">
                  Currently No Announcement
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Network_Record;
