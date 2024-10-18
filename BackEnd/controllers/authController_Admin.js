const ChurchUser = require("../models/ChurchUser");
const CellGroup = require("../models/CellGroup");
const ArchieveUserModel = require("../models/ArchieveRecords");
const AnnouncementModel = require("../models/Announcements"); // Adjust to your model
const ArchivedAnnouncementModel = require("../models/ArchievedAnnouncements");
const { hashPassword, comparePassword } = require("../helpers/auth");
const sharp = require("sharp"); // Import sharp at the top of your file
const moment = require("moment");
const cron = require("node-cron");

const getMonthName = (monthIndex) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if the month index is valid (0-11)
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error("Invalid month index");
  }

  return months[monthIndex];
};

const today = new Date();
// Get individual components
const year = today.getFullYear();
const monthIndex = today.getMonth(); // Months are 0-based, pad with zero if needed
const day = String(today.getDate()).padStart(2, "0"); // Pad with zero if needed
const hours = String(today.getHours()).padStart(2, "0"); // Pad with zero if needed
const minutes = String(today.getMinutes()).padStart(2, "0"); // Pad with zero if needed
const month = getMonthName(monthIndex);

// Concatenate into a formatted string
const ArchievedDate = `${month} ${day}, ${year} time: ${hours}:${minutes}`;
// Controller to get all records
const getRecords = async (req, res) => {
  try {
    const records = await ChurchUser.find(); // Fetch records from the database
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const addNewRecord = async (req, res) => {
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

const updateRecord = async (req, res) => {
  try {
    // Get the userId from the request parameters instead of from the token
    const userId = req.params.userId;

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

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
      memberType,
      isBaptized,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
      memberType,
      isBaptized,
    };

    // Find and update the user in the database
    let updatedUser;
    try {
      updatedUser = await ChurchUser.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, select: "-password" } // Return the updated document, excluding the password
      );
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return res.status(500).json({ error: "Database error" });
    }

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

// Controller for creating a new CellGroup
const createNewCellGroup = async (req, res) => {
  try {
    const { cellgroupName, cellgroupLeader } = req.body;

    // Validate input fields
    if (!cellgroupName || !cellgroupLeader) {
      return res.status(400).json({ error: "Input fields are required" });
    }

    // Create new CellGroup
    const newCellGroup = await CellGroup.create({
      cellgroupName,
      cellgroupLeader,
    });

    // Respond with the newly created CellGroup
    return res.status(201).json({
      message: "CellGroup created successfully",
      data: newCellGroup,
    });
  } catch (error) {
    console.error("Error during creation of CellGroup:", error); // Log the error
    return res.status(500).json({ error: "Server error" }); // Return server error to client
  }
};

// Controller to archive a user
const archiveRecord = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from the request parameters

    // Find the user in the ChurchUser collection
    const user = await ChurchUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new archived user in the ArchieveUser collection
    const archivedUser = new ArchieveUserModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      birthDate: user.birthDate,
      profilePic: user.profilePic,
      address: user.address,
      CellNum: user.CellNum,
      TelNum: user.TelNum,
      CellLead: user.CellLead,
      NetLead: user.NetLead,
      gender: user.gender,
      dateArchieved: ArchievedDate,
    });

    // Save the archived user
    await archivedUser.save();

    // Delete the user from the ChurchUser collection
    await ChurchUser.findByIdAndDelete(userId);

    return res.json({ message: "User archived successfully" });
  } catch (error) {
    console.error("Error archiving user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to get a user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from the request parameters

    // Find the user in the ChurchUser collection
    const user = await ChurchUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user); // Return the found user
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller to get all archived users
const getArchivedUsers = async (req, res) => {
  try {
    const archivedUsers = await ArchieveUserModel.find(); // Fetch archived users from the database
    res.json(archivedUsers);
  } catch (error) {
    console.error("Error fetching archived users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchCellGroups = async (req, res) => {
  try {
    const cellGroups = await CellGroup.find(); // Assuming you have a Mongoose model
    res.json(cellGroups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cell groups" });
  }
};

const addAnnouncements = async (req, res) => {
  try {
    const { title, content, audience, publishDate, endDate, announcementPic } =
      req.body;

    // Validate the incoming data
    if (!title || !content || !audience || !publishDate || !endDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new announcement instance
    const newAnnouncement = new AnnouncementModel({
      title,
      content,
      audience,
      publishDate,
      endDate,
      announcementPic: announcementPic || null, // Store the base64 string directly
    });

    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error saving announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find().sort({ date: -1 }); // Sort by latest
    res.json(announcements);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching announcements", error: err });
  }
};

// Function to archive expired announcements
const archiveExpiredAnnouncements = async () => {
  try {
    // Get the current date
    const currentDate = moment().startOf("day").toDate();

    // Find all announcements that have expired (endDate less than current date)
    const expiredAnnouncements = await AnnouncementModel.find({
      endDate: { $lt: currentDate },
    });

    if (expiredAnnouncements.length > 0) {
      // Archive the expired announcements by duplicating them into ArchivedAnnouncements
      const archivedData = expiredAnnouncements.map((announcement) => {
        return {
          title: announcement.title,
          content: announcement.content,
          publishDate: announcement.publishDate,
          endDate: announcement.endDate,
          audience: announcement.audience,
          announcementPic: announcement.announcementPic,
        };
      });

      await ArchivedAnnouncementModel.insertMany(archivedData); // Insert the expired announcements into the ArchivedAnnouncements collection

      // Remove the expired announcements from the original collection
      await AnnouncementModel.deleteMany({ endDate: { $lt: currentDate } });

      console.log(`${expiredAnnouncements.length} announcements archived.`);
    } else {
      console.log("No expired announcements to archive.");
    }
  } catch (error) {
    console.error("Error archiving expired announcements:", error);
  }
};

// Schedule the function to run daily at 12 AM
cron.schedule("15 7 * * *", () => {
  console.log("Running archiveExpiredAnnouncements job at 7:15 AM");
  archiveExpiredAnnouncements();
});

module.exports = {
  getRecords,
  addNewRecord,
  updateRecord,
  archiveRecord,
  getUserById,
  getArchivedUsers,
  createNewCellGroup,
  fetchCellGroups,
  addAnnouncements,
  fetchAnnouncements,
};
