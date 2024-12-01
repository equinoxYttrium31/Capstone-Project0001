import "./Record_Monitoring.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios"; // Import Axios
import { toast } from "react-hot-toast";
import {
  search_ic,
  filter_ic,
  add_ic,
  archived_ic,
  close_ic,
  edit_ic,
  avatar_male,
  avatar_female,
  user_placeholder,
} from "../../assets/Images";
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
  const [editingCellGroupID, setEditingCellGroupID] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [addNewUserModal, setAddNewUserModal] = useState(false);
  const [newCellGroupModal, setNewCellGroupModal] = useState(false);
  const [newNetworkModal, setNewNetworkModal] = useState(false);
  const [editCellGroupModal, setEditCellGroupModal] = useState(false);
  const [editNetworkModal, setEditNetworkModal] = useState(false);
  const [openArchive, setOpenArchiveModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [cellgroupData, setCellgroupData] = useState({
    cellgroupName: "",
    cellgroupLeader: "",
    networkLeader: "",
  });
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [searchedUser, setSearchedUser] = useState(""); // State for search query
  const socket = useRef(null); // Create a ref for the socket
  const [cellGroups, setCellGroups] = useState([]);
  const [editModalC, setEditModalC] = useState(false);
  const [networkData, setNetworkData] = useState([]);
  const [expanded, setExpanded] = useState({});

  //expandable cellgroups
  useEffect(() => {
    const fetchCellGroups = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
        ); // Adjust the URL as needed
        setCellGroups(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching cell groups:", error);
      }
    };

    fetchCellGroups();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the current state
    }));
  };

  //This will be where the Adding Starts
  const setAddModalActive = () => {
    setAddNewUserModal(true);
  };

  const handleCloseAddModal = () => {
    setAddNewUserModal(false);
  };

  const handleCloseEdit = () => {
    setEditCellGroupModal(false);
  };

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
    setCellData((prevData) => ({ ...prevData, [name]: value }));
    setNetData((prevData) => ({ ...prevData, [name]: value }));
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
      const { data } = await axios.post(
        "https://capstone-project0001-2.onrender.com/add-record",
        {
          firstName,
          lastName,
          email,
          password,
          birthDate,
        }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          birthDate: "",
        });
        toast.success("Record Added. Thank You!");
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
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  //Cellgroup Modal Functions
  const [hasTyped, setHasTyped] = useState(false);
  const [cellData, setCellData] = useState({
    cellgroupName: "",
    cellgroupLeader: "",
    networkLeader: "",
  });

  const [netData, setNetData] = useState({
    networkLeader: "",
  });

  const handleChangeCellGroup = (e) => {
    const { name, value } = e.target;

    // Update cellData
    setCellData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Set hasTyped to true if the user types into cellgroupName
    if (name === "cellgroupName") {
      setHasTyped(value.length > 0);
    }

    // If the user clears the cellgroupLeader, clear the cellgroupName too
    if (name === "cellgroupLeader") {
      if (value === "") {
        setCellData((prevData) => ({
          ...prevData,
          cellgroupName: "",
        }));
      } else {
        // Automatically update cellgroupName when the cellgroupLeader is set
        setCellData((prevData) => ({
          ...prevData,
          cellgroupName: `${value}'s CellGroup`,
        }));
      }
    }
  };

  const fetchCellGroupData = async (cellgroupID) => {
    try {
      const response = await fetch(
        `https://capstone-project0001-2.onrender.com/cellgroups/${cellgroupID}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      console.log("Fetched Data:", data); // Log fetched data
      setCellgroupData(data); // Update state with fetched data
    } catch (err) {
      console.error("Error fetching cell group data:", err);
    }
  };

  const handleEdit = (cellgroupID) => {
    setEditingCellGroupID(cellgroupID);
    fetchCellGroupData(cellgroupID);
    setEditModalC(true);
    console.log(cellgroupData);
  };

  const handleChangeNetwork = (e) => {
    const { name, value } = e.target;

    // Update cellData
    setNetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Determine the displayed value for cellgroupName
  const displayValue =
    !hasTyped && cellData.cellgroupLeader
      ? `${cellData.cellgroupLeader}'s Cellgroup`
      : cellData.cellgroupName;

  const setCellGroupModal = () => {
    setNewCellGroupModal(true);
  };

  const setNetworkModal = () => {
    setNewNetworkModal(true);
  };

  const setEditNetwork = () => {
    setEditNetworkModal(true);
  };

  useEffect(() => {
    const fetchNetworksDetails = async () => {
      try {
        const response = await fetch(
          "https://capstone-project0001-2.onrender.com/networks"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const netData = await response.json();
        console.log(netData);
        setNetworkData(netData);
      } catch (error) {
        console.error("Error fetching network details:", error);
      }
    };
    fetchNetworksDetails();
  }, []);

  const setEditCellgroup = () => {
    setEditCellGroupModal(true);
  };

  const handleCloseCellgroup = () => {
    setCellData({
      cellgroupName: "",
      cellgroupLeader: "",
      networkLeader: "",
    });
    setHasTyped(false); // Reset hasTyped when closing the modal
    setNewCellGroupModal(false);
  };

  const handleCloseNetwork = () => {
    setNetData({
      networkLeader: "",
    });
    setNewNetworkModal(false);
  };

  const handleAddCellgroup = async () => {
    const { cellgroupName, cellgroupLeader, networkLeader } = cellData;

    console.log("Sending data:", {
      cellgroupName,
      cellgroupLeader,
      networkLeader,
    });
    // Check for required fields before sending
    if (!cellgroupName || !cellgroupLeader) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/create-cellgroup",
        {
          cellgroupName,
          cellgroupLeader,
          networkLeader,
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        // Clear form and show success message
        handleCloseCellgroup(); // Use existing close function to reset state
        toast.success("CellGroup Added. Thank You!");

        try {
          const response = await axios.get(
            "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
          ); // Adjust the URL as needed
          setCellGroups(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching cell groups:", error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Creation of CellGroup failed. Please try again.");
    }
  };

  const handleAddNetwork = async () => {
    const { networkLeader } = netData;

    console.log("Sending data:", {
      networkLeader,
    });
    // Check for required fields before sending
    if (!networkLeader || !networkLeader) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://capstone-project0001-2.onrender.com/create-network",
        {
          networkLeader,
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        // Clear form and show success message
        handleCloseNetwork(); // Use existing close function to reset state
        toast.success("Network Added. Thank You!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Creation of Network failed. Please try again.");
    }
  };

  //Archive Modal Configuration Start
  const handleOpenArchived = () => {
    setOpenArchiveModal(true);
  };

  const handleCloseArchieved = () => {
    setOpenArchiveModal(false);
  };

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/archivedUsers"
        );
        setArchivedUsers(response.data);
      } catch (error) {
        console.error("Error fetching archived users:", error);
      }
    };

    fetchArchivedUsers();
  }, []);

  //Modal Filter & Search Function
  const toggleFilter = () => {
    setFilterModal(!filterModal);
  };

  const handleClearButton = () => {
    setSelectedRange("");
    setSelectedGender("");
    setSelectedMemberType("");
    setSearchedUser("");
    setFilteredRecords(records);
    toggleFilter(false);
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

  useEffect(() => {
    socket.current = io("https://capstone-project0001-2.onrender.com");
    socket.current.on("updateRecords", (newRecord) => {
      setRecords((prevRecords) => {
        const updatedRecords = prevRecords.map((record) =>
          record.id === newRecord.id ? newRecord : record
        );
        if (!updatedRecords.find((record) => record.id === newRecord.id)) {
          updatedRecords.push(newRecord);
        }

        return updatedRecords;
      });
    });

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

    fetchRecords();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleOnSave = async () => {
    const { cellgroupName, cellgroupLeader, networkLeader } = cellgroupData;
    console.log(editingCellGroupID);
    try {
      const response = await axios.put(
        `https://capstone-project0001-2.onrender.com/cellgroups/${editingCellGroupID}`,
        {
          networkLeader,
          cellgroupLeader,
          cellgroupName,
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setCellgroupData({
          cellgroupName: "",
          cellgroupLeader: "",
          networkLeader: "",
        });
        setEditModalC(false);
        toast.success("CellGroup Updated. Thank You!");

        try {
          const response = await axios.get(
            "https://capstone-project0001-2.onrender.com/fetch-cellgroups"
          ); // Adjust the URL as needed
          setCellGroups(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching cell groups:", error);
        }
      }
    } catch (error) {
      console.error("Error updating Cellgroup:", error);
    }
  };

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

      const matchesTypeFilter = selectedMemberType
        ? record.memberType === selectedMemberType
        : true;

      return (
        matchesSearchQuery &&
        matchesAgeFilter &&
        matchesTypeFilter &&
        matchesGenderFilter
      );
    });
  };

  const handleApplyFilters = () => {
    const filtered = filterRecords(searchedUser);
    setFilteredRecords(filtered);
    toggleFilter(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchedUser(query);

    if (query === "") {
      const filtered = filterRecords(query);
      setFilteredRecords(filtered);
    } else {
      const filtered = filterRecords(query); // Filter records based on the current query
      setFilteredRecords(filtered); // Update the displayed records
    }
  };

  // Group filtered records by CellLead
  const groupedRecords = cellGroups.map((cellGroup) => {
    const leadersRecords = filteredRecords.filter(
      (record) => record.CellLead === cellGroup.cellgroupLeader
    );
    return { cellGroup, records: leadersRecords };
  });

  return (
    <div className="record_monitoring_mainCont">
      <div className="record_upper_part">
        <div className="record_header_cont">
          <p className="church_name_record">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </p>
          <h2 className="record_monitor_title">Record Management</h2>
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
          <div className="expandable-container">
            {groupedRecords // Sort based on cellgroupID
              .sort((a, b) => {
                const [prefixA, numberA] = a.cellGroup.cellgroupID.split("-");
                const [prefixB, numberB] = b.cellGroup.cellgroupID.split("-");

                // Compare the prefixes first (if applicable), then the numeric part
                if (prefixA !== prefixB) {
                  return prefixA.localeCompare(prefixB);
                }
                return parseInt(numberA, 10) - parseInt(numberB, 10);
              })
              .map(({ cellGroup, records }) => (
                <div className="category" key={cellGroup.cellgroupID}>
                  <h3
                    className="category-header"
                    onClick={() => toggleExpand(cellGroup.cellgroupID)}
                  >
                    {cellGroup.cellgroupName}
                  </h3>
                  {expanded[cellGroup.cellgroupID] && (
                    <div className="category-contentLeader">
                      <p className="LeaderName">
                        Leader: {cellGroup.cellgroupLeader}
                      </p>
                      <div className="category-content">
                        {records.map((record) => {
                          // Determine the appropriate avatar based on gender
                          let avatar;
                          if (record.gender === "Male") {
                            avatar = avatar_male; // Ensure you have Avatar_Male imported
                          } else if (record.gender === "Female") {
                            avatar = avatar_female; // Ensure you have Avatar_Female imported
                          } else {
                            avatar = user_placeholder; // Default avatar for other cases
                          }

                          return (
                            <div
                              className="record_content_card"
                              key={record._id}
                            >
                              <img
                                src={record.profilePic || avatar} // Use profilePic or gender-based avatar
                                alt="profile_picture"
                                className="record_container_profile"
                              />
                              <div className="record_content_card_deets">
                                <h2 className="record_person_name">
                                  {record.firstName}
                                </h2>
                                <p className="record_person_age_and_gender">
                                  {calculateAge(record.birthDate)},{" "}
                                  {record.gender}
                                </p>
                                <div className="record_person_type">
                                  <h2 className="record_type_text">
                                    {record.memberType}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
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
            <h2 className="selection_title">Add New Cellgroup</h2>
          </div>
          <div
            className="selection_container_record"
            onClick={setEditCellgroup}
          >
            <img
              src={edit_ic}
              alt="edit_cellgroup"
              className="selection_icon"
            />
            <h2 className="selection_title">Edit Cellgroup</h2>
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
          <div className="selection_container_record" onClick={setNetworkModal}>
            <img src={add_ic} alt="add_network_ic" className="selection_icon" />
            <h2 className="selection_title">Add New Network</h2>
          </div>
          <div className="selection_container_record" onClick={setEditNetwork}>
            <img
              src={edit_ic}
              alt="edit_network_ic"
              className="selection_icon"
            />
            <h2 className="selection_title">Edit Network</h2>
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
                    <option value="Member">Members</option>
                    <option value="Cellgroup Leader">Cellgroup Leaders</option>
                    <option value="Network Leader">Network Leaders</option>
                    <option value="Guest">Guests</option>
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

      {editNetworkModal && (
        <div className="edit_network_modal_container">
          <div className="edit_network_modal">
            <div className="edit_network_header_container">
              <h1 className="edit_network_header">Edit Network</h1>
              <img
                src={close_ic}
                alt="close button"
                onClick={() => setEditNetworkModal(false)}
                className="close_btn"
              />
            </div>
            <div className="main_editor_container">
              <table className="network_table">
                <thead className="network_table_header">
                  <th>Network ID</th>
                  <th>Network Leader</th>
                  <th>Actions</th>
                </thead>
                <tbody className="network_table_body">
                  {networkData.length > 0 ? (
                    networkData
                      .sort((a, b) => {
                        // Split the "cellgroupID" into prefix and number
                        const [prefixA, numberA] = a.cellgroupID.split("-");
                        const [prefixB, numberB] = b.cellgroupID.split("-");

                        // Compare the prefixes first (lexicographically)
                        const prefixComparison = prefixA.localeCompare(prefixB);
                        if (prefixComparison !== 0) {
                          return prefixComparison;
                        }

                        // If prefixes are equal, compare the numeric parts
                        return parseInt(numberA, 10) - parseInt(numberB, 10);
                      })
                      .map((network) => (
                        <tr className="row-table" key={network._id}></tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no_data">
                        No Cell Groups Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  <input
                    name="cellgroupName"
                    placeholder=""
                    value={displayValue}
                    onChange={handleChangeCellGroup}
                    type="text"
                    className="cellgroup_name_input"
                  />
                </div>
                <div className="cellgroup_inputs_cont">
                  <h3 className="cellgroup_name_label">Cellgroup Leader:</h3>
                  <input
                    name="cellgroupLeader"
                    placeholder=""
                    value={cellData.cellgroupLeader}
                    onChange={handleChangeCellGroup}
                    type="text"
                    className="cellgroup_name_input"
                  />
                </div>
                <div className="cellgroup_inputs_cont">
                  <h3 className="cellgroup_name_label">Network Leader:</h3>
                  <input
                    name="networkLeader"
                    placeholder=""
                    value={cellData.networkLeader}
                    onChange={handleChangeCellGroup}
                    type="text"
                    className="cellgroup_name_input"
                  />
                </div>
              </div>
              <div className="cellgroup_create_btn">
                <button
                  className="create_cellgroup_btn"
                  onClick={handleAddCellgroup}
                >
                  Create Cellgroup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editCellGroupModal && (
        <div className="editCellGroup_container">
          <div className="editCellgroup_container_main">
            <div className="editCellgroup_header_container">
              <h2 className="editCellgroup_header">Edit Cellgroup</h2>
              <img
                src={close_ic}
                alt="close_icon"
                onClick={handleCloseEdit}
                className="close_cellgroup_modal"
              />
            </div>
            <div className="editCellgroup_list_container">
              <table className="cellgroup_list">
                <thead className="list_header">
                  <th className="ci_head">Cellgroup ID</th>
                  <th className="cn_head">Cellgroup Name</th>
                  <th className="cl_head">Cellgroup Leader</th>
                  <th className="nl_head">Network Leader</th>
                  <th className="a_head">Action</th>
                </thead>
                <tbody className="cellgroup_list_deets">
                  {cellGroups.length > 0 ? (
                    cellGroups
                      .sort((a, b) => {
                        // Split the "cellgroupID" into prefix and number
                        const [prefixA, numberA] = a.cellgroupID.split("-");
                        const [prefixB, numberB] = b.cellgroupID.split("-");

                        // Compare the prefixes first (lexicographically)
                        const prefixComparison = prefixA.localeCompare(prefixB);
                        if (prefixComparison !== 0) {
                          return prefixComparison;
                        }

                        // If prefixes are equal, compare the numeric parts
                        return parseInt(numberA, 10) - parseInt(numberB, 10);
                      })
                      .map((cellgroup) => (
                        <tr className="row-table" key={cellgroup._id}>
                          <td>{cellgroup.cellgroupID}</td>
                          <td>{cellgroup.cellgroupName}</td>
                          <td>{cellgroup.cellgroupLeader}</td>
                          <td>{cellgroup.networkLeader}</td>
                          <td className="actions">
                            <button
                              className="edit btn"
                              onClick={() => handleEdit(cellgroup.cellgroupID)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no_data">
                        No Cell Groups Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {editModalC && (
        <div className="main_editing_container">
          <div className="editing_container">
            <div className="editCellgroup_header_container">
              <h2 className="editCellgroup_header">Edit Cellgroup</h2>
              <img
                src={close_ic}
                alt="close_icon"
                onClick={() => setEditModalC(false)}
                className="close_cellgroup_modal"
              />
            </div>

            <p className="cellgroup_text">Editing a cellgroup.</p>
            <div className="cellgroup_form_cont">
              <div className="cellgroup_inputs_cont">
                <h3 className="cellgroup_name_label">Cellgroup Name:</h3>
                <input
                  name="cellgroupName"
                  placeholder=""
                  value={cellgroupData.cellgroupName || ""}
                  onChange={(e) =>
                    setCellgroupData({
                      ...cellgroupData,
                      cellgroupName: e.target.value,
                    })
                  }
                  type="text"
                  className="cellgroup_name_input"
                />
              </div>
              <div className="cellgroup_inputs_cont">
                <h3 className="cellgroup_name_label">Cellgroup Leader:</h3>
                <input
                  name="cellgroupLeader"
                  placeholder=""
                  value={cellgroupData.cellgroupLeader || ""}
                  onChange={(e) =>
                    setCellgroupData({
                      ...cellgroupData,
                      cellgroupLeader: e.target.value,
                    })
                  }
                  type="text"
                  className="cellgroup_name_input"
                />
              </div>
              <div className="cellgroup_inputs_cont">
                <h3 className="cellgroup_name_label">Network Leader:</h3>
                <input
                  name="networkLeader"
                  placeholder=""
                  value={cellgroupData.networkLeader || ""}
                  onChange={(e) =>
                    setCellgroupData({
                      ...cellgroupData,
                      networkLeader: e.target.value,
                    })
                  }
                  type="text"
                  className="cellgroup_name_input"
                />
              </div>
            </div>
            <div className="btn_cont">
              <button className="save_btn" onClick={handleOnSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {newNetworkModal && (
        <div className="create_cellgroup_cont">
          <div className="cellgroup_main_cont">
            <div className="cellgroup_header_cont">
              <h2 className="cellgroup_header">Create New Network</h2>
              <img
                src={close_ic}
                alt="close_icon"
                onClick={handleCloseNetwork}
                className="close_cellgroup_modal"
              />
            </div>

            <div className="create_cellgroup_main_cont">
              <p className="cellgroup_text">Creating a new network.</p>
              <div className="cellgroup_form_cont">
                <div className="cellgroup_inputs_cont">
                  <h3 className="cellgroup_name_label">Network Leader:</h3>
                  <input
                    name="networkLeader"
                    placeholder=""
                    value={netData.networkLeader}
                    onChange={handleChangeNetwork}
                    type="text"
                    className="cellgroup_name_input"
                  />
                </div>
              </div>
              <div className="cellgroup_create_btn">
                <button
                  className="create_cellgroup_btn"
                  onClick={handleAddNetwork}
                >
                  Create Network
                </button>
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
                      <th className="archived-accounts-header-gender">
                        Gender
                      </th>
                      <th className="archived-accounts-header-date">
                        Date Archived
                      </th>
                    </tr>
                  </thead>
                  <tbody className="archieve-accounts-body-main">
                    {archivedUsers.map((user, index) => (
                      <tr key={user._id} className="archived-accounts-row">
                        <td className="archived-accounts-number">
                          {index + 1}
                        </td>
                        <td className="archived-accounts-name">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="archived-accounts-age">
                          {calculateAge(user.birthDate)}
                        </td>
                        <td className="archived-accounts-gender">
                          {user.gender}
                        </td>
                        <td className="archived-accounts-date">
                          {user.dateArchieved}
                        </td>
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
