import "./User_Management.css";
import { search_ic, close_ic } from "../../assets/Images";
import axios from "axios";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {toast} from 'react-hot-toast'// Import toast for notifications

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

function EditUserModal({ record, onClose, onSave }) {
  const [firstName, setFirstName] = useState(record.firstName || "");
  const [lastName, setLastName] = useState(record.lastName || "");
  const [gender, setGender] = useState(record.gender || "");
  const [birthDate, setBirthDate] = useState(record.birthDate || "");
  const [CellNum, setCellNum] = useState(record.CellNum || "");
  const [TelNum, setTelNum] = useState(record.TelNum || "");
  const [NetLead, setNetLead] = useState(record.NetLead || "");
  const [CellLead, setCellLead] = useState(record.CellLead || "");
  const [address, setAddress] = useState(
    record.address || { baseAddress: "", barangay: "", city: "", province: "" }
  );

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
                    <button className="edit_Modal_button" onClick={handleSave}>Save Changes</button>
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
  const [currentRecord, setCurrentRecord] = useState(null);
  const [userId, setUserId] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/records");
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleApplyFilters(value);
  };

  const filterRecords = (query) => {
    return records.filter((record) => {
      const matchesSearchQuery =
        record.firstName.toLowerCase().startsWith(query.toLowerCase()) ||
        record.lastName.toLowerCase().startsWith(query.toLowerCase());

      return matchesSearchQuery;
    });
  };

  const handleApplyFilters = (query) => {
    const filtered = filterRecords(query);
    setFilteredRecords(filtered);
  };

  const handleEditModal = (record) => {
    if (record && record._id) {
      setUserId(record._id); // Assuming user has an _id property// Check if record is valid and has an _id
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
      return; // Early return if userId is not set
    }

    try {
      await axios.put(
        `http://localhost:8001/update-record/${userId}`,
        updatedRecord,
        {
          withCredentials: true,
          headers: {
            // Optional: Include token if needed
          },
        }
      );
      toast.success("User updated successfully");
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
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
        <input
          type="text"
          className="search_bar_userManage"
          value={searchTerm}
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
              <th className="table-header number_management">No.</th>
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
                  <td className="user_number_management">{index + 1}</td>
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
                      <button className="archive_user_btn">Archive</button>
                    </div>
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
    </div>
  );
}
