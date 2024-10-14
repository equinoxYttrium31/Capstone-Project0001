import { useEffect, useState } from 'react';
import { filter_ic, search_ic, user_placeholder } from '../../assets/Assets'
import './Cellgroup_File.css'
import { groupCards } from '../../../../CBC Hagonoy System Admin/src/components/Utility Functions/layoutUtility';
import axios from "axios";

const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

function Cellgroup_File() {
  const [filterModal, setFilterModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [records, setRecords] = useState([]);  // State to hold fetched records
  const [searchedUser, setSearchedUser] = useState("");
  // Function to filter records based on search input and selected filters
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
  
  const toggleFilter = () => {
    setFilterModal(!filterModal);
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

  const handleClearButton = () => {
    setSelectedRange("");
    setSelectedGender("");
    setSelectedMemberType("");
    setSearchedUser(""); // Clear the search input
    setFilteredRecords(records); // Reset filtered records to show all
    toggleFilter(false);
  };

  useEffect(() => {
    // Function to fetch records from the backend
    const fetchRecords = async () => {
      try {
      const response = await axios.get("http://localhost:8000/records"); // Fetch all records
      console.log(response.data); // Log the response data for debugging
      setRecords(response.data);
      setFilteredRecords(response.data);  // Set the fetched records to state
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();  // Call the fetch function
  }, []);  // Empty dependency array to run once on component mount

  const groupedRecords = groupCards(filteredRecords, 3); 

  return (
    <div className='cellgroup_main_cont'>
      <div className="cellgroup_toplayer_cont">
        <div className="cellgroup_title_cont">
            <p className="cellgroup_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
            <h3 className="cellgroup_title">Cellgroup Records</h3>
        </div>
        <div className="search_and_menu_cont">
            <input 
              type="text" 
              value={searchedUser}
              name="search"
              className="search_cellgroup" 
              placeholder='Search record...' 
              onChange={handleSearchChange}
            />
            <img 
              src={search_ic} 
              alt="search_ic" 
              className="search_ic" 
            />
            <img 
              src={filter_ic} 
              alt="filter_ic" 
              className="filter_ic" 
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
                      <img src={record.profilePic || user_placeholder} alt="profile_picture" className='record_container_profile' />
                      <div className="record_content_card_deets">
                        <h2 className="record_person_name">{record.firstName}</h2>
                        <p className="record_person_age_and_gender">{calculateAge(record.birthDate)} , {record.gender}</p>
                        <div className="record_person_type">
                          <h2 className="record_type_text">Member</h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
        </div>
        <div />
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
    </div>
  )
}

export default Cellgroup_File