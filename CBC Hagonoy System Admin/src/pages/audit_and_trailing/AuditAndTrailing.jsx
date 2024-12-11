import { useState, useEffect } from "react";
import "./AuditAndTrailing.css";
import { xlsx_icon } from "../../assets/Images";
import axios from "axios";

export default function AuditAndTrailing() {
  // State for network leaders and cell groups
  const [networkLeaders, setNetworkLeaders] = useState([]);
  const [cellGroups, setCellGroups] = useState([]);
  const [disabledAccounts, setDisabledAccounts] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchNetworkLeaders = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/network"
        );
        setNetworkLeaders(response.data);
      } catch (error) {
        console.error("Error fetching network leaders", error);
      }
    };

    const fetchCellGroups = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
        );

        const filteredGroups = response.data.filter(
          (group) =>
            group.cellgroupID.trim() !== "00-001" &&
            group.cellgroupID.trim() !== "00-002"
        );

        setCellGroups(filteredGroups);
      } catch (error) {
        console.error("Error fetching cell groups", error);
      }
    };

    const fetchDisabledAccounts = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/users"
        );

        const disabledUsers = response.data.filter((user) => !user.isActive); // Assuming `isActive` determines the account status
        setDisabledAccounts(disabledUsers);
      } catch (error) {
        console.error("Error fetching disabled accounts", error);
      }
    };

    fetchDisabledAccounts();
    fetchNetworkLeaders();
    fetchCellGroups();
  }, []);

  return (
    <div className="main_container_audit">
      <div className="header_container">
        <p className="church_name_user_management">
          CHRISTIAN BIBLE CHURCH OF HAGONOY
        </p>
        <h1 className="user_management_lbl">Audit and Trailing</h1>
      </div>

      <div className="navigation_bar">
        <button className="export_button" onClick={() => alert("Exporting...")}>
          <img src={xlsx_icon} alt="" className="export_icon" />
          Export
        </button>

        {/* Network Leader Dropdown */}
        <select className="Filter_Network">
          <option value="">Filter by Network Leader</option>
          {networkLeaders.map((leader) => (
            <option key={leader.networkID} value={leader.networkID}>
              {leader.networkLeader}
            </option>
          ))}
        </select>

        {/* Cell Group Dropdown */}
        <select className="Filter_Cellgroup">
          <option value="">Filter by Cell Group</option>
          {cellGroups.map((group) => (
            <option key={group.cellgroupID} value={group.cellgroupID}>
              {group.cellgroupName}
            </option>
          ))}
        </select>
      </div>

      <div className="disabled_accounts_container">
        <h2>Disabled Accounts</h2>
        <ul>
          {disabledAccounts.length > 0 ? (
            disabledAccounts.map((user) => (
              <li key={user.userID}>
                {user.firstName} {user.lastName} - {user.email}
              </li>
            ))
          ) : (
            <p>No disabled accounts found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
