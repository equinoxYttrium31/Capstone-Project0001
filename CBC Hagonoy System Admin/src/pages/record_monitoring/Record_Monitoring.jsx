import "./Record_Monitoring.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios"; // Import Axios
import { toast } from "react-hot-toast";
import {
  search_ic,
  filter_ic,
  user_placeholder,
  add_ic,
  archived_ic,
  close_ic,
} from "../../assets/Images";
import { groupCards } from "../../components/Utility Functions/layoutUtility.js";
import { io } from "socket.io-client"; // Import Socket.IO client

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

function Record_Monitoring() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [addNewUserModal, setAddNewUserModal] = useState(false);
  const [newCellGroupModal, setNewCellGroupModal] = useState(false);
  const [openArchive, setOpenArchiveModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [searchedUser, setSearchedUser] = useState(""); // State for search query
  const socket = useRef(null); // Create a ref for the socket

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8001/archivedUsers'); // Adjust the endpoint as needed
        setArchivedUsers(response.data); // Set the response data to state
      } catch (error) {
        console.error('Error fetching archived users:', error);
      }
    };

    fetchArchivedUsers();
  }, []); // Empty dependency array to run once on component mount
  
  const handleClearButton = () => {
    setSelectedRange("");
    setSelectedGender("");
    setSelectedMemberType("");
    setSearchedUser(""); // Clear the search input
    setFilteredRecords(records); // Reset filtered records to show all
    toggleFilter(false);
  };

  //This will be where the Adding Starts
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const openConfirmationModal = (action) => {
    setConfirmAction(() => action);
    setConfirmationModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    
    setConfirmationModal(false);
  };

  const handleCancel = () => {
    setConfirmationModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddingRecord = (e) => {
    e.preventDefault();
    openConfirmationModal(() => confirmAddingRecord());
  };

  const confirmAddingRecord = async () => {
    const { firstName, lastName, email, password, confirmPassword, birthDate } =
      data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:8001/add-record", {
        firstName,
        lastName,
        email,
        password,
        birthDate,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        // Reset data to clear input fields
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          birthDate: "",
        });
        toast.success("Record Added. Thank You!");
        setTimeout(function() {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  //this is where Adding stops

  //Archive Modal Configuration Start

  const handleOpenArchived = () => {
    setOpenArchiveModal(true);
  };

  const handleCloseArchieved = () =>{
    setOpenArchiveModal(false);
  }

  //Archive Modal Ends

  const toggleFilter = () => {
    setFilterModal(!filterModal);
  };

  const setAddModalActive = () => {
    setAddNewUserModal(true);
  };

  const setCellGroupModal = () => {
    setNewCellGroupModal(true);
  };

  const handleCloseCellgroup = () => {
    setNewCellGroupModal(false);
  };

  const handleCloseAddModal = () => {
    setAddNewUserModal(false);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      setSelectedRange(value);
    } else if (name === "gender") {
      setSelectedGender(value);
    } else if (name === "memberType") {
      setSelectedMemberType(value);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    socket.current = io("http://localhost:8001"); // Connect to the WebSocket server

    socket.current.on("updateRecords", (newRecord) => {
      // Add new record to existing records or update if needed
      setRecords((prevRecords) => {
        const updatedRecords = prevRecords.map((record) => 
          record.id === newRecord.id ? newRecord : record // Update existing record
        );

        if (!updatedRecords.find(record => record.id === newRecord.id)) {
          // If record doesn't exist, add it
          updatedRecords.push(newRecord);
        }

        return updatedRecords; // Return updated records
      });
    });

    // Fetch initial records
    const fetchRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8000/records"); // Fetch all records
        console.log(response.data); // Log the response data for debugging
        setRecords(response.data);
        setFilteredRecords(response.data); // Set initial filtered records to all fetched records
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords(); // Fetch all records on initial render

    return () => {
      socket.current.disconnect(); // Cleanup on component unmount
    };
  }, []);

  
  const filterRecords = (query) => {
    return records.filter((record) => {
      const matchesSearchQuery =
        record.firstName.toLowerCase().startsWith(query.toLowerCase()) ||
        record.lastName.toLowerCase().startsWith(query.toLowerCase());

      const matchesAgeFilter = selectedRange
        ? (() => {
            const [minAge, maxAge] = selectedRange.split("-").map(Number);
            const age = calculateAge(record.birthDate);
            return age >= minAge && age <= maxAge;
          })()
        : true;

      const matchesGenderFilter = selectedGender
        ? record.gender === selectedGender
        : true;

      return matchesSearchQuery && matchesAgeFilter && matchesGenderFilter;
    });
  };

  const handleApplyFilters = () => {
    const filtered = filterRecords(searchedUser); // Get filtered records based on search and filters
    setFilteredRecords(filtered); // Update the displayed records
    toggleFilter(false); // Close the filter modal after applying
  };

  // Update filtered records based on search input in real-time
  const handleSearchChange = (e) => {
    const query = e.target.value.trim(); // Get the current search input and trim whitespace
    setSearchedUser(query); // Update the searched user input

    if (query === "") {
      const filtered = filterRecords(query);
      setFilteredRecords(filtered); // Show all records if the search is cleared
    } else {
      const filtered = filterRecords(query); // Filter records based on the current query
      setFilteredRecords(filtered); // Update the displayed records
    }
  };

  const groupedRecords = groupCards(filteredRecords, 3); // Group filtered records for display

  return (
    <div className="record_monitoring_mainCont">
      <div className="record_upper_part">
        <div className="record_header_cont">
          <p className="church_name_record">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </p>
          <h2 className="record_monitor_title">Recording Management</h2>
        </div>
        <div className="search_record">
          <div className="search_bar_cont">
            <input
              type="text"
              value={searchedUser}
              name="search"
              id="search_record"
              className="search_record_input"
              placeholder="Search record..."
              onChange={handleSearchChange} // Call handleSearchChange for real-time search
            />
            <img
              src={search_ic}
              alt="search_icon"
              className="search_record_icon"
            />
          </div>
          <img
            src={filter_ic}
            alt="filter_icon"
            className="filter_record_icon"
            onClick={toggleFilter}
          />
        </div>
      </div>
      <div className="record_lower_part">
        <div className="record_lower_part_left">
          {groupedRecords.map((group, index) => (
            <div className="record_row" key={index}>
              {group.map((record, idx) => (
                <div className="record_content_card" key={idx}>
                  <img
                    src={record.profilePic || user_placeholder}
                    alt="profile_picture"
                    className="record_container_profile"
                  />
                  <div className="record_content_card_deets">
                    <h2 className="record_person_name">{record.firstName}</h2>
                    <p className="record_person_age_and_gender">
                      {calculateAge(record.birthDate)} , {record.gender}
                    </p>
                    <div className="record_person_type">
                      <h2 className="record_type_text">Member</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="divider_lower"></div>
        <div className="record_lower_part_right">
          <div
            className="selection_container_record"
            onClick={setAddModalActive}
          >
            <img src={add_ic} alt="add_record_ic" className="selection_icon" />
            <h2 className="selection_title">Create New Record</h2>
          </div>
          <div
            className="selection_container_record"
            onClick={setCellGroupModal}
          >
            <img
              src={add_ic}
              alt="add_cell_group_ic"
              className="selection_icon"
            />
            <h2 className="selection_title">Add New Cell Group</h2>
          </div>
          <div
            className="selection_container_record"
            onClick={handleOpenArchived}
          >
            <img
              src={archived_ic}
              alt="archive_records_ic"
              className="selection_icon"
            />
            <h2 className="selection_title">Archived Records</h2>
          </div>
        </div>
      </div>

      {filterModal && (
        <div className="filter_modal">
          <div className="filter_Modal_Container">
            <div className="top_container">
              <h2 className="filter_header">User Filters</h2>
            </div>
            <div className="middle_container">
              <p className="filter_text">
                Use filters to make it easier to find accounts.
              </p>
              <div className="filter_selections">
                <div className="row_filter_selection">
                  <h3 className="filter_selection_label">Age: </h3>
                  <select
                    name="age"
                    className="filter_select_input"
                    onChange={handleSelectChange}
                    value={selectedRange || " "}
                  >
                    <option disabled value=" ">
                      Select Age
                    </option>
                    <option value="1-18">18 or below</option>
                    <option value="19-21">19-21</option>
                    <option value="22-25">22-25</option>
                    <option value="26-29">26-29</option>
                    <option value="30-33">30-33</option>
                    <option value="34-37">34-37</option>
                    <option value="38-41">38-41</option>
                    <option value="42-45">42-45</option>
                    <option value="46-49">46-49</option>
                    <option value="50-100">50 or above</option>
                  </select>
                </div>
                <div className="row_filter_selection">
                  <h3 className="filter_selection_label">Gender: </h3>
                  <select
                    name="gender"
                    className="filter_select_input"
                    onChange={handleSelectChange}
                    value={selectedGender || " "}
                  >
                    <option disabled value=" ">
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="row_filter_selection">
                  <h3 className="filter_selection_label">Member Type: </h3>
                  <select
                    name="memberType"
                    className="filter_select_input"
                    onChange={handleSelectChange}
                    value={selectedMemberType || " "}
                  >
                    <option disabled value=" ">
                      Select Type
                    </option>
                    <option value="Member">Member</option>
                    <option value="CellgroupLeader">Cellgroup Leader</option>
                    <option value="NetworkLeader">NetworkLeader</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="lower_container">
              <div className="buttons_cont_filter">
                <button
                  className="clear_filter_button"
                  onClick={handleClearButton}
                >
                  Clear
                </button>
                <button
                  className="apply_filter_button"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Add new Record Modal*/}
      {addNewUserModal && (
        <div className="newUserModal">
          <div className="mainAdding_container">
            <div className="header_part_add">
              <h2 className="add_new_user_header">Add New Record</h2>
              <img
                src={close_ic}
                alt="exit_button"
                className="add_close_button"
                onClick={handleCloseAddModal}
              />
            </div>
            <div className="main_add_cntr">
              <p className="reminder_before_adding">
                Remind the user to edit their user information after being
                added.
              </p>
              <div className="adding_cont">
                <h2 className="personal_header_adding">Personal Details</h2>
                <div className="rows_adding_cont">
                  <input
                    type="text"
                    className="first_Name"
                    name="firstName"
                    placeholder=""
                    value={data.firstName}
                    onChange={handleChange}
                    required
                  />
                  <label className="first_Name_lbl">First Name</label>
                </div>
                <div className="rows_adding_cont">
                  <input
                    type="text"
                    className="last_Name"
                    name="lastName"
                    placeholder=""
                    value={data.lastName}
                    onChange={handleChange}
                    required
                  />
                  <label className="last_Name_lbl">Last Name:</label>
                </div>
                <div className="rows_adding_cont">
                  <input
                    type="date"
                    className="birth_Date"
                    name="birthDate"
                    placeholder=""
                    value={data.birthDate}
                    onChange={handleChange}
                    required
                  />
                  <label className="birth_Date_lbl">Birthdate:</label>
                </div>
                <h2 className="account_header_adding">Account Details</h2>
                <div className="rows_adding_cont">
                  <input
                    type="email"
                    className="email_Address"
                    name="email"
                    placeholder=""
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                  <label className="email_Address_lbl">Email:</label>
                </div>
                <div className="rows_adding_cont">
                  <input
                    type="password"
                    className="password_Init"
                    name="password"
                    placeholder=""
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                  <label className="password_Init_lbl">Password:</label>
                </div>
                <div className="rows_adding_cont">
                  <input
                    type="password"
                    className="password_Conf"
                    name="confirmPassword"
                    placeholder=""
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <label className="password_Conf_lbl">Confirm Password:</label>
                </div>
              </div>

              <div className="adding_buttons_container">
                <div className="row_adding_buttons_container">
                  <button
                    className="add_new_record"
                    onClick={handleAddingRecord}
                  >
                    Add New Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmationModal && (
        <div className="confirmation-modal">
          <div className="confirmation-modal-content">
            <h2 className="confirmation-modal-header">Are you sure?</h2>
            <p className="confirmation-modal-p">
              Do you want to proceed with this action?
            </p>
            <div className="confirmation-modal-buttons">
              <button
                className="confirmation-confirm-button"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                className="confirmation-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {newCellGroupModal && (
        <div className="create_cellgroup_cont">
          <div className="cellgroup_main_cont">
            <div className="cellgroup_header_cont">
              <h2 className="cellgroup_header">Create New Cellgroup</h2>
              <img
                src={close_ic}
                alt="close_icon"
                onClick={handleCloseCellgroup}
                className="close_cellgroup_modal"
              />
            </div>

            <div className="create_cellgroup_main_cont">
              <p className="cellgroup_text">Creating a new cellgroup.</p>
              <div className="cellgroup_form_cont">
                <div className="cellgroup_inputs_cont">
                  <h3 className="cellgroup_name_label">Cellgroup Name:</h3>
                  <input type="text" className="cellgroup_name_input" />
                </div>
                <div className="cellgroup_inputs_cont">
                  <h3 className="cellgroup_name_label">Cellgroup Leader:</h3>
                  <input type="text" className="cellgroup_name_input" />
                </div>
                <div className="cellgroup_create_btn">
                  <button className="create_cellgroup_btn">
                    Create Cellgroup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/**New Modal for Archived Records*/}
      {openArchive && (
        <div className="archivedRecordsModal">
          <div className="showArchiveRecords_Cont">
            <div className="header_archived_cont">
              <h2 className="archiveHeader_text">Archived Records</h2>
              <img
                src={close_ic}
                alt="close_button"
                className="close_archive_modal"
                onClick={handleCloseArchieved}
              />
            </div>
            <div className="main_container_archive">
              <div className="archive_preText_cont">
                <p className="archive_preText">
                  Archived records are records that have been moved to temporary
                  deletion.
                </p>
              </div>
              <div className="archive_list_mainContainer">
                <table className="archived-accounts-table">
                  <thead className="archived-accounts-thead">
                    <tr className="archived-accounts-header-row">
                      <th className="archived-accounts-header-number"> No.</th>
                      <th className="archived-accounts-header-name">Name</th>
                      <th className="archived-accounts-header-age">Age</th>
                      <th className="archived-accounts-header-gender">Gender</th>
                      <th className="archived-accounts-header-date">Date Archived</th>
                    </tr>
                  </thead>
                  <tbody className="archieve-accounts-body-main">
                    {archivedUsers.map((user, index) => (
                        <tr key={user._id} className="archived-accounts-row">
                          <td className="archived-accounts-number">{index + 1}</td>
                          <td className="archived-accounts-name">{`${user.firstName} ${user.lastName}`}</td>
                          <td className="archived-accounts-age">{calculateAge(user.birthDate)}</td>
                          <td className="archived-accounts-gender">{user.gender}</td>
                          <td className="archived-accounts-date">{user.dateArchieved}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Record_Monitoring;
