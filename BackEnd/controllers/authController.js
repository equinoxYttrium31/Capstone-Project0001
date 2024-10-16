const ChurchUser = require('../models/ChurchUser');
const CellGroupModel = require('../models/CellGroup'); // Adjust path accordingly
const UserAttendanceModel = require('../models/UserAttendance');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

// Middleware for token verification
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Access the token from cookies
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user; // Store user info in request object
        console.log('Decoded Token:', user); // Log the decoded token
        next(); // Proceed to the next middleware or route handler
    });
};



const convertToJpeg = async (imageBuffer) => {
    try {
        const convertedImageBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 90 }) // Adjust the quality as needed
            .toBuffer();
        return convertedImageBuffer;
    } catch (error) {
        console.error('Error converting image to JPEG:', error);
        throw new Error('Image conversion failed');
    }
};

// Fetch the full profile of the authenticated user
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the token (set in the authenticateToken middleware)
        
        // Fetch the full user profile from the database based on user ID
        const churchUser = await ChurchUser.findById(userId).select('-password'); // Exclude the password from the response
        if (!churchUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(churchUser); // Return the full user profile
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthDate } = req.body;

        // Validate input fields
        if (!firstName) {
            return res.status(400).json({ error: "First name is required" });
        }

        if (!password || password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Check if the user already exists
        const userExists = await ChurchUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password and create a new user
        const hashedPassword = await hashPassword(password);
        const newUser = await ChurchUser.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthDate,
        });

        return res.status(201).json(newUser); // Return the newly created user
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login user and set the token in a cookie
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email); // Log the email

        // Find user by email
        const churchUser = await ChurchUser.findOne({ email });
        if (!churchUser) {
            console.log('User not found');
            return res.status(400).json({ error: "User does not exist" });
        }

        // Verify password
        const isValidPassword = await comparePassword(password, churchUser.password);
        if (!isValidPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ error: "Password does not match!" });
        }

        // Signing the token with relevant user information
        const token = jwt.sign(
            { 
                id: churchUser._id, 
                email: churchUser.email, 
                firstName: churchUser.firstName, 
                lastName: churchUser.lastName, 
                birthDate: churchUser.birthDate,
                memberType: churchUser.memberType,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7days' } // Set expiration here
        );

        // Log the generated token
        console.log('Generated Token:', token); 
        
        // Set the cookie with the token
        res.cookie('token', token, {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript, protecting against XSS attacks
            secure: process.env.NODE_ENV === 'production', // Only send on HTTPS in production
            sameSite: 'Strict', // Adjust based on your app needs
            path: '/', // Path for the cookie
        }); 
        
        // Return user data without password
        return res.json({ 
            id: churchUser._id, 
            firstName: churchUser.firstName, 
            lastName: churchUser.lastName, 
            email: churchUser.email 
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Upload a new profile picture
const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID from the token
        const { image } = req.body; // Get the image from the request body

        if (!image) {
            return res.status(400).json({ error: "No image provided." });
        }

        // Convert base64 image to buffer
        const base64Data = image.split(',')[1]; // Extract the base64 string
        const imageBuffer = Buffer.from(base64Data, 'base64'); // Convert to buffer

        // Convert the image to JPEG format
        const jpegBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 100 }) // Adjust the quality as needed
            .toBuffer();

        // Convert the JPEG buffer back to base64 for saving to the database
        const jpegBase64 = jpegBuffer.toString('base64');
        const jpegImage = `data:image/jpeg;base64,${jpegBase64}`;

        // Update the user's profile picture in the database
        const updatedUser = await ChurchUser.findByIdAndUpdate(
            userId,
            { profilePic: jpegImage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({ message: "Profile picture updated successfully.", profilePic: updatedUser.profilePic });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID from the token
        console.log('User ID from token:', userId); // Log the user ID

        // Extract the new profile picture from the request body
        const { image } = req.body;

        // Validate that the image is provided
        if (!image) {
            return res.status(400).json({ error: "Image is required." });
        }

        // Update the user's profile picture in the database
        const user = await ChurchUser.findByIdAndUpdate(
            userId,
            { profilePic: image },
            { new: true } // Return the updated user document
        ).select('profilePic'); // Fetch only the profilePic field

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return the updated profile picture data
        res.json({ profilePic: user.profilePic });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch the profile picture
const fetchProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await ChurchUser.findById(userId).select('profilePic');

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        // Assuming profilePic contains a file path, send the URL for the client to use
        res.json({ profilePic: `${user.profilePic}` });
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// New Function: Update the user profile (Name, Email, Birthdate, etc.)
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the token

        // Destructure necessary fields from the request body
        const {
            firstName,
            lastName,
            email,
            birthDate,
            gender,
            address, // Expecting an array of address objects
            CellNum,
            TelNum,
            CellLead,
            NetLead,
        } = req.body;

        // Prepare the update object
        const updateData = {
            firstName,
            lastName,
            email,
            birthDate,
            gender,
            address, // Directly use the address array from the frontend
            CellNum,
            TelNum,
            CellLead,
            NetLead,
        };

        // Find and update the user in the database
        const updatedUser = await ChurchUser.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' } // Return the updated document, excluding the password
        );

        // Check if the user was found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the updated user data
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// New Function: Create or update user profile with new fields
const initialEditUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the token
        
        const {
            firstName,
            lastName,
            email,
            birthDate,
            gender,
            address,
            CellNum,
            TelNum,
            CellLead,
            NetLead
        } = req.body;

        // Check if the user already exists
        let user = await ChurchUser.findById(userId);

        if (!user) {
            // If the user does not exist, create a new user
            user = new ChurchUser({
                firstName,
                lastName,
                email,
                birthDate,
                gender,
                address,
                CellNum,
                TelNum,
                CellLead,
                NetLead
            });
        } else {
            // If the user exists, update the user fields
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.birthDate = birthDate;
            user.gender = gender;
            user.address = address; // Update with new address structure
            user.CellNum = CellNum;
            user.TelNum = TelNum;
            user.CellLead = CellLead;
            user.NetLead = NetLead;
        }

        // Save the user (create new or update existing)
        const savedUser = await user.save();

        res.json(savedUser); // Return the updated or created user data
    } catch (error) {
        console.error('Error in initial edit:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Logout user function
const logoutUser = async (req, res) => {
    try {
        // Clear the JWT token from the cookie
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });

        // Optionally, you can send a success message or status
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ error: 'Server error during logout' });
    }
};

// Get Weekly Attendance
const getWeeklyAttendance = async (req, res) => {
    const { userId, month, year } = req.body; // Ensure you are sending userId, month, year in the request body

    // Validate input
    if (!userId || !month || !year) {
        return res.status(400).json({ message: 'Missing required parameters.' });
    }

    try {
        const attendance = await UserAttendanceModel.findOne({ userId, month, year });
        
        if (!attendance) {
            console.log(`Attendance not found for userId: ${userId}, month: ${month}, year: ${year}`);
            return res.status(404).json({ message: 'Attendance record not found.' });
        }

        res.json(attendance); // Return the found attendance record
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance.' });
    }
};

// Get Monthly Attendance Summary
const getMonthlyAttendanceSummary = async (req, res) => {
    const { userId, month, year } = req.body; // Changed from req.params to req.body

    try {
        const attendance = await UserAttendanceModel.findOne({ userId, month, year });
        
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        const summary = attendance.getMonthlySummary();
        return res.status(200).json(summary);
    } catch (error) {
        console.error('Error fetching monthly summary:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Create or Update User Attendance
const createOrUpdateAttendance = async (req, res) => {
    const { userId, month, year, weekNumber, attendanceData } = req.body; // Changed from req.params to req.body

    // Validate input
    if (!userId || !month || !year || !weekNumber || !attendanceData) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        let attendance = await UserAttendanceModel.findOne({ userId, month, year });

        if (!attendance) {
            attendance = new UserAttendanceModel({ userId, month, year });
        }

        await attendance.updateWeeklyAttendance(weekNumber, attendanceData);
        await attendance.save();

        return res.status(200).json(attendance);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Attendance entry already exists for this user, month, and year.' });
        }
        console.error('Error creating/updating attendance:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get User Attendance by Month and Year
const getAttendanceByMonthYear = async (req, res) => {
    const { userId, month, year } = req.body; // Changed from req.params to req.body

    try {
        const attendance = await UserAttendanceModel.findOne({ userId, month, year });
        
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        return res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get User Progress by Month and Year
const getProgressByMonthYear = async (req, res) => {
    const { userId, month, year } = req.body; // Changed from req.params to req.body

    try {
        const progress = await progressSchema.findOne({ userId, month, year });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
            console.log('Fetching attendance for:', { userId, month, year });

        }

        return res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const checkAuth = async (req, res) => {
    const token = req.cookies.token; // Adjust if your token is stored elsewhere

    if (!token) {
        return res.status(200).json({ isLoggedIn: false }); // No token, user is not authenticated
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with your secret
        const userId = decoded.userId; // Adjust based on your token structure

        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(200).json({ isLoggedIn: false }); // User not found, not authenticated
        }

        // User is authenticated
        return res.status(200).json({
            isLoggedIn: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error checking authentication:', error);
        return res.status(200).json({ isLoggedIn: false }); // On error, assume user is not authenticated
    }
};

const getCellgroupByLeader = async (req, res) => {
    const leaderName = req.params.leaderName;

    console.log(leaderName);
  
    try {
      // Query the Cellgroup based on the leader's name
      const cellgroup = await CellGroupModel.findOne({ cellgroupLeader: leaderName });
      
      if (!cellgroup) {
        return res.status(404).json({ message: 'Cellgroup not found' });
      }
  
      res.json({ cellgroupName: cellgroup.cellgroupName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


// Export the functions
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    authenticateToken,
    uploadProfilePicture,
    fetchProfilePicture,
    updateProfilePicture,
    updateUserProfile,
    initialEditUserProfile ,
    logoutUser,// Export the new function

    //Exporting attendance functions
    createOrUpdateAttendance,
    getAttendanceByMonthYear,
    getWeeklyAttendance,
    getMonthlyAttendanceSummary,
    getProgressByMonthYear,
    checkAuth,
    getCellgroupByLeader,
};
