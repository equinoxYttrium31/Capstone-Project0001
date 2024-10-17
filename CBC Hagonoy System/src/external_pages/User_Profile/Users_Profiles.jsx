import { useState, useEffect } from 'react';
import { 
  edit_ic, 
  user_placeholder,
  avatar_female,
  avatar_male,
 } from '../../assets/Assets';
import './Users_Profiles.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token'); // Retrieve the JWT from local storage
  try {
    const response = await axios.get('http://localhost:8000/profile', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the Authorization header
      }
    });
    return response.data; // Assuming the backend returns user data directly
  } catch (error) {
    toast.error('Error fetching user profile:', error);
    throw error; // Throw the error to handle it in the component
  }
};

function Users_Profiles() {
  const [error, setError] = useState(null); // State to manage errors
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    gender: '',
    address: { baseAddress: '', barangay: '', city: '', province: '' },
    CellNum:'',
    TelNum:'',
    NetLead:'',
    CellLead:'',
  });
  const [originalUser, setOriginalUser] = useState(null); // To store initial user data for canceling changes
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user_placeholder);
  const [showModal, setShowModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state for editing
  const [isFirstEdit, setIsFirstEdit] = useState(false); // New state to track first edit

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile(); // Fetch user profile
        setUser(userProfile); // Update local state with user profile
        setOriginalUser(userProfile); // Store original profile data for cancel
        setIsFirstEdit(userProfile.isFirstEdit); 
        setProfilePicture(userProfile.gender === 'Male' ? avatar_male : userProfile.gender === 'Female' ? avatar_female : user_placeholder);// Set first edit state
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError('Failed to fetch user profile'); 
      }
    };

    getUserProfile();
  }, []);

  useEffect(() => {
  // Fetch user data to check if they have a profile picture
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/profile/picture', { withCredentials: true });
      const { profilePic } = response.data; // Assuming the API returns a field 'profilePic'

      if (profilePic) {
        setHasProfilePicture(true);
        // Check if the profile picture string starts with the correct prefix
        const formattedProfilePic = profilePic.startsWith('data:image/jpeg;base64,') ? profilePic : `data:image/jpeg;base64,${profilePic}`;
        setProfilePicture(formattedProfilePic); // Set the profile picture
      } else {
        // No profile picture available, default to placeholder
        setProfilePicture(user.gender === "Male" ? avatar_male : (user.gender === "Female" ? avatar_female : user_placeholder));
      }
    } catch (error) {
      toast.error("Failed to fetch user profile.");
      console.error('Error fetching user profile:', error);
    }
  };

  fetchUserProfile();
}, [user.gender]);



  const handleChangeProfilePicture = () => {
    setShowModal(true);
  };

  const handleImageUpload = async () => {
    if (uploadedImage) {
      const base64Image = await convertToBase64(uploadedImage); // Convert image to base64
      try {
        await axios.post('http://localhost:8000/uploadProfilePic', { image: base64Image }, {
          withCredentials: true, // Ensure cookies are sent
        });
        setProfilePicture(base64Image); // Update profile picture state
        setHasProfilePicture(true);
        toast.success("Profile picture uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload profile picture.");
      } finally {
        setShowModal(false); // Close the modal after upload
      }
    } else {
      toast.error("Please select an image to upload.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Toggle editing mode
  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      const addressField = name.split('.')[1]; // Get the specific address field (street, city, etc.)
      setUser(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const updatedUser = {
      ...user, // Spread the existing user data
    };

    try {
      if (isFirstEdit) {
        await axios.post('http://localhost:8000/profile/initial-edit', updatedUser, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile created successfully with new fields!");
      } else {
        await axios.put('http://localhost:8000/profile/update', updatedUser, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile updated successfully!");
      }
      
      setOriginalUser(updatedUser); // Sync originalUser with saved data
      setIsEditing(false);
      setIsFirstEdit(false);

      toast.success("Successfully updated the user!")

      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 3000);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error('Error updating profile:', error);
    }
  };

  // Handle canceling the changes
  const handleCancelChanges = () => {
    setUser(user); // Reset to original data
    setIsEditing(false); // Exit editing mode
  };

  
  return (
    <div className='User_Profile_mainCont'>
      <div className="profile_tab">
        <div className="personal_info_user">
          <h1 className="header_profile">My Account</h1>
          <div className="profile_picContainer">
            <img src={profilePicture} alt="profile_picture" className="user_pic_prof" />
            <button className="change-pic-button" onClick={handleChangeProfilePicture}>
              {hasProfilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
            </button>
          </div>
          <div className="name_user_editCont">
            {!!user && (
              <>
                {isEditing ? ( // Make name editable
                  <input 
                    type="text" 
                    value={`${user.firstName} ${user.lastName}`} 
                    className="user_name_prof" 
                    name="userName" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                ) : (
                  <h3 className="user_name_prof">{user.firstName} {user.lastName}</h3>
                )}
              </>
            )}
            <img 
              src={edit_ic} 
              alt="edit_info" 
              className="edit_icon_prof" 
              onClick={toggleEditMode} // Make edit icon clickable
            />
          </div>
          <div className="member_type_profile">
            <h3 className="member_type_label">{user.memberType}</h3>
          </div>
          <div className="additional_info_cont">
            <div className="row_user_info">
              <h3 className="user_birthdate_label">Birthdate: </h3>
              {!!user && (
                <>
                  <input 
                    type="date" 
                    className='Birthdate_User_info' 
                    value={user.birthDate ? 
                      new Date(user.birthDate).toISOString().split('T')[0] 
                      : '' 
                    } 
                    disabled={!isEditing}
                    name="birthDate" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
            </div>
            <div className="row_user_info">
              <h3 className="user_Email_label">Email: </h3>
              {!!user && (
                <>
                  <input 
                    type="email" 
                    className='Email_User_info' 
                    value={user.email} 
                    disabled={!isEditing} // Enable input based on editing state
                    name="email" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side User Profile Container */}
      <div className="right_side_userProf_cont">
        <div className="right_side_detail">
          <h2 className="additional_info_user_header">Additional Information</h2>
          <div className="gender_user_cont">
            <h3 className="user_gender_label">Gender: </h3>
            {!!user && (
                <>
                  <select 
                      className='user_gender_select' 
                      value={user.gender} 
                      disabled={!isEditing}
                      name="gender" 
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="other">Other</option>
                    </select>
                </>
              )}
          </div>
          <div className="address_container_personal">
            <h3 className="user_address_label">Address: </h3>
            <div className="address_bar_container">
              <div className="address_bars">
                {!!user && (
                  <>
                  <input 
                    type="text" 
                    className='address_bar_inp' 
                    value={user.address?.baseAddress || ''}
                    disabled={!isEditing} // Enable input based on editing state
                    name="address.baseAddress" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
                <p className="address_bar_label">House No. /Street /Subdivision:</p>
              </div>
              <div className="address_bars">
                {!!user && (
                <>
                  <input 
                    type="text" 
                    className='address_bar_inp' 
                    value={user.address?.barangay || ''}
                    disabled={!isEditing} // Enable input based on editing state
                    name="address.barangay" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
                <p className="address_bar_label">Baranggay:</p>
              </div>
              <div className="address_bars">
                {!!user && (
                <>
                  <input 
                    type="text" 
                    className='address_bar_inp' 
                    value={user.address?.city || ''}
                    disabled={!isEditing} // Enable input based on editing state
                    name="address.city" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
                <p className="address_bar_label">City/Municipality:</p>
              </div>
              <div className="address_bars">
                {!!user && (
                <>
                  <input 
                    type="text" 
                    className='address_bar_inp' 
                    value={user.address?.province || ''}
                    disabled={!isEditing} // Enable input based on editing state
                    name="address.province" // Add name for input
                    onChange={handleInputChange} // Handle input change
                  />
                </>
              )}
                <p className="address_bar_label">Province:</p>
              </div>
            </div>
          </div>
          <div className="contact_info_container_personal">
            <h3 className="contact_info_label_personal">Contact Information:</h3>
            <div className="contact_deets_row">
              <div className="contact_deets_col">
                {!!user && (
                  <>
                    <input
                      type="text"
                      className='contact_deets_inp'
                      value={user.CellNum}
                      disabled={!isEditing} // Enable input based on editing state
                      name="CellNum" // Add name for input
                      onChange={handleInputChange} // Handle input change
                    />
                  </>
                )}
                <p className="contact_deets_label">Cellphone Number:</p>
              </div>
              <div className="contact_deets_col">
                {!!user && (
                  <>
                    <input
                      type="text"
                      className='contact_deets_inp'
                      value={user.TelNum}
                      disabled={!isEditing} // Enable input based on editing state
                      name="TelNum" // Add name for input
                      onChange={handleInputChange} // Handle input change
                    />
                  </>
                )}
                <p className="contact_deets_label">Landline Number:</p>
              </div>
            </div>
          </div>
          <div className="leader_user_container">
              <h3 className="leader_user_header">Leader:</h3>
              <div className="leader_user_row">
              <div className="leaders_info_cont">
                {!!user && (
                  <>
                    <input
                      type="text"
                      className='leader_personal_inp'
                      value={user.NetLead}
                      disabled={!isEditing} // Enable input based on editing state
                      name="NetLead" // Add name for input
                      onChange={handleInputChange} // Handle input change
                    />
                  </>
                )}
                  <p className="leader_personal_label">Network Leader:</p>
                </div>
              <div className="leaders_info_cont">
                {!!user && (
                  <>
                    <input
                      type="text"
                      className='leader_personal_inp'
                      value={user.CellLead}
                      disabled={!isEditing} // Enable input based on editing state
                      name="CellLead" // Add name for input
                      onChange={handleInputChange} // Handle input change
                    />
                  </>
                )}
                  <p className="leader_personal_label">Cell Leader:</p>
                </div>
            </div>
          </div>
          <div className="user_prof_button_container">
            {isEditing && ( // Show the save button only in edit mode
              <>
                <button className="save_changes_button" onClick={handleSaveChanges}>
                  Save Changes
                </button>  
                <button className="Cancel_changes_button" onClick={handleCancelChanges}>
                  Cancel
                </button>  
              </>
            )}
          </div>
        </div> 
      </div>

      {/* Modal for uploading profile picture */}
      {showModal && (
        <div className="modal_change_pic">
          <div className="modal-content_change_pic">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className='modal-header_change_pic'>Upload Profile Picture</h2>
            <div className="upload_container">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setUploadedImage(e.target.files[0])} 
                />
                <button className='upload_button' onClick={handleImageUpload}>UPLOAD</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users_Profiles;
