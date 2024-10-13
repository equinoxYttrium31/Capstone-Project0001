import { useEffect, useState } from 'react';
import { filter_ic, search_ic, user_placeholder } from '../../assets/Assets'
import './Cellgroup_File.css'
import { groupCards } from '../../../../CBC Hagonoy System Admin/src/components/Utility Functions/layoutUtility';

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

  const [records, setRecords] = useState([]);  // State to hold fetched records

  useEffect(() => {
    // Function to fetch records from the backend
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:8000/records'); // Adjust this URL to your backend endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecords(data);  // Set the fetched records to state
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();  // Call the fetch function
  }, []);  // Empty dependency array to run once on component mount

  const groupedRecords = groupCards(records, 3); 

  return (
    <div className='cellgroup_main_cont'>
      <div className="cellgroup_toplayer_cont">
        <div className="cellgroup_title_cont">
            <p className="cellgroup_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
            <h3 className="cellgroup_title">Cellgroup Records</h3>
        </div>
        <div className="search_and_menu_cont">
            <input type="text" className="search_cellgroup" placeholder='search...' />
            <img src={search_ic} alt="search_ic" className="search_ic" />
            <img src={filter_ic} alt="filter_ic" className="filter_ic" />
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

    </div>
  )
}

export default Cellgroup_File