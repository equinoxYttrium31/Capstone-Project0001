const ChurchUser = require("../models/ChurchUser");
const CellGroupModel = require("../models/CellGroup"); // Adjust path accordingly
const UserAttendanceModel = require("../models/UserAttendance");
const { hashPassword, comparePassword } = require("../helpers/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const AnnouncementModel = require("../models/Announcements");
const ArchivedAnnouncementModel = require("../models/ArchievedAnnouncements");
const PrayerRequestModel = require("../models/Prayer_Request");
const ArchieveUserModel = require("../models/ArchieveRecords");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mailgun = require("mailgun-js");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Access the token from cookies
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    req.id = decoded.id;
    console.log(decoded.id); // Store user ID in request object
    console.log("Decoded Token:", decoded); // Log the decoded token
    next(); // Proceed to the next middleware or route handler
  });
};

let otpStore = {}; // In-memory OTP store
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "7fefc0001@smtp-brevo.com", // your SMTP login
    pass: "hfrwj8myWvCsqxHS", // your SMTP password
  },
});
// Function to generate a 6-digit OTP
const generateOtp = () => {
  return crypto.randomBytes(8).toString("hex"); // Generates a 6-digit OTP
};

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: "no-reply@client-2oru.onrender.com/", // The "From" email, this must be verified in Mailgun
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
    html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`,
  };
  return transporter.sendMail(mailOptions);
};

const requestOtp = async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address." });
  }

  // Generate OTP
  const otp = generateOtp();
  const otpExpiry = 600000; // 10 minutes expiry time (in ms)

  // Store OTP in-memory (This simulates storing the OTP)
  otpStore[email] = {
    otp: otp,
    expiry: Date.now() + otpExpiry,
  };

  // Send OTP email
  try {
    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending OTP email." });
  }
};

// Function to change password
const changePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Retrieve OTP from the in-memory store
  const storedOtp = otpStore[email];

  // Validate the OTP
  if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiry) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP." });
  }

  // Remove OTP from in-memory store after successful verification
  delete otpStore[email];

  // Update password in the database
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await ChurchUser.updateOne({ email }, { password: hashedPassword });

  res.json({ success: true, message: "Password changed successfully." });
};

// Middleware for token verification

const convertToJpeg = async (imageBuffer) => {
  try {
    const convertedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 90 }) // Adjust the quality as needed
      .toBuffer();
    return convertedImageBuffer;
  } catch (error) {
    console.error("Error converting image to JPEG:", error);
    throw new Error("Image conversion failed");
  }
};

// Fetch the full profile of the authenticated user
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token (set in the authenticateToken middleware)

    // Fetch the full user profile from the database based on user ID
    const churchUser = await ChurchUser.findById(userId).select("-password"); // Exclude the password from the response
    if (!churchUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(churchUser); // Return the full user profile
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
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
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
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
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login user and set the token in a cookie
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email); // Log the email

    // Find user by email
    const churchUser = await ChurchUser.findOne({ email });
    if (!churchUser) {
      console.log("User not found");
      return res.status(400).json({ error: "User does not exist" });
    }

    // Verify password
    const isValidPassword = await comparePassword(
      password,
      churchUser.password
    );
    if (!isValidPassword) {
      console.log("Password mismatch");
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
      { expiresIn: "7days" } // Set expiration here
    );

    // Log the generated token
    console.log("Generated Token:", token);

    // Set the cookie with the token
    res.cookie("token", token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript, protecting against XSS attacks
      secure: process.env.NODE_ENV === "production", // Only send on HTTPS in production
      sameSite: "None", // Adjust based on your app needs
      path: "/", // Path for the cookie
    });

    // Return user data without password
    return res.json({
      id: churchUser._id,
      firstName: churchUser.firstName,
      lastName: churchUser.lastName,
      email: churchUser.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
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
    const base64Data = image.split(",")[1]; // Extract the base64 string
    const imageBuffer = Buffer.from(base64Data, "base64"); // Convert to buffer

    // Convert the image to JPEG format
    const jpegBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 100 }) // Adjust the quality as needed
      .toBuffer();

    // Convert the JPEG buffer back to base64 for saving to the database
    const jpegBase64 = jpegBuffer.toString("base64");
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

    res.json({
      message: "Profile picture updated successfully.",
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the token
    console.log("User ID from token:", userId); // Log the user ID

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
    ).select("profilePic"); // Fetch only the profilePic field

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the updated profile picture data
    res.json({ profilePic: user.profilePic });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch the profile picture
const fetchProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await ChurchUser.findById(userId).select("profilePic");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Assuming profilePic contains a file path, send the URL for the client to use
    res.json({ profilePic: `${user.profilePic}` });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ error: "Server error" });
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
      { new: true, select: "-password" } // Return the updated document, excluding the password
    );

    // Check if the user was found
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user data
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
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
      NetLead,
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
        NetLead,
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
    console.error("Error in initial edit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout user function
const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token from the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // Optionally, you can send a success message or status
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Server error during logout" });
  }
};

// Get Weekly Attendance
const getWeeklyAttendance = async (req, res) => {
  const { userId, month, year, weekNumber } = req.params; // Now using req.params for URL parameters

  // Validate input
  if (!userId || !month || !year || !weekNumber) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // Find the monthly attendance for the user
    const attendance = await UserAttendanceModel.findOne({
      userId,
      month,
      year,
    });

    if (!attendance) {
      console.log(
        `Attendance not found for userId: ${userId}, month: ${month}, year: ${year}`
      );
      return res.status(404).json({ message: "Attendance record not found." });
    }

    // Retrieve attendance for the specified week number
    const weeklyAttendance = attendance.getWeeklyAttendance(
      parseInt(weekNumber, 10)
    ); // Ensure weekNumber is an integer

    if (!weeklyAttendance) {
      return res
        .status(404)
        .json({ message: "Weekly attendance record not found." });
    }

    res.json(weeklyAttendance); // Return the found weekly attendance record
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance." });
  }
};

// Get Monthly Attendance Summary
const getMonthlyAttendanceSummary = async (req, res) => {
  const { userId, month, year } = req.body; // Changed from req.params to req.body

  try {
    const attendance = await UserAttendanceModel.findOne({
      userId,
      month,
      year,
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    const summary = attendance.getMonthlySummary();
    return res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create or Update User Attendance
const createOrUpdateAttendance = async (req, res) => {
  const { userId, month, year, weekNumber, attendanceData } = req.body; // Changed from req.params to req.body

  // Validate input
  if (!userId || !month || !year || !weekNumber || !attendanceData) {
    return res.status(400).json({ message: "Missing required fields." });
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
      return res.status(409).json({
        message:
          "Attendance entry already exists for this user, month, and year.",
      });
    }
    console.error("Error creating/updating attendance:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Your route handler
const getAttendanceByMonthYear = async (req, res) => {
  const { userId, month, year } = req.params;

  try {
    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch attendance data using the ObjectId
    const attendance = await UserAttendanceModel.findOne({
      userId: userObjectId,
      month,
      year: parseInt(year, 10), // Convert year to integer if needed
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    return res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Progress by Month and Year
const getProgressByMonthYear = async (req, res) => {
  const { userId, month, year } = req.body; // Changed from req.params to req.body

  try {
    // Fetch the monthly attendance for the user
    const attendance = await UserAttendanceModel.findOne({
      userId,
      month,
      year,
    });

    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Attendance not found for this user." });
    }

    // Calculate progress for each activity
    const totalWeeks = attendance.weeklyAttendance.length;
    const summary = {
      cellGroup: 0,
      personalDevotion: 0,
      familyDevotion: 0,
      prayerMeeting: 0,
      worshipService: 0,
    };

    // Sum up how many weeks each activity was attended
    attendance.weeklyAttendance.forEach((week) => {
      Object.keys(summary).forEach((activity) => {
        if (week[activity]) {
          summary[activity] += 1;
        }
      });
    });

    // Send progress with calculated attendance count
    const progress = {
      cellGroup: summary.cellGroup,
      personalDevotion: summary.personalDevotion,
      familyDevotion: summary.familyDevotion,
      prayerMeeting: summary.prayerMeeting,
      worshipService: summary.worshipService,
      totalWeeks, // Total number of weeks tracked in this month
    };

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitDefault = async (req, res) => {
  const { userId, month, year, weekNumber, attendanceData } = req.body;

  // Validate input
  if (!userId || !month || !year || !weekNumber || !attendanceData) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const newAttendance = new UserAttendanceModel({
      userId,
      month,
      year,
      weekNumber,
      attendanceData,
    });
    await newAttendance.save();
    return res
      .status(201)
      .json({ message: "Attendance created successfully!" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ error: "Failed to save attendance" });
  }
};

const checkAuth = async (req, res) => {
  const token = req.cookies.token; // Adjust if your token is stored elsewhere

  if (!token) {
    return res.status(200).json({ isLoggedIn: false }); // No token, user is not authenticated
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secret
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
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return res.status(200).json({ isLoggedIn: false }); // On error, assume user is not authenticated
  }
};

const getCellgroupByLeader = async (req, res) => {
  const leaderName = req.params.leaderName;

  console.log(leaderName);

  try {
    // Query the Cellgroup based on the leader's name
    const cellgroup = await CellGroupModel.findOne({
      cellgroupLeader: leaderName,
    });

    if (!cellgroup) {
      return res.status(404).json({ message: "Cellgroup not found" });
    }

    res.json({ cellgroupName: cellgroup.cellgroupName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchLatestAnnouncement = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find({
      audience: "all_cellgroups",
    })
      .sort({ publishDate: -1 })
      .limit(3);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

const sendPrayerRequest = async (req, res) => {
  try {
    const { name, prayer } = req.body;

    console.log(req.body);

    if (!name || !prayer) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if a record exists for the name
    let prayerRequest = await PrayerRequestModel.findOne({ name });

    if (!prayerRequest) {
      // If no record exists, create a new one
      prayerRequest = new PrayerRequestModel({
        name,
        prayers: [{ prayer, dateSubmitted: new Date(), isRead: false }],
      });
    } else {
      // If a record exists, add the new prayer to the prayers array
      prayerRequest.prayers.push({ prayer, dateSubmitted: new Date() });
    }

    await prayerRequest.save();
    return res.status(201).json({ message: "Prayer Sent Successfully!" });
  } catch (error) {
    console.error("Error sending prayer:", error);
    return res.status(500).json({ error: "Failed to send prayer" });
  }
};

const getRecordsByNetworkLead = async (req, res) => {
  try {
    const NetLead = req.params.networkLead.trim(); // Trim whitespace

    // Fetch records from your database
    const networkRecords = await ChurchUser.find({ NetLead: NetLead });

    console.log(NetLead);

    if (!networkRecords.length) {
      return res
        .status(404)
        .json({ message: "No records found for this network lead." });
    }

    res.status(200).json(networkRecords);
  } catch (error) {
    console.error("Error fetching records by network lead:", error);
    res.status(500).json({ message: "Server error while fetching records." });
  }
};

const fetchArchivedAnnouncement = async (req, res) => {
  try {
    const archivedAnnouncements = await ArchivedAnnouncementModel.find().sort({
      date: -1,
    }); // Sort by latest
    res.json(archivedAnnouncements);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching announcements", error: err });
  }
};

const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const id = req.id;

  console.log(id);

  try {
    // Find user by ID
    const user = await ChurchUser.findById(id);
    console.log("Fetched User:", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);

    user.password = hashedPassword;

    // Save the updated user data
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changeUserPassword:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const fetchCurrentAnnouncement = async (req, res) => {
  try {
    const today = new Date();
    const announcements = await AnnouncementModel.find({
      publishDate: { $lte: today },
      endDate: { $gte: today },
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  initialEditUserProfile,
  logoutUser,
  submitDefault,
  fetchLatestAnnouncement,
  sendPrayerRequest,
  fetchCurrentAnnouncement,
  getRecordsByNetworkLead,
  fetchArchivedAnnouncement,
  changeUserPassword,

  //Exporting attendance functions
  createOrUpdateAttendance,
  getAttendanceByMonthYear,
  getWeeklyAttendance,
  getMonthlyAttendanceSummary,
  getProgressByMonthYear,
  checkAuth,
  getCellgroupByLeader,
  requestOtp,
  changePassword,
};
