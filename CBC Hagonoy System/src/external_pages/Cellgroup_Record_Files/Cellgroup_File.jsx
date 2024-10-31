import { useEffect, useState } from "react";
import {
  filter_ic,
  search_ic,
  user_placeholder,
  avatar_female,
  avatar_male,
} from "../../assets/Assets";
import "./Cellgroup_File.css";
import axios from "axios";
import { toast } from "react-hot-toast";

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

function Cellgroup_File() {
  const [filterModal, setFilterModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    age: "",
    gender: "",
    memberType: "",
  });
  const [records, setRecords] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const [cellGroups, setCellGroups] = useState([]);
  const [leaderName, setLeaderName] = useState(""); // Store leaderName in state
  const [userType, setUserType] = useState("");
  const [usersUnderNetworkLead, setUsersUnderNetworkLead] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchedUser(query);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearButton = () => {
    setFilters({
      age: "",
      gender: "",
      memberType: "",
    });
    setSearchedUser("");
    setFilterModal(false);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/profile",
        {
          withCredentials: true,
        }
      );
      const { firstName, lastName, memberType } = response.data;
      const name = `${firstName} ${lastName}`;

      setUserType(memberType);
      setLeaderName(name); // Set leaderName in state
      return name;
    } catch (error) {
      toast.error("Error fetching user profile: " + error.message);
      throw error;
    }
  };

  const fetchCellGroupByLeader = async (leaderName) => {
    try {
      const response = await axios.get(
        `https://capstone-project0001-2.onrender.com/leader/${leaderName}`
      );
      console.log("Searching for cell group with leader:", leaderName);
      console.log(response.data);
      setCellGroups(response.data);
    } catch (error) {
      console.error("Error fetching cell group by leader:", error);
    }
  };

  const fetchUsersUnderNetworkLead = async (networkLead) => {
    try {
      const trimmedLead = networkLead.trim();
      const response = await axios.get(
        `https://capstone-project0001-2.onrender.com/records/networkLead/${trimmedLead}`
      );
      console.log("Fetching users under network lead:", networkLead);
      console.log(response.data);
      setUsersUnderNetworkLead(response.data); // Set users under network lead
    } catch (error) {
      console.error("Error fetching users under network lead:", error);
      toast.error("Error fetching users: " + error.message);
    }
  };

  const groupedRecords = filteredRecords.filter(
    (record) => record.CellLead === leaderName
  );

  useEffect(() => {
    const fetchProfileAndCellGroup = async () => {
      try {
        const name = await fetchUserProfile(); // Fetch the user profile first
        if (name) {
          await fetchCellGroupByLeader(name);
          // Fetch users under network lead only if the user is a Network Leader
          if (userType === "Network Leader") {
            await fetchUsersUnderNetworkLead(name);
          }
        }
      } catch (error) {
        console.error("Error during profile and cell group fetch:", error);
      }
    };

    fetchProfileAndCellGroup();
  }, [userType, leaderName]); // Remove userType dependency to avoid unnecessary fetches

  useEffect(() => {
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
  }, []);

  const applyFilters = (record) => {
    const ageFilter = filters.age
      ? (() => {
          const [minAge, maxAge] = filters.age.split("-").map(Number);
          const age = calculateAge(record.birthDate);
          return age >= minAge && age <= maxAge;
        })()
      : true;

    const genderFilter = filters.gender
      ? record.gender === filters.gender
      : true;

    const memberTypeFilter = filters.memberType
      ? record.memberType === filters.memberType
      : true;

    // Apply search filter to first and last names
    const searchFilter = searchedUser
      ? record.firstName.toLowerCase().startsWith(searchedUser.toLowerCase()) ||
        record.lastName.toLowerCase().startsWith(searchedUser.toLowerCase())
      : true;

    return ageFilter && genderFilter && memberTypeFilter && searchFilter;
  };

  const handleApplyFilters = () => {
    const allRecords =
      userType === "Network Leader" ? usersUnderNetworkLead : records;
    const filtered = allRecords.filter(applyFilters);
    setFilteredRecords(filtered);
    setFilterModal(false); // Close modal after applying filters
  };

  useEffect(() => {
    const allRecords =
      userType === "Network Leader" ? usersUnderNetworkLead : records;
    const filtered = allRecords.filter(applyFilters);
    setFilteredRecords(filtered);
  }, [searchedUser, filters, records, usersUnderNetworkLead, userType]);

  return (
    <div className="cellgroup_main_cont">
      <div className="cellgroup_toplayer_cont">
        <div className="cellgroup_title_cont">
          <p className="cellgroup_church_name">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </p>
          <h3 className="cellgroup_title">Cellgroup Records</h3>
        </div>
        <div className="search_and_menu_cont">
          <input
            type="text"
            value={searchedUser}
            name="search"
            className="search_cellgroup"
            placeholder="Search record..."
            onChange={handleSearchChange}
          />
          <img src={search_ic} alt="search_ic" className="search_ic" />
          <img
            src={filter_ic}
            alt="filter_ic"
            className="filter_ic"
            onClick={() => setFilterModal(true)} // Make sure to set the filter modal
          />
        </div>
      </div>

      <div className="record_lower_part">
        {userType === "Cellgroup Leader" ? (
          <div className="record_lower_part_left">
            {groupedRecords.length > 0 ? (
              groupedRecords.map((record) => {
                let avatar;
                if (record.gender === "Male") {
                  avatar = avatar_male;
                } else if (record.gender === "Female") {
                  avatar = avatar_female;
                } else {
                  avatar = user_placeholder;
                }

                return (
                  <div className="record_content_card" key={record._id}>
                    <img
                      src={record.profilePic || avatar}
                      alt="profile_picture"
                      className="record_container_profile"
                    />
                    <div className="record_content_card_deets">
                      <h2 className="record_person_name">{record.firstName}</h2>
                      <p className="record_person_age_and_gender">
                        {calculateAge(record.birthDate)}, {record.gender}
                      </p>
                      <div className="record_person_type">
                        <h2 className="record_type_text">
                          {record.memberType}
                        </h2>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No records found.</p>
            )}
          </div>
        ) : userType === "Network Leader" ? (
          <div className="record_lower_part_left">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => {
                let avatar;
                if (record.gender === "Male") {
                  avatar = avatar_male;
                } else if (record.gender === "Female") {
                  avatar = avatar_female;
                } else {
                  avatar = user_placeholder;
                }

                return (
                  <div className="record_content_card" key={record._id}>
                    <img
                      src={record.profilePic || avatar}
                      alt="profile_picture"
                      className="record_container_profile"
                    />
                    <div className="record_content_card_deets">
                      <h2 className="record_person_name">{record.firstName}</h2>
                      <p className="record_person_age_and_gender">
                        {calculateAge(record.birthDate)}, {record.gender}
                      </p>
                      <div className="record_person_type">
                        <h2 className="record_type_text">
                          {record.memberType}
                        </h2>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No records found under this network lead.</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Filter modal and other UI elements */}
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
                    value={filters.age || " "}
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
                    value={filters.gender || " "}
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
                    value={filters.memberType || " "}
                  >
                    <option disabled value=" ">
                      Select Type
                    </option>
                    <option value="Member">Member</option>
                    <option value="Cellgroup Leader">Cellgroup Leader</option>
                    <option value="Network Leader">Network Leader</option>
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
    </div>
  );
}

export default Cellgroup_File;
