import { useState, useEffect } from "react";
import "./AuditAndTrailing.css";
import { xlsx_icon } from "../../assets/Images";
import axios from "axios";
import ExcelJS from "exceljs";

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

  const handleEnableAccount = async (userId) => {
    try {
      await axios.delete(
        `https://capstone-project0001-2.onrender.com/enable-account/${userId}`
      );
      alert(`Account for user ${userId} has been enabled.`);
      // Optionally, refresh the disabled accounts list
      setDisabledAccounts((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error enabling account", error);
      alert("Failed to enable account. Please try again.");
    }
  };

  const handleDownloadXLSX = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Disabled Acc and Violations", {
      pageSetup: {
        orientation: "landscape", // Set the orientation to landscape
        paperSize: 5,
      },
    });

    // Add title row at the top
    worksheet.mergeCells("A1:J1"); // Merge the cells across the columns for the title
    const titleRow = worksheet.getCell("A1");
    titleRow.value = "Christian Bible Church Hagonoy User Information"; // Set title text
    titleRow.style = {
      font: {
        size: 18,
        bold: true,
        color: { argb: "FFFFFF" },
      },
      alignment: {
        vertical: "middle",
        horizontal: "center",
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" }, // Light blue background
      },
    };

    // Set height for title row to give it enough space
    worksheet.getRow(1).height = 40; // Adjust the row height for the title

    // Add headers manually
    const headerRow = worksheet.addRow([
      "First Name",
      "Last Name",
      "Age",
      "Violation",
    ]);

    // Style table headers
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2E75B6" }, // Dark blue background for headers
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    disabledAccounts.forEach((disabledAccount, index) => {
      const row = worksheet.addRow([
        disabledAccount.firstName,
        disabledAccount.lastName,
        disabledAccount.birthDate
          ? new Date(disabledAccount.birthDate).toLocaleDateString()
          : "N/A",
        disabledAccount.reasonDisabled,
      ]);

      // Style data rows with alternating row colors
      row.eachCell((cell, colNumber) => {
        // Add borders
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });

      // Alternate row background color for better readability
      if (index % 2 === 0) {
        row.eachCell((cell, colNumber) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F2F2F2" }, // Light gray for alternate rows
          };
        });
      }
    });

    // Set custom column widths based on category
    worksheet.getColumn(1).width = 15; // First Name
    worksheet.getColumn(2).width = 15; // Last Name
    worksheet.getColumn(3).width = 30; // Email
    worksheet.getColumn(4).width = 10; // Birth Date

    // Write the workbook to a file and trigger a download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a link element to trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Disabled Acc and Violations.xlsx";
    link.click();
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
        <button className="export_button" onClick={handleDownloadXLSX}>
          <img src={xlsx_icon} alt="" className="export_icon" />
          Export
        </button>
      </div>

      <div className="disabled_accounts_container">
        <h2>Disabled Accounts</h2>
        {disabledAccounts.length > 0 ? (
          <table className="disabled_accounts_table">
            <thead className="disabled_accounts_header">
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Age</th>
                <th>Reason</th>
                <th>Enable Account</th>
              </tr>
            </thead>
            <tbody className="disabled_accounts_body">
              {disabledAccounts.map((user, index) => {
                // Calculate age from birthDate if available
                const age = user.birthDate
                  ? Math.floor(
                      (new Date() - new Date(user.birthDate)) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )
                  : "N/A";

                return (
                  <tr key={user._id}>
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
                        onClick={() => handleEnableAccount(user._id)}
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
