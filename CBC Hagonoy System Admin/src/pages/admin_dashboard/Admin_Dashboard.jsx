import { useState, useEffect } from "react";
import axios from "axios";

import CustomCalendar from "../../components/CustomCalendar/customCalendar";
import "./Admin_Dashboard.css";

import NewMembersChart from "../audit_and_trailing/charts/newMembers/NewMembersChart";
import TotalMembersChart from "../audit_and_trailing/charts/totalMembers/TotalMembersChart";
import UserDemographics from "../audit_and_trailing/charts/UserDemographics/UserDemographics";
import PrayerRequestChart from "../audit_and_trailing/charts/PrayerRequestTraffic/PrayerRequestChart";

function Admin_Dashboard() {
  // State declarations
  const [announcements, setAnnouncements] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [cellGroups, setCellGroups] = useState([]);
  const [totalCellGroups, setTotalCellGroups] = useState(0);
  const [totalGuest, setTotalGuests] = useState(0);
  const [totalBaptized, setTotalBaptized] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("");

  // Fetching Announcements, Users, and Cell Groups
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-announcements"
        );
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error Fetching Announcements", error);
      }
    };

    const fetchUsersAndCellGroups = async () => {
      try {
        const usersResponse = await axios.get(
          "https://capstone-project0001-2.onrender.com/records"
        );

        const filteredMembers = usersResponse.data.filter(
          (user) => user.memberType !== "Guest"
        );
        setTotalMembers(filteredMembers.length);

        const filterGuest = usersResponse.data.filter(
          (guest) =>
            guest.memberType !== "Member" &&
            guest.memberType !== "Cellgroup Leader" &&
            guest.memberType !== "Network Leader"
        );
        setTotalGuests(filterGuest.length);

        const filterBaptized = usersResponse.data.filter(
          (baptized) =>
            baptized.isBaptized !== "Scheduled" &&
            baptized.isBaptized !== "Not Baptize" &&
            baptized.isBaptized !== "Guest"
        );
        setTotalBaptized(filterBaptized.length);

        const cellGroupsResponse = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
        );

        const filteredCellGroups = cellGroupsResponse.data.filter(
          (group) =>
            group.cellgroupName !== "Marc Dexter Raymundo's Team" &&
            group.cellgroupName !== "Guest Lists"
        );
        setCellGroups(filteredCellGroups);
        setTotalCellGroups(filteredCellGroups.length);
      } catch (error) {
        console.error("Error fetching users or cell groups", error);
      }
    };

    fetchUsersAndCellGroups();
    fetchAnnouncements();
  }, []);

  // Function to format date
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
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Handler to update the selected graph
  const handleGraphChange = (e) => {
    setSelectedGraph(e.target.value);
  };

  // Map for conditional rendering of charts
  const renderGraph = () => {
    switch (selectedGraph) {
      case "New Members":
        return <NewMembersChart />;
      case "Total Members":
        return <TotalMembersChart />;
      case "User Demographics":
        return <UserDemographics />;
      case "Prayer Request":
        return <PrayerRequestChart />;
      default:
        return <NewMembersChart />;
    }
  };

  return (
    <div className="admin_dashboard_main_container">
      <div className="left_container_adminDash">
        <div className="left_container_upper">
          <p className="church_name_admin">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
          <h2 className="admin_title">Admin Dashboard</h2>
        </div>
        <div className="welcome_container">
          <p className="welcome_text_admin">Welcome back,</p>
          <p className="user_text_admin">Pastor</p>
        </div>
        <div className="left_container_lower">
          <div className="lower_container_top">
            <div className="content_container_top">
              <p className="content_header_admin">Total Members: </p>
              <h2 className="count_content_admin">{totalMembers}</h2>
            </div>
            <div className="content_container_top">
              <p className="content_header_admin">Total number of guests: </p>
              <h2 className="count_content_admin">{totalGuest}</h2>
            </div>
          </div>
          <div className="lower_container_low">
            <div className="content_container_top">
              <p className="content_header_admin">Baptized Members: </p>
              <h2 className="count_content_admin">{totalBaptized}</h2>
            </div>
            <div className="content_container_top">
              <p className="content_header_admin">Cellgroups: </p>
              <h2 className="count_content_admin">{totalCellGroups}</h2>
            </div>
          </div>
          <div className="graphs_container">
            <div className="graph_mainCont">
              <div className="header_container">
                <h3 className="header_title">Admin Analytics</h3>
              </div>
              <div className="header_navigation">
                <select
                  className="navigation_graphs"
                  value={selectedGraph}
                  onChange={handleGraphChange}
                >
                  <option value="">Filter Graph</option>
                  <option value="New Members">New Members</option>
                  <option value="Total Members">Total Members</option>
                  <option value="User Demographics">User Demographics</option>
                  <option value="Prayer Request">Prayer Request</option>
                </select>
              </div>

              <div className="graph_display">{renderGraph()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="right_container_adminDash">
        <div className="right_top_container">
          <CustomCalendar />
        </div>
        <div className="right_bot_container">
          <h2 className="event_header_admin">Upcoming Events...</h2>
          <div className="events_holder_scroll">
            {announcements.map((announcement, index) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_Dashboard;
