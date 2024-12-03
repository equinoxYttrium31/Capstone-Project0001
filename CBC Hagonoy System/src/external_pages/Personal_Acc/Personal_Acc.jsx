import { useState, useEffect } from "react";
import "./Personal_Acc.css";
import { useSearchParams } from "react-router-dom";
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

const Personal_Acc = ({ profileRefresh }) => {
  //PropTypes Validation
  Personal_Acc.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    profileRefresh: PropTypes.func.isRequired,
  };

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [searchParams] = useSearchParams();
  const attendanceID = searchParams.get("attendanceID");
  const [attendance, setAttendance] = useState(null);

  const fetchAttendanceDetails = async () => {
    if (!attendanceID) return;

    try {
      const response = await axios.get(
        `https://capstone-project0001-2.onrender.com/attendance-details/${attendanceID}`
      );
      setAttendance(response.data); // Save attendance details
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAttendanceDetails(); // Fetch attendance details when attendanceID changes
  }, [attendanceID]);

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
        <Attendance_Form attendance={attendance} />
      </div>
    </div>
  );
};

export default Personal_Acc;
