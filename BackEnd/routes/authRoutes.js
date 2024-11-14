const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  authenticateToken,
  uploadProfilePicture,
  fetchProfilePicture,
  updateUserProfile,
  initialEditUserProfile,
  logoutUser,
  createOrUpdateAttendance,
  getAttendanceByMonthYear,
  getWeeklyAttendance,
  getMonthlyAttendanceSummary,
  getProgressByMonthYear,
  checkAuth,
  getCellgroupByLeader,
  submitDefault,
  fetchLatestAnnouncement,
  sendPrayerRequest,
  fetchCurrentAnnouncement,
  getRecordsByNetworkLead,
  fetchArchivedAnnouncement,
  changeUserPassword,
} = require("../controllers/authController");

const {
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
} = require("../controllers/authController_Admin");
const cors = require("cors");

// Middleware for CORS
router.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Define a test route
router.get("/", (req, res) => res.send("Test Route"));

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes: Requires authentication
router.get("/profile", authenticateToken, getProfile);
router.post("/uploadProfilePic", authenticateToken, uploadProfilePicture);
router.get("/profile/picture", authenticateToken, fetchProfilePicture);
router.put("/profile/update", authenticateToken, updateUserProfile);
router.post("/profile/initial-edit", authenticateToken, initialEditUserProfile);
router.get("/leader/:leaderName", getCellgroupByLeader);

router.post("/default-attendance", authenticateToken, submitDefault);
router.post("/attendance", authenticateToken, createOrUpdateAttendance);
router.get(
  "/attendance-month/:userId/:month/:year",
  authenticateToken,
  getAttendanceByMonthYear
);
router.get(
  "/attendance-weekly/get/:userId/:month/:year/:weekNumber",
  authenticateToken,
  getWeeklyAttendance
);
router.get(
  "/attendance/summary/:userId/:month/:year",
  authenticateToken,
  getMonthlyAttendanceSummary
);

router.get("/fetch-latestAnnouncement", fetchLatestAnnouncement);
router.get("/fetch-currentAnnouncement", fetchCurrentAnnouncement);
router.post("/send-prayer", sendPrayerRequest);
router.post("/change-password", authenticateToken, changeUserPassword);

// Attendance fetch function
const getAttendanceByUser = async (req, res) => {
  const userId = req.params.userId;
  const month = req.params.month;
  const year = req.params.year;
  const week = req.params.week;

  console.log(
    `Fetching attendance for User ID: ${userId}, Month: ${month}, Year: ${year}, Week: ${week}`
  );

  try {
    const attendanceData = await AttendanceModel.findOne({
      userId,
      month,
      year,
      week,
    });

    if (!attendanceData) {
      return res.status(404).send("Attendance data not found");
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Progress route
router.get("/progress/:year/:month", authenticateToken, getProgressByMonthYear); // Added authenticateToken middleware for progress

// Logout route
router.post("/logout", authenticateToken, logoutUser); // Ensure logout is also protected
router.get("/check-auth", checkAuth);

//Routes from admin
router.get("/records", getRecords);
router.post("/add-record", addNewRecord);
router.delete("/archive/:userId", archiveRecord);
router.put("/update-record/:userId", updateRecord);
router.get("/churchUser/:userId", getUserById);
router.get("/archivedUsers", getArchivedUsers);
router.post("/create-cellgroup", createNewCellGroup);
router.get("/fetch-cellgroups", fetchCellGroups);
router.post("/add-announcement", addAnnouncements);
router.get("/fetch-announcements", fetchAnnouncements);
router.get("/prayer-requests/sorted", getSortedPrayerRequests);
router.get("/prayer-requests/grouped", getGroupedPrayerRequests);
router.get("/users/profile/:name", getUserByFullName);

router.get("/records/networkLead/:networkLead", getRecordsByNetworkLead);
router.get("/fetch-archived-announcements", fetchArchivedAnnouncement);
router.get("/fetch-announcement-byID/:id", fetchAnnouncementById);

router.get("/new-members-per-month", newMembers);
router.get("/total-members-per-month", totalMembersPerMonth);
router.get("/attendance-category-percentage", totalAttendancePercentage);
router.get("/top-users-attendance", top5UsersByAttendance);
router.get("/weekly-prayer-requests", fetchTotalPrayerRequestWeekly);

//Notification Admin Routes
router.get("/fetch-prayers", fetchAllPrayer);
router.get("/fetch-newusers", fetchNewMembers);

router.delete("/archive-announcement/:id", archiveAnnouncementById);
router.put("/update-announcement/:id", updateAnnouncementbyID);
// Export the router
module.exports = router;
