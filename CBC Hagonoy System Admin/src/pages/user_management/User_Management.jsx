import "./User_Management.css";
import { search_ic, close_ic, xlsx_icon } from "../../assets/Images";
import axios from "axios";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { toast } from "react-hot-toast"; // Import toast for notifications
import ExcelJS from "exceljs";

const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age;
};

//confirmation modal

function ConfirmationModal({ record, onClose, onConfirm }) {
  return (
    <div className="confirmation_modal_container">
      <div className="confirmation_modal_content">
        <h2 className="confirm_modal_header">Archive User</h2>
        <p className="confirm_modal_context">
          Are you sure you want to archive{" "}
          <strong>
            {record.firstName} {record.lastName}
          </strong>
          ?
        </p>
        <div className="confirmation_modal_actions">
          <button className="edit_Modal_button" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal_cancel_button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationDModal({ record, onCloseD, onConfirmD }) {
  return (
    <div className="confirmation_modal_container">
      <div className="confirmation_modal_content">
        <h2 className="confirm_modal_header">Disable User</h2>
        <p className="confirm_modal_context">
          Are you sure you want to Disable{" "}
          <strong>
            {record.firstName} {record.lastName}
          </strong>
          ?
        </p>
        <div className="confirmation_modal_actions">
          <button className="edit_Modal_button" onClick={onConfirmD}>
            Confirm
          </button>
          <button className="modal_cancel_button" onClick={onCloseD}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Make sure _id is required
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmationDModal.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Make sure _id is required
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  onCloseD: PropTypes.func.isRequired,
  onConfirmD: PropTypes.func.isRequired,
};

//end of confirmation

function EditUserModal({ record, onClose, onSave }) {
  const [firstName, setFirstName] = useState(record.firstName || "");
  const [lastName, setLastName] = useState(record.lastName || "");
  const [gender, setGender] = useState(record.gender || "");
  const [birthDate, setBirthDate] = useState(record.birthDate || "");
  const [CellNum, setCellNum] = useState(record.CellNum || "");
  const [TelNum, setTelNum] = useState(record.TelNum || "");
  const [NetLead, setNetLead] = useState(record.NetLead || "");
  const [CellLead, setCellLead] = useState(record.CellLead || "");
  const [memberType, setMemberType] = useState(record.memberType || "");
  const [address, setAddress] = useState(
    record.address || { baseAddress: "", barangay: "", city: "", province: "" }
  );
  const [isBaptized, setIsBaptized] = useState(record.isBaptized || "");

  const handleSave = () => {
    onSave({
      ...record,
      firstName,
      lastName,
      gender,
      birthDate,
      CellNum,
      TelNum,
      NetLead,
      CellLead,
      address,
      memberType,
      isBaptized,
    });

    onClose();
  };

  return (
    <div className="edit_modal_container">
      <div className="modal_content_edit">
        <div className="edit_modal_header">
          <img
            src={close_ic}
            alt="exit_modal"
            className="close_edit_button"
            onClick={onClose}
          />
          <h2 className="edit_modal-text_header">Edit User</h2>
        </div>

        <div className="edit_modal_context_cont">
          <p className="edit_modal_context">
            You are now accessing the user information and able to edit.
          </p>
        </div>

        <h2 className="personal_info_edit_text">Personal Information</h2>
        <div className="form_edit_cont">
          <div className="form_edit_cont_left">
            <div className="form_edit_cont_rows">
              <input
                type="text"
                className="editInp_firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label className="editLabel_firstName">First Name:</label>
            </div>
            <div className="form_edit_cont_rows">
              <input
                className="editInp_lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label className="editLabel_lastName">Last Name:</label>
            </div>
            <div className="form_edit_cont_rows">
              <select
                className="editInp_userGender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option disabled value="">
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <label className="editLabel_userGender">Gender:</label>
            </div>
            <div className="form_edit_cont_rows">
              <input
                className="editInp_birthDate"
                type="date"
                value={birthDate.split("T")[0]} // Format for date input
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <label className="editLabel_birthDate">Birth Date:</label>
            </div>
            <div className="form_edit_cont_rows">
              <select
                className="editInp_userType"
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
              >
                <option disabled value="">
                  Select Member Type
                </option>
                <option value="Member">Member</option>
                <option value="Cellgroup Leader">Cellgroup Leader</option>
                <option value="Network Leader">Network Leader</option>
                <option value="Guest">Guest</option>
              </select>
              <label className="editLabel_memberType">Member Type:</label>
            </div>
          </div>

          <div className="form_edit_cont_right">
            <div className="form_edit_cont_rows">
              <input
                className="editInp_cellNumber"
                type="text"
                value={CellNum}
                onChange={(e) => setCellNum(e.target.value)}
              />
              <label className="editLabel_cellNumber">Cell Number:</label>
            </div>
            <div className="form_edit_cont_rows">
              <input
                className="editInp_telNumber"
                type="text"
                value={TelNum}
                onChange={(e) => setTelNum(e.target.value)}
              />
              <label className="editLabel_telNumber">Telephone Number:</label>
            </div>
            <div className="form_edit_cont_rows">
              <input
                className="editInp_netLeader"
                type="text"
                value={NetLead}
                onChange={(e) => setNetLead(e.target.value)}
              />
              <label className="editLabel_netLeader">Network Leader:</label>
            </div>
            <div className="form_edit_cont_rows">
              <input
                className="editInp_cellLeader"
                type="text"
                value={CellLead}
                onChange={(e) => setCellLead(e.target.value)}
              />
              <label className="editLabel_cellLeader">Cellgroup Leader:</label>
            </div>
            <div className="form_edit_cont_rows">
              <select
                className="editInp_isBaptized"
                value={isBaptized}
                onChange={(e) => setIsBaptized(e.target.value)}
              >
                <option disabled value="">
                  Baptism Status
                </option>
                <option value="Scheduled">Scheduled</option>
                <option value="Not Baptize">Not Baptize</option>
                <option value="Baptized">Baptized</option>
                <option value="Guest">Guest</option>
              </select>
              <label className="editLabel_cellLeader">Baptism Status:</label>
            </div>
          </div>
        </div>

        <div className="form_edit_cont_lower">
          <h3 className="address_header_edit">Address</h3>
          <div className="form_edit_cont_lower_rows">
            <div className="form_edit_cont_lower_columns">
              <input
                className="editInp_street"
                type="text"
                value={address.baseAddress}
                onChange={(e) =>
                  setAddress({ ...address, baseAddress: e.target.value })
                }
              />
              <label className="editLbl_street">
                House No. /Street /Subdivision:
              </label>
            </div>
            <div className="form_edit_cont_lower_columns">
              <input
                className="editInp_barangay"
                type="text"
                value={address.barangay}
                onChange={(e) =>
                  setAddress({ ...address, barangay: e.target.value })
                }
              />
              <label className="editLbl_barangay">Barangay:</label>
            </div>
            <div className="form_edit_cont_lower_columns">
              <input
                className="editInp_city"
                type="text"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <label className="editLbl_city">City:</label>
            </div>
            <div className="form_edit_cont_lower_columns">
              <input
                className="editInp_province"
                type="text"
                value={address.province}
                onChange={(e) =>
                  setAddress({ ...address, province: e.target.value })
                }
              />
              <label className="editLbl_province">Province:</label>
            </div>
          </div>
        </div>

        <div className="edit_button_container_modal">
          <button className="edit_Modal_button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

EditUserModal.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Make sure _id is required
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    gender: PropTypes.string,
    birthDate: PropTypes.string, // Assuming birthDate is a string
    address: PropTypes.shape({
      // Add address shape if used
      baseAddress: PropTypes.string,
      barangay: PropTypes.string,
      city: PropTypes.string,
      province: PropTypes.string,
    }),
    CellNum: PropTypes.string,
    TelNum: PropTypes.string,
    NetLead: PropTypes.string,
    CellLead: PropTypes.string,
    memberType: PropTypes.string,
    isBaptized: PropTypes.string,
    // Add other necessary fields as per your data structure
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default function User_Management() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationDModal, setConfirmationDModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [userId, setUserId] = useState("");
  const [networks, setNetworks] = useState([]);
  const [cellGroups, setCellGroups] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    network: "",
    dateJoined: "",
    cellGroup: "",
  });

  const fetchDropdownOptions = async () => {
    try {
      const [networksResponse, cellGroupsResponse] = await Promise.all([
        axios.get("https://capstone-project0001-2.onrender.com/network"),
        axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
        ),
      ]);
      setNetworks(networksResponse.data);
      setCellGroups(cellGroupsResponse.data);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchDropdownOptions();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/records"
      );
      console.log(response.data);
      setRecords(response.data);
      setFilteredRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleConfirmArchive = async () => {
    try {
      await axios.delete(
        `https://capstone-project0001-2.onrender.com/archive/${userId}`,
        {
          withCredentials: true, // If authentication is required
        }
      );
      toast.success("User archived successfully");
      setConfirmationModal(false);
      fetchRecords(); // Refresh the list after archiving
    } catch (error) {
      console.error("Error archiving user:", error);
      toast.error("Failed to archive user. Please try again.");
    }
  };

  const handleConfirmDisable = async () => {
    try {
      await axios.delete(
        `https://capstone-project0001-2.onrender.com/disable/${userId}`
      );
      toast.success("Account Disabled successfully");
      setConfirmationDModal(false);
      fetchRecords(); // Refresh the list after archiving
    } catch (error) {
      console.error("Error archiving user:", error);
      toast.error("Failed to archive user. Please try again.");
    }
  };

  const handleOpenConfirmation = (record) => {
    if (record && record._id) {
      setUserId(record._id);
      setCurrentRecord(record);
      setConfirmationModal(true);
    } else {
      console.error("Invalid record:", record);
    }
  };

  const handleOpenConfirmationD = (record) => {
    if (record && record._id) {
      setUserId(record._id);
      setCurrentRecord(record);
      setConfirmationDModal(true);
    } else {
      console.error("Invalid record:", record);
    }
  };

  const handleEditModal = (record) => {
    if (record && record._id) {
      setUserId(record._id);
      setCurrentRecord(record);
      setModalEdit(true);
    } else {
      console.error("Invalid record:", record);
    }
  };

  const closeModal = () => {
    setModalEdit(false);
    setCurrentRecord(null);
  };

  const handleSaveChanges = async (updatedRecord) => {
    if (!userId) {
      console.error("User ID is not defined.");
      return;
    }

    try {
      await axios.put(
        `https://capstone-project0001-2.onrender.com/update-record/${userId}`,
        updatedRecord,
        {
          withCredentials: true,
        }
      );
      fetchRecords();
      toast.success("User updated successfully");
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDownloadXLSX = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ChurchUsers", {
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
      "Email",
      "Birth Date",
      "Address",
      "Cell Number",
      "Tel Number",
      "Gender",
      "Member Type",
      "Baptism Status",
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

    filteredRecords.forEach((filteredRecord, index) => {
      const row = worksheet.addRow([
        filteredRecord.firstName,
        filteredRecord.lastName,
        filteredRecord.email,
        filteredRecord.birthDate
          ? new Date(filteredRecord.birthDate).toLocaleDateString()
          : "N/A",
        filteredRecord.address
          ? `${filteredRecord.address.baseAddress || "N/A"}, ${
              filteredRecord.address.barangay || "N/A"
            }, ${filteredRecord.address.city || "N/A"}, ${
              filteredRecord.address.province || "N/A"
            }`
          : "N/A", // Add fallback if address is undefined
        filteredRecord.CellNum,
        filteredRecord.TelNum,
        filteredRecord.gender,
        filteredRecord.memberType,
        filteredRecord.isBaptized,
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
    worksheet.getColumn(5).width = 45; // Address (longer width)
    worksheet.getColumn(6).width = 12; // Cell Number
    worksheet.getColumn(7).width = 12; // Tel Number
    worksheet.getColumn(8).width = 8; // Gender
    worksheet.getColumn(9).width = 15; // Member Type
    worksheet.getColumn(10).width = 12; // Baptism Status

    // Write the workbook to a file and trigger a download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a link element to trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ChurchUsers.xlsx";
    link.click();
  };

  const applyFilters = () => {
    const filtered = records.filter((record) => {
      // Split userID by the hyphen to extract each part
      if (!record.userID) {
        return false; // Skip this record if userID is missing
      }

      // Split userID by the hyphen to extract each part
      const userIDParts = record.userID.split("-");

      // Ensure there are enough parts in the split userID
      if (userIDParts.length < 3) {
        return false; // Skip this record if the userID doesn't have the expected number of parts
      }

      // Extract the parts from the userID
      const networkPart = userIDParts[0]; // First part ("01")
      const datePart = userIDParts[1]; // Second part ("202410")
      const cellGroupPart = userIDParts[2]; // Third part ("0001")

      // Match the "network" part with the filter value
      const matchesNetwork = filters.network
        ? networkPart === filters.network
        : true;

      // Format the date filter to "YYYYMM"
      const formattedDateFilter = filters.dateJoined
        ? filters.dateJoined.slice(0, 7).replace("-", "") // Extract "YYYYMM" from "YYYY-MM-DD"
        : null;

      // Match the "date" part with the filter value
      const matchesDate = formattedDateFilter
        ? datePart === formattedDateFilter
        : true;

      // Match the "cellGroup" part with the filter value
      const matchesCellGroup = filters.cellGroup
        ? cellGroupPart === filters.cellGroup
        : true;

      // Check if the search query matches first or last name
      const matchesSearchQuery =
        filters.searchTerm === "" ||
        (record.firstName &&
          record.firstName
            .toLowerCase()
            .startsWith(filters.searchTerm.toLowerCase())) ||
        (record.lastName &&
          record.lastName
            .toLowerCase()
            .startsWith(filters.searchTerm.toLowerCase()));

      // Return filtered results if all conditions match
      return (
        matchesSearchQuery && matchesNetwork && matchesDate && matchesCellGroup
      );
    });

    setFilteredRecords(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search term changed:", value);
    setFilters((prev) => ({ ...prev, searchTerm: value })); // Sync with filters
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      network: "",
      dateJoined: "",
      cellGroup: "",
    });
    setSearchTerm(""); // Clear search term
    setFilteredRecords(records); // Restore full list of records
  };

  const handleNetworkChange = (e) => {
    const newNetwork = e.target.value;
    console.log("Setting network filter to:", newNetwork); // Log network value before setting
    setFilters((prev) => ({
      ...prev,
      network: newNetwork,
    }));
    applyFilters(); // Reapply filters
  };

  const handleCellGroupChange = (e) => {
    const newCellGroup = e.target.value;
    console.log("Setting cell group filter to:", newCellGroup); // Log cell group value before setting
    setFilters((prev) => ({
      ...prev,
      cellGroup: newCellGroup,
    }));
    applyFilters(); // Reapply filters
  };

  const handleDateChange = (e) => {
    const newDateJoined = e.target.value;
    console.log("Setting date filter to:", newDateJoined); // Log date value before setting
    setFilters((prev) => ({
      ...prev,
      dateJoined: newDateJoined,
    }));
    applyFilters(); // Reapply filters
  };

  return (
    <div className="main_user_management_cont">
      <div className="header_user_management">
        <p className="church_name_user_management">
          CHRISTIAN BIBLE CHURCH OF HAGONOY
        </p>
        <h1 className="user_management_lbl">User Management</h1>
      </div>

      <div className="search_bar_cont_userManage">
        <label>
          Network:
          <select value={filters.network} onChange={handleNetworkChange}>
            <option value="">All Networks</option>
            {networks.map((network) => (
              <option key={network.networkID} value={network.networkID}>
                {network.networkLeader}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date Joined:
          <input
            className="date-picker"
            type="date"
            value={filters.dateJoined}
            onChange={handleDateChange}
          />
        </label>

        <label>
          Cell Group:
          <select value={filters.cellGroup} onChange={handleCellGroupChange}>
            <option value="">All Cell Groups</option>
            {cellGroups && cellGroups.length > 0 ? (
              cellGroups.map((cellGroup, index) => {
                const cellgroupID = cellGroup.cellgroupID;
                const fourDigitID =
                  cellgroupID && typeof cellgroupID === "string"
                    ? cellgroupID.split("-")[1]
                    : null;

                const key = `${fourDigitID}-${cellgroupID}-${index}`;

                return (
                  <option key={key} value={fourDigitID}>
                    {cellGroup.cellgroupName}
                  </option>
                );
              })
            ) : (
              <option disabled>No Cell Groups Available</option>
            )}
          </select>
        </label>

        <button className="reset_btn" onClick={resetFilters}>
          Reset
        </button>

        <button className="export_button" onClick={handleDownloadXLSX}>
          <img src={xlsx_icon} alt="" className="expport_icon" />
          Export
        </button>
        <input
          type="text"
          className="search_bar_userManage"
          value={filters.searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for users"
        />
        <img
          src={search_ic}
          alt="search_icon"
          className="search_icon_userManage"
        />
      </div>

      <p className="description-cell">List of all the current users.</p>
      <div className="user_management_container">
        <table className="user-management-accounts-table">
          <thead className="user-management-table-headers">
            <tr className="table-header-row">
              <th className="table-header number_management">UserID</th>
              <th className="table-header name_management">Name</th>
              <th className="table-header age_management">Age</th>
              <th className="table-header gender_management">Gender</th>
              <th className="table-header editUser_management">Edit User</th>
            </tr>
          </thead>
          <tbody className="table-body-userManagement">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={record.id}>
                  <td className="user_number_management">{record.userID}</td>
                  <td className="user_name_management">
                    {record.firstName} {record.lastName}
                  </td>
                  <td className="user_age_management">
                    {calculateAge(record.birthDate)}
                  </td>
                  <td className="user_gender_management">{record.gender}</td>
                  <td className="user_edit_management">
                    <div className="user_edit_management_btn_cont">
                      <button
                        className="edit_user_btn"
                        onClick={() => handleEditModal(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="archive_user_btn"
                        onClick={() => handleOpenConfirmation(record)}
                      >
                        Archive
                      </button>
                    </div>
                    <button
                      className="disable"
                      onClick={() => handleOpenConfirmationD(record)}
                    >
                      Disable Account
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalEdit && currentRecord && (
        <EditUserModal
          record={currentRecord}
          onClose={closeModal}
          onSave={handleSaveChanges} // Pass the new handleSaveChanges function
        />
      )}

      {confirmationModal && currentRecord && (
        <ConfirmationModal
          record={currentRecord}
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleConfirmArchive}
        />
      )}

      {confirmationDModal && currentRecord && (
        <ConfirmationDModal
          record={currentRecord}
          onCloseD={() => setConfirmationDModal(false)}
          onConfirmD={handleConfirmDisable}
        />
      )}
    </div>
  );
}
