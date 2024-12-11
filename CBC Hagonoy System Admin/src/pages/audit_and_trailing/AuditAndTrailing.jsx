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

        const disabledUsers = response.data;
        setDisabledAccounts(disabledUsers);
      } catch (error) {
        console.error("Error fetching disabled accounts", error);
      }
    };

    fetchDisabledAccounts();
    fetchNetworkLeaders();
    fetchCellGroups();
  }, []);

  const handleEnableAccount = async (userID) => {
    try {
      await axios.post(
        `https://capstone-project0001-2.onrender.com/enable-account/${userID}`
      );
      alert(`Account for user ${userID} has been enabled.`);
      // Optionally, refresh the disabled accounts list
      setDisabledAccounts((prev) =>
        prev.filter((user) => user.userID !== userID)
      );
    } catch (error) {
      console.error("Error enabling account", error);
      alert("Failed to enable account. Please try again.");
    }
  };

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
        {disabledAccounts.length > 0 ? (
          <table className="disabled_accounts_table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Reason</th>
                <th>Enable Account</th>
              </tr>
            </thead>
            <tbody>
              {disabledAccounts.map((user, index) => {
                // Calculate age from birthDate if available
                const age = user.birthDate
                  ? Math.floor(
                      (new Date() - new Date(user.birthDate)) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )
                  : "N/A";

                return (
                  <tr key={user.userID}>
                    <td>{index + 1}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{age}</td>
                    <td>{user.reasonDisabled || "Not provided"}</td>{" "}
                    {/* Assuming `reason` field exists */}
                    <td>
                      <button
                        className="enable_account_btn"
                        onClick={() => handleEnableAccount(user.userID)}
                      >
                        Enable
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No disabled accounts found.</p>
        )}
      </div>
    </div>
  );
}
