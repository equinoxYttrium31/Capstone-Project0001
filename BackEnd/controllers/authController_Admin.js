const ChurchUser = require("../models/ChurchUser");
const UserAttendance = require("../models/UserAttendance");
const NetworkModel = require("../models/NetworkLeader");
const CellGroup = require("../models/CellGroup");
const ArchieveUserModel = require("../models/ArchieveRecords");
const AnnouncementModel = require("../models/Announcements"); // Adjust to your model
const ArchivedAnnouncementModel = require("../models/ArchievedAnnouncements");
const PrayerRequestModel = require("../models/Prayer_Request");
const ArchivedPrayerRequestModel = require("../models/ArchivePrayer");
const AttendanceDeets = require("../models/AttendanceDetails");
const Attendance = require("../models/AttendanceModelNew");
const { hashPassword, comparePassword } = require("../helpers/auth");
const sharp = require("sharp"); // Import sharp at the top of your file
const moment = require("moment");
const cron = require("node-cron");

const generateDeetsID = async () => {
  try {
    // Find the latest document sorted by attendanceID
    const lastEntry = await AttendanceDeets.findOne()
      .sort({ attendanceID: -1 })
      .exec();

    // Get the current year and month
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

    let newID;

    if (lastEntry) {
      const lastID = lastEntry.attendanceID;

      // Extract year and month from the last ID
      const [lastYear, lastMonth] = lastID.split("-");

      if (lastYear === year.toString() && lastMonth === month) {
        // Increment the numeric part if within the same year and month
        const lastNumericPart = parseInt(lastID.split("-")[2], 10);
        const nextNumericPart = (lastNumericPart + 1)
          .toString()
          .padStart(7, "0");
        newID = `${year}-${month}-${nextNumericPart}`;
      } else {
        // Reset the numeric part for a new month or year
        newID = `${year}-${month}-0000001`;
      }
    } else {
      // Initialize the first ID if no entries exist
      newID = `${year}-${month}-0000001`;
    }

    return newID;
  } catch (error) {
    console.error("Error generating attendance ID:", error.message);
    throw new Error("Could not generate a new attendance ID.");
  }
};

const fetchAttendancetoBeApproved = async (req, res) => {
  try {
    // Fetch all attendance records from the database
    const allAttendance = await Attendance.find();

    if (!allAttendance || allAttendance.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Ensure the correct response format
    res.status(200).json({
      message: "All attendance records fetched successfully.",
      attendance: allAttendance,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const storeAttendanceDeets = async (req, res) => {
  try {
    // Extract details from the request body
    const { title, date } = req.body;

    // Validate input
    if (!title || !date) {
      return res.status(400).json({ error: "Title and Date are required." });
    }

    // Generate a unique attendanceID
    const attendanceID = await generateDeetsID();

    // Create a new AttendanceDeets document
    const attendance = new AttendanceDeets({
      title,
      date,
      attendanceID,
    });

    // Save the document to the database
    const savedAttendance = await attendance.save();

    // Respond with the saved attendance details
    res.status(201).json({
      message: "Attendance details successfully stored.",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("Error storing attendance deets:", error.message);
    res.status(500).json({
      error: "An error occurred while storing attendance details.",
    });
  }
};

const fetchAttendanceDeets = async (req, res) => {
  try {
    const attendanceID = req.params.attendanceID;

    const attendance = await AttendanceDeets.findOne({
      attendanceID: attendanceID,
    });
    console.log(attendance);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance details:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching attendance details.",
    });
  }
};

async function generateCellGroupID(networkLeader) {
  try {
    // Step 1: Find the network associated with the network leader
    const network = await NetworkModel.findOne({ networkLeader }).exec();

    if (!network) {
      throw new Error(`No network found for network leader: ${networkLeader}`);
    }

    const networkID = network.networkID; // Get the networkID
    console.log(`Network ID found: ${networkID}`); // Debugging line

    if (!networkID) {
      throw new Error(
        `No networkID found for network leader: ${networkLeader}`
      );
    }

    // Step 2: Fetch all existing cellgroupIDs for this specific networkLeader
    const cellGroups = await CellGroup.find({ networkLeader }).exec();

    // Step 3: Identify the last assigned cellgroupID and check for gaps in the sequence
    const existingIDs = cellGroups.map((group) => group.cellgroupID);
    const usedNumbers = existingIDs
      .map((id) => {
        const [prefix, num] = id.split("-");
        return parseInt(num, 10); // Extract the numeric part of the ID
      })
      .sort((a, b) => a - b); // Sort the IDs numerically

    // Step 4: Find the first missing slot in the sequence or start from 1 if no gaps
    let newNumber = 1; // Always start at 1 for each new network
    for (let i = 1; i <= usedNumbers.length; i++) {
      if (usedNumbers[i] !== usedNumbers[i - 1] + 1) {
        newNumber = usedNumbers[i - 1] + 1; // Found a gap, use the next number
        break;
      }
    }

    // If no missing slot, increment the last used number
    if (newNumber === 1) {
      newNumber = usedNumbers[usedNumbers.length - 1] + 1;
    }

    // Format the new cellgroupID with the networkID as the prefix and the new number
    let newID = `${networkID}-${String(newNumber).padStart(4, "0")}`;

    // Step 5: Check if the newID already exists in the collection
    let existingCellGroup = await CellGroup.findOne({
      cellgroupID: newID,
    }).exec();

    // Keep trying with incremented number until a unique ID is found
    while (existingCellGroup) {
      console.log(
        `CellGroup ID ${newID} already exists, generating a new one.`
      );
      newNumber++; // Increment the number to find the next available slot
      newID = `${networkID}-${String(newNumber).padStart(4, "0")}`;
      existingCellGroup = await CellGroup.findOne({
        cellgroupID: newID,
      }).exec();
    }

    return newID;
  } catch (error) {
    console.error("Error generating CellGroupID:", error);
    throw new Error("Failed to generate CellGroupID");
  }
}

async function generateNetworkID() {
  try {
    // Find the latest Network with the highest networkID
    const lastEntry = await NetworkModel.findOne()
      .sort({ networkID: -1 })
      .exec();

    let newID = "01";

    if (lastEntry && lastEntry.networkID) {
      const lastNetworkID = lastEntry.networkID;
      const currentNetworkPrefix = lastNetworkID.substring(0, 2);

      // Increment the network ID
      const nextNetworkPrefix = String(
        parseInt(currentNetworkPrefix, 10) + 1
      ).padStart(2, "0");

      newID = nextNetworkPrefix; // Set the new network ID
    }

    return newID;
  } catch (error) {
    console.error("Error generating NetworkID:", error);
    throw new Error("Failed to generate NetworkID");
  }
}

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

const fetchAllNetwork = async (req, res) => {
  try {
    const networks = await NetworkModel.find(); // Assuming you have a Mongoose model
    res.json(networks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cell groups" });
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

    await archivePrayerRequests();

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

    await archivePrayerRequests();

    res.json(weeklyData);
    console.log(weeklyData);
  } catch (error) {
    console.error("Error fetching weekly prayer requests", error);
    res.status(500).json({ error: "Error fetching weekly prayer requests" });
  }
};

const archivePrayerRequests = async () => {
  try {
    const currentDate = new Date();
    const firstDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Find all prayer requests with prayers submitted before the current month
    const prayerRequestsToArchive = await PrayerRequestModel.find({
      "prayers.dateSubmitted": { $lt: firstDayOfCurrentMonth },
    });

    if (prayerRequestsToArchive.length === 0) {
      console.log("No prayer requests to archive.");
      return;
    }

    // Prepare archives
    const archives = prayerRequestsToArchive.map((request) => {
      const prayersToArchive = request.prayers.filter(
        (prayer) => prayer.dateSubmitted < firstDayOfCurrentMonth
      );

      return {
        name: request.name,
        prayers: prayersToArchive,
        archiveMonth: currentDate.getMonth(),
        archiveYear: currentDate.getFullYear(),
      };
    });

    // Save archived requests in the archive collection
    if (archives.length > 0) {
      await ArchivedPrayerRequestModel.insertMany(archives);
    }

    // Remove archived prayers from original requests using $pull
    const updatePromises = prayerRequestsToArchive.map((request) =>
      PrayerRequestModel.updateOne(
        { _id: request._id },
        {
          $pull: {
            prayers: { dateSubmitted: { $lt: firstDayOfCurrentMonth } },
          },
        }
      )
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log(`${archives.length} prayer requests archived.`);
  } catch (error) {
    console.error("Error archiving prayer requests:", error);
  }
};

const schedule = require("node-schedule");

schedule.scheduleJob("0 0 1 * *", async () => {
  console.log("Running monthly prayer request archiving job...");
  await archivePrayerRequests();
});

const updateCellgroupByID = async (req, res) => {
  try {
    // Get the cellgroupID from the request parameters
    const cellgroupID = req.params.cellgroupID;

    // Validate if cellgroupID is provided
    if (!cellgroupID) {
      return res.status(400).json({ error: "Cellgroup ID is required" });
    }

    // Destructure the necessary fields from the request body
    const { cellgroupName, cellgroupLeader, networkLeader } = req.body;

    // Validate required fields
    if (!cellgroupName || !cellgroupLeader || !networkLeader) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare the update data object
    const updateData = {
      cellgroupName,
      cellgroupLeader,
      networkLeader,
    };

    // Find and update the cell group by its ID
    let updatedCellGroup;
    try {
      updatedCellGroup = await CellGroup.findOneAndUpdate(
        { cellgroupID },
        updateData,
        { new: true }
      );
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if the cell group was found and updated
    if (!updatedCellGroup) {
      return res.status(404).json({ error: "Cellgroup not found" });
    }

    res.json(updatedCellGroup);
  } catch (error) {
    console.error("Error updating cell group:", error);
    res.status(500).json({ error: "Server error" });
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

const createNewCellGroup = async (req, res) => {
  try {
    const { cellgroupName, cellgroupLeader, networkLeader } = req.body;

    // Validate input fields
    if (!cellgroupName || !cellgroupLeader || !networkLeader) {
      return res.status(400).json({ error: "All input fields are required" });
    }

    // Step 1: Fetch the Network document using the networkLeader
    const network = await NetworkModel.findOne({ networkLeader }).exec();

    if (!network) {
      return res.status(404).json({
        error: `No network found for network leader: ${networkLeader}`,
      });
    }

    // Step 2: Generate the CellGroupID, passing the networkLeader to get the correct networkID
    const newID = await generateCellGroupID(networkLeader);

    // Step 3: Check if the cellgroupName already exists
    const existingCellGroup = await CellGroup.findOne({ cellgroupName }).exec();
    if (existingCellGroup) {
      return res.status(400).json({
        error: `CellGroup with name "${cellgroupName}" already exists.`,
      });
    }

    // Step 4: Create the new CellGroup
    const newCellGroup = await CellGroup.create({
      cellgroupName,
      cellgroupLeader,
      networkLeader,
      cellgroupID: newID,
    });

    // Respond with the newly created CellGroup
    return res.status(201).json({
      message: "CellGroup created successfully",
      data: newCellGroup,
    });
  } catch (error) {
    console.error("Error during creation of CellGroup:", error); // Log the error
    // Provide more specific error message
    if (error.message.includes("Failed to generate CellGroupID")) {
      return res
        .status(500)
        .json({ error: "Error generating unique CellGroupID" });
    }
    return res.status(500).json({ error: "Server error" }); // Return server error to client
  }
};
const updateCellgroupIDList = async (networkID) => {
  try {
    // Extract the prefix (first two digits) from the networkID
    const networkPrefix = networkID.substring(0, 2);

    // Find all CellGroups where cellgroupID starts with the same prefix as networkID
    const cellGroups = await CellGroup.find({
      cellgroupID: { $regex: `^${networkPrefix}-` }, // Regex to match the prefix
    });

    // Extract the cellgroupID of the matching CellGroups
    const cellgroupIDList = cellGroups.map(
      (cellGroup) => cellGroup.cellgroupID
    );

    return cellgroupIDList;
  } catch (error) {
    console.error("Error fetching cellgroups:", error);
    throw new Error("Failed to update cellgroupID list");
  }
};

const createNewNetwork = async (req, res) => {
  try {
    const { networkLeader } = req.body;

    // Validate input fields
    if (!networkLeader || !networkLeader) {
      return res.status(400).json({ error: "Input fields are required" });
    }

    const newID = await generateNetworkID();

    const cellgroupIDList = await updateCellgroupIDList(newID);

    // Create new CellGroup
    const newNetwork = await NetworkModel.create({
      networkLeader,
      networkID: newID,
      cellgroupIDList: cellgroupIDList,
    });

    // Respond with the newly created CellGroup
    return res.status(201).json({
      message: "Network created successfully",
      data: newNetwork,
    });
  } catch (error) {
    console.error("Error during creation of Network:", error); // Log the error
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

const fetchNetworkbyID = async (req, res) => {
  try {
    const networkID = req.params.networkID;

    const networkToEdit = await NetworkModel.findOne({ networkID });
    if (!networkToEdit) {
      return res.status(404).json({ message: "Network not found" });
    }

    console.log(networkToEdit);

    return res.json(networkToEdit);
  } catch (error) {
    console.error("Error fetching network:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchCellgroupByID = async (req, res) => {
  try {
    const cellgroupID = req.params.cellgroupID;

    console.log(cellgroupID);

    const toBeEdit = await CellGroup.findOne({ cellgroupID });
    if (!toBeEdit) {
      return res.status(404).json({ message: "Cell group not found" });
    }

    console.log(toBeEdit);

    return res.json(toBeEdit);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cell group" });
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

const updateAnnouncementbyID = async (req, res) => {
  const { id } = req.params;
  const { title, content, announcementPic, audience, publishDate, endDate } =
    req.body;

  try {
    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        announcementPic,
        audience,
        publishDate,
        endDate,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Internal server error" });
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

const getUsersGender = async (req, res) => {
  const { gender } = req.query;

  try {
    if (gender === "all" || !gender) {
      const maleCount = await ChurchUser.countDocuments({ gender: "Male" });
      const femaleCount = await ChurchUser.countDocuments({ gender: "Female" });

      return res.json({ male: maleCount, female: femaleCount });
    } else {
      const count = await User.countDocuments({ gender });
      return res.json({ [gender]: count });
    }
  } catch (error) {
    console.error("Error fetching users by gender:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Schedule the function to run daily at 12 AM
cron.schedule("00 00 * * *", () => {
  console.log("Running archiveExpiredAnnouncements job at 12:15 PM");
  archiveExpiredAnnouncements();
});

module.exports = {
  getUsersGender,
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
  updateAnnouncementbyID,
  createNewNetwork,
  fetchCellgroupByID,
  updateCellgroupByID,
  archivePrayerRequests,
  fetchAllNetwork,
  storeAttendanceDeets,
  fetchNetworkbyID,
  fetchAttendancetoBeApproved,
  fetchAttendanceDeets,
};
