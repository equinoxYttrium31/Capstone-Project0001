import { useState, useEffect } from "react";
import "./Personal_Acc.css";
import {
  user_placeholder,
  avatar_female,
  avatar_male,
} from "../../assets/Assets";
import {
  getCurrentMonth,
  getCurrentYear,
} from "../../Utility Functions/utility_setmonth";
import { getCurrentWeekNumber } from "../../Utility Functions/utility_date";
import axios from "axios";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

import Attendance_Form from "../../components/Attendance_Form/Attendance_Form";

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

const Personal_Acc = ({ onSubmit, profileRefresh }) => {
  //PropTypes Validation
  Personal_Acc.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    profileRefresh: PropTypes.func.isRequired,
  };

  const [user, setUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [currentWeek, setCurrentWeek] = useState("");
  const [error, setError] = useState(null);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [attendanceData, setAttendanceData] = useState({
    cellGroup: false,
    personalDevotion: false,
    familyDevotion: false,
    prayerMeeting: false,
    worshipService: false,
  });

  // Function to submit attendance data to the backend
  const submitAttendanceData = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const userId = user?._id; // Assuming user has an _id field
    const month = currentMonth; // Current month
    const year = currentYear; // Current year
    const weekNumber = currentWeek; // Current week number

    // Get checkbox states from the form elements
    const attendanceData = {
      cellGroup: event.target.cellGroup.checked,
      personalDevotion: event.target.personalDevotion.checked,
      familyDevotion: event.target.familyDevotion.checked,
      prayerMeeting: event.target.prayerMeeting.checked,
      worshipService: event.target.worshipService.checked,
    };

    const attendancePayload = {
      userId,
      month,
      year,
      weekNumber,
      attendanceData, // Use the collected data here
    };

    try {
      await axios.post(
        "https://capstone-project0001-2.onrender.com/attendance",
        attendancePayload,
        {
          withCredentials: true,
        }
      );
      toast.success("Attendance recorded successfully!");
      onSubmit(true);
    } catch (error) {
      console.error("Error submitting attendance data:", error);
      toast.error("Failed to submit attendance data.");
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://capstone-project0001-2.onrender.com/profile",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      toast.error("Error fetching user profile:", error);
      throw error;
    }
  };

  // Function to fetch attendance data
  const fetchAttendanceData = async () => {
    const userId = user?._id;
    const month = currentMonth;
    const year = currentYear;
    const weekNumber = currentWeek;

    try {
      const response = await axios.get(
        `https://capstone-project0001-2.onrender.com/attendance-weekly/get/${userId}/${month}/${year}/${weekNumber}`,
        {
          withCredentials: true,
        }
      );
      return response.data; // Assuming the response contains the weekly attendance data
    } catch (error) {
      console.error(
        "Error fetching attendance data:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to fetch user profile");
      }
    };

    getUserProfile();
    setCurrentMonth(getCurrentMonth());
    setCurrentYear(getCurrentYear());
    setCurrentWeek(getCurrentWeekNumber());
  }, []);

  useEffect(() => {
    // Fetch user data to check if they have a profile picture
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/profile/picture",
          { withCredentials: true }
        );
        const { profilePic } = response.data; // Assuming the API returns a field 'profilePic'

        if (profilePic) {
          setHasProfilePicture(true);
          // Check if the profile picture string starts with the correct prefix
          const formattedProfilePic = profilePic.startsWith(
            "data:image/jpeg;base64,"
          )
            ? profilePic
            : `data:image/jpeg;base64,${profilePic}`;
          setProfilePicture(formattedProfilePic); // Set the profile picture
        }
      } catch (error) {
        toast.error("Failed to fetch user profile.");
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [profileRefresh]);
  // Effect to load attendance data from the backend
  useEffect(() => {
    if (user) {
      const getAttendanceData = async () => {
        try {
          const attendanceData = await fetchAttendanceData();
          // Set tempAttendanceData based on the fetched data
          setAttendanceData(attendanceData);
        } catch (error) {
          console.error("Failed to fetch attendance data:", error);
        }
      };

      getAttendanceData();
    }
  }, [user, currentWeek, currentMonth, currentYear]); // Run when user or current week/month/year changes

  // Refresh user profile when profileRefresh flag changes
  useEffect(() => {
    if (profileRefresh) {
      const getUserProfile = async () => {
        try {
          const userProfile = await fetchUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setError("Failed to fetch user profile");
        }
      };

      getUserProfile();
    }
  }, [profileRefresh]);

  let avatar;
  if (profilePicture) {
    avatar = profilePicture; // Use the profile picture if available
  } else if (user) {
    if (user.gender === "Male") {
      avatar = avatar_male;
    } else if (user.gender === "Female") {
      avatar = avatar_female;
    } else {
      avatar = user_placeholder; // Default for unspecified gender
    }
  } else {
    avatar = user_placeholder; // Default avatar if user is not defined
  } // Variable to store the avatar element

  return (
    <div className="personal_user_acc_main_cont">
      <div className="personal_title_cont">
        <h2 className="personal_title">My Personal Record</h2>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="personal_user_info">
        <div className="personal_img_holder">
          <img
            src={profilePicture || avatar}
            alt="user_profile"
            className="personal_profile_pic"
          />
        </div>
        <div className="personal_user_info_text">
          {!!user && (
            <>
              <h2 className="personal_user_name">
                {user.firstName} {user.lastName}
              </h2>
              <p className="personal_age_gender">
                {calculateAge(user.birthDate)}, {user.gender}
              </p>
              <div className="member_type_profile">
                <h3 className="member_type_label">{user.memberType}</h3>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="__attendance_form">
        <Attendance_Form />
      </div>
    </div>
  );
};

export default Personal_Acc;
