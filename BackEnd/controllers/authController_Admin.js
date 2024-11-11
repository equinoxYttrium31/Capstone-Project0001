const ChurchUser = require("../models/ChurchUser");
const UserAttendance = require("../models/UserAttendance");
const CellGroup = require("../models/CellGroup");
const ArchieveUserModel = require("../models/ArchieveRecords");
const AnnouncementModel = require("../models/Announcements"); // Adjust to your model
const ArchivedAnnouncementModel = require("../models/ArchievedAnnouncements");
const PrayerRequestModel = require("../models/Prayer_Request");
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

const fetchAllPrayer = async (req, res) => {
  try {
    // Use aggregation pipeline to unwind the prayers array
    const prayerRequests = await PrayerRequestModel.aggregate([
      { $unwind: "$prayers" }, // Unwind the prayers array
      {
        $project: {
          // Optional projection to return the fields you need
          name: 1, // Include the name field
          prayer: "$prayers.prayer", // Include prayer field from the prayers array
          dateSubmitted: "$prayers.dateSubmitted", // Include dateSubmitted from the prayers array
          isRead: "$prayers.isRead", // Include isRead from the prayers array
        },
      },
    ]);

    console.log(prayerRequests); // Log the result to the console
    res.status(200).json(prayerRequests); // Respond with the unwound data
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Server error", error: error.message }); // Return error response
  }
};

const fetchNewMembers = async (req, res) => {
  try {
    // Get the start of November 2024
    const startOfNovember = new Date("2024-11-01T00:00:00Z");

    // Retrieve members created after November 1, 2024, with no limit
    const newMembers = await ChurchUser.find({
      createdAt: { $gte: startOfNovember }, // Filter by createdAt >= November 1, 2024
    }).sort({ createdAt: -1 }); // Sort by createdAt in descending order (newest first)

    // Return the fetched members as a JSON response
    res.status(200).json(newMembers);
  } catch (error) {
    console.error("Error fetching new members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const fetchTotalPrayerRequestWeekly = async (req, res) => {
  try {
    const weeklyData = await PrayerRequestModel.aggregate([
      {
        $unwind: "$prayers", // Flatten the prayers array
      },
      {
        $group: {
          _id: {
            month: { $month: "$prayers.dateSubmitted" },
            year: { $year: "$prayers.dateSubmitted" }, // Group by year
          },
          totalRequests: { $sum: 1 }, // Count total requests
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year", // Extract year
          totalRequests: 1,
        },
      },
      { $sort: { year: 1, month: 1 } }, // Sort by year and week
    ]);

    res.json(weeklyData);
    console.log(weeklyData);
  } catch (error) {
    console.error("Error fetching weekly prayer requests", error);
    res.status(500).json({ error: "Error fetching weekly prayer requests" });
  }
};

const totalAttendancePercentage = async (req, res) => {
  try {
    const totalWeeksInYear = 52; // assuming 52 weeks in a year

    const attendanceData = await UserAttendance.aggregate([
      { $unwind: "$weeklyAttendance" },
      {
        $group: {
          _id: null,
          totalCellGroup: {
            $sum: { $cond: ["$weeklyAttendance.cellGroup", 1, 0] },
          },
          totalPersonalDevotion: {
            $sum: { $cond: ["$weeklyAttendance.personalDevotion", 1, 0] },
          },
          totalFamilyDevotion: {
            $sum: { $cond: ["$weeklyAttendance.familyDevotion", 1, 0] },
          },
          totalPrayerMeeting: {
            $sum: { $cond: ["$weeklyAttendance.prayerMeeting", 1, 0] },
          },
          totalWorshipService: {
            $sum: { $cond: ["$weeklyAttendance.worshipService", 1, 0] },
          },
          totalPossibleAttendance: { $sum: totalWeeksInYear },
        },
      },
      {
        $project: {
          cellGroup: {
            $multiply: [
              { $divide: ["$totalCellGroup", "$totalPossibleAttendance"] },
              100,
            ],
          },
          personalDevotion: {
            $multiply: [
              {
                $divide: ["$totalPersonalDevotion", "$totalPossibleAttendance"],
              },
              100,
            ],
          },
          familyDevotion: {
            $multiply: [
              { $divide: ["$totalFamilyDevotion", "$totalPossibleAttendance"] },
              100,
            ],
          },
          prayerMeeting: {
            $multiply: [
              { $divide: ["$totalPrayerMeeting", "$totalPossibleAttendance"] },
              100,
            ],
          },
          worshipService: {
            $multiply: [
              { $divide: ["$totalWorshipService", "$totalPossibleAttendance"] },
              100,
            ],
          },
        },
      },
    ]);

    res.json(attendanceData[0]);
  } catch (error) {
    console.error("Error calculating total attendance percentage", error);
    res
      .status(500)
      .json({ error: "Error calculating total attendance percentage" });
  }
};

const top5UsersByAttendance = async (req, res) => {
  try {
    const attendanceData = await UserAttendance.aggregate([
      { $unwind: "$weeklyAttendance" },
      {
        $group: {
          _id: "$userId",
          totalAttendance: {
            $sum: {
              $add: [
                { $cond: ["$weeklyAttendance.cellGroup", 1, 0] },
                { $cond: ["$weeklyAttendance.personalDevotion", 1, 0] },
                { $cond: ["$weeklyAttendance.familyDevotion", 1, 0] },
                { $cond: ["$weeklyAttendance.prayerMeeting", 1, 0] },
                { $cond: ["$weeklyAttendance.worshipService", 1, 0] },
              ],
            },
          },
        },
      },
      { $sort: { totalAttendance: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "ChurchUser",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: "$_id",
          totalAttendance: 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
        },
      },
    ]);

    res.json(attendanceData);
    console.log(attendanceData);
  } catch (error) {
    console.error("Error fetching top 5 users by attendance", error);
    res.status(500).json({ error: "Error fetching top 5 users by attendance" });
  }
};

const totalMembersPerMonth = async (req, res) => {
  try {
    const monthlyTotal = await ChurchUser.aggregate([
      {
        $match: {
          memberType: { $in: ["Member", "Cellgroup Leader", "Network Leader"] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
    ]);

    // Calculate cumulative totals
    let cumulativeTotal = 0;
    const result = monthlyTotal.map((item) => {
      cumulativeTotal += item.monthlyCount;
      return {
        _id: item._id,
        totalMembers: cumulativeTotal,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching total members per month", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};

const newMembers = async (req, res) => {
  try {
    const newMembers = await ChurchUser.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json(newMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching new members data", error });
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

// Fetch a single announcement by ID
const fetchAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementModel.findById(id);

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the announcement" });
  }
};

const archiveAnnouncementById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the announcement by ID
    const announcement = await AnnouncementModel.findById(id);
    if (!announcement) {
      return res.status(404).send({ message: "Announcement not found" });
    }

    // Archive the announcement
    const archivedData = {
      title: announcement.title,
      content: announcement.content,
      publishDate: announcement.publishDate,
      endDate: announcement.endDate,
      audience: announcement.audience,
      announcementPic: announcement.announcementPic,
    };

    // Create a new archived announcement
    await ArchivedAnnouncementModel.create(archivedData);

    // Delete the original announcement
    await AnnouncementModel.findByIdAndDelete(id);

    res
      .status(200)
      .send({ message: `Announcement with ID ${id} archived successfully` });
  } catch (error) {
    console.error("Error archiving announcement:", error);
    res.status(500).send({ message: "Error archiving announcement" });
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

setInterval(archiveExpiredAnnouncements, 24 * 60 * 60 * 1000);

const getGroupedPrayerRequests = async (req, res) => {
  try {
    const groupedRequests = await PrayerRequestModel.aggregate([
      { $unwind: "$prayers" }, // Unwind the prayers array
      {
        $group: {
          _id: "$name", // Group by the user's name
          prayerRequests: {
            $push: {
              prayer: "$prayers.prayer", // Access the prayer field in the unwound object
              dateSubmitted: "$prayers.dateSubmitted", // Access the dateSubmitted field
              isRead: "$prayers.isRead", // If you want to keep this for future use
            },
          },
        },
      },
    ]);

    console.log(groupedRequests);
    return res.status(200).json(groupedRequests);
  } catch (error) {
    console.error("Error fetching grouped prayer requests:", error);
    return res.status(500).json({ error: "Failed to fetch prayer requests" });
  }
};

const getUserByFullName = async (req, res) => {
  try {
    const fullName = req.params.name; // Get the full name from the request parameters

    // Split the full name into an array of words
    const nameParts = fullName.trim().split(" ");

    // Assume the last part is the last name and the rest are the first name
    const lastName = nameParts.pop(); // Remove the last element for the last name
    const firstName = nameParts.join(" "); // Join the remaining parts as the first name

    console.log(`First Name: ${firstName}, Last Name: ${lastName}`); // Log first and last names

    // Find the user in the database
    const user = await ChurchUser.findOne({
      firstName: { $regex: new RegExp(`^${firstName}`, "i") }, // Case-insensitive search
      lastName: { $regex: new RegExp(`^${lastName}`, "i") },
    });

    console.log(`Profile Picture: ${user.profilePic}`);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data (you can customize this as needed)
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user by full name:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSortedPrayerRequests = async (req, res) => {
  try {
    const prayerRequests = await PrayerRequestModel.find().sort({ name: 1 }); // 1 for ascending, -1 for descending

    if (!prayerRequests || prayerRequests.length === 0) {
      return res.status(404).json({ message: "No prayer requests found" });
    }

    return res.status(200).json(prayerRequests);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    return res.status(500).json({ error: "Failed to fetch prayer requests" });
  }
};

// Schedule the function to run daily at 12 AM
cron.schedule("15 12 * * *", () => {
  console.log("Running archiveExpiredAnnouncements job at 12:15 PM");
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
  getSortedPrayerRequests,
  getGroupedPrayerRequests,
  getUserByFullName,
  archiveExpiredAnnouncements,
  newMembers,
  totalMembersPerMonth,
  top5UsersByAttendance,
  totalAttendancePercentage,
  fetchTotalPrayerRequestWeekly,
  fetchAllPrayer,
  fetchNewMembers,
  fetchAnnouncementById,
  archiveAnnouncementById,
};
