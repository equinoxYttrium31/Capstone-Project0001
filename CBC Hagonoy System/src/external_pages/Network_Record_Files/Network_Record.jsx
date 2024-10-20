import { useState, useEffect } from "react";
import axios from "axios";
import "./Network_Record.css";

function Network_Record() {
  const [maleprogress, setMaleProgress] = useState(0);
  const [femaleprogress, setFemaleProgress] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [cellGroups, setCellGroups] = useState([]);
  const [totalCellGroups, setTotalCellGroups] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [totalBaptized, setTotalBaptized] = useState(0);

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

        // Count genders
        const maleCount = filteredMembers.filter(
          (user) => user.gender === "Male"
        ).length;
        const femaleCount = filteredMembers.filter(
          (user) => user.gender === "Female"
        ).length;

        // Calculate percentage of male users
        const malePercentage = (
          (maleCount / filteredMembers.length) *
          100
        ).toFixed(2); // Rounded to 2 decimal places
        setMaleProgress(malePercentage); // Set male percentage in progress

        const femalePercentage = (
          (femaleCount / filteredMembers.length) *
          100
        ).toFixed(2); // Rounded to 2 decimal places
        setFemaleProgress(femalePercentage);

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

  const maleColor = "#36a2eb";
  const femaleColor = "#ffce56";

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
          <div className="container_leftside_bottom"></div>
        </div>
        <div className="network_bottomlayer_rightside">
          <div className="network_chart_cont">
            <div
              className="net_chart"
              style={{
                background: `conic-gradient(
                      ${maleColor} ${maleprogress * 3.6}deg, 
                      ${femaleColor} ${femaleprogress * 3.6}deg 360deg)`,
              }}
            ></div>
          </div>
          <div className="network_chart_labels">
            <div className="net_chart_label">
              <div
                className="color_box"
                style={{ backgroundColor: maleColor }}
              ></div>
              Male: {maleprogress}%
            </div>
            <div className="net_chart_label">
              <div
                className="color_box"
                style={{ backgroundColor: femaleColor }}
              ></div>
              Female: {femaleprogress}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Network_Record;
