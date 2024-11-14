const express = require("express");
const router = express.Router();

const {
  // User Auth & Profile
  registerUser,
  loginUser,
  getProfile,
  authenticateToken,
  uploadProfilePicture,
  fetchProfilePicture,
  updateUserProfile,
  initialEditUserProfile,
  logoutUser,
  changeUserPassword,
  requestOtp,
  changePassword,
  checkAuth,

  // Attendance
  createOrUpdateAttendance,
  getAttendanceByMonthYear,
  getWeeklyAttendance,
  getMonthlyAttendanceSummary,
  getProgressByMonthYear,
  submitDefault,

  // Cell Group
  getCellgroupByLeader,

  // Announcements & Prayer Requests
  fetchLatestAnnouncement,
  fetchCurrentAnnouncement,
  sendPrayerRequest,
  fetchArchivedAnnouncement,

  // Network Lead Records
  getRecordsByNetworkLead,
} = require("../controllers/authController");

const {
  // Admin-Specific Controllers
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

// Test Route
router.get("/", (req, res) => res.send("Test Route"));

// ====== PUBLIC ROUTES ======
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-otp", requestOtp); // Request OTP for password reset
router.post("/change-password", changePassword); // Change password with OTP

// ====== AUTHENTICATED USER ROUTES ======
// Profile
router.get("/profile", authenticateToken, getProfile);
router.post("/uploadProfilePic", authenticateToken, uploadProfilePicture);
router.get("/profile/picture", authenticateToken, fetchProfilePicture);
router.put("/profile/update", authenticateToken, updateUserProfile);
router.post("/profile/initial-edit", authenticateToken, initialEditUserProfile);
router.post(
  "/change-password-authenticated",
  authenticateToken,
  changeUserPassword
);
router.post("/logout", authenticateToken, logoutUser);
router.get("/check-auth", checkAuth);

// Attendance
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
router.get("/progress/:year/:month", authenticateToken, getProgressByMonthYear);

// Cell Group
router.get("/leader/:leaderName", getCellgroupByLeader);

// Announcements & Prayer Requests
router.get("/fetch-latestAnnouncement", fetchLatestAnnouncement);
router.get("/fetch-currentAnnouncement", fetchCurrentAnnouncement);
router.post("/send-prayer", sendPrayerRequest);
router.get("/fetch-archived-announcements", fetchArchivedAnnouncement);

// ====== ADMIN ROUTES ======
// Member Records
router.get("/records", getRecords);
router.post("/add-record", addNewRecord);
router.put("/update-record/:userId", updateRecord);
router.delete("/archive/:userId", archiveRecord);
router.get("/churchUser/:userId", getUserById);
router.get("/archivedUsers", getArchivedUsers);

// Cell Groups
router.post("/create-cellgroup", createNewCellGroup);
router.get("/fetch-cellgroups", fetchCellGroups);

// Announcements
router.post("/add-announcement", addAnnouncements);
router.get("/fetch-announcements", fetchAnnouncements);
router.get("/fetch-announcement-byID/:id", fetchAnnouncementById);
router.delete("/archive-announcement/:id", archiveAnnouncementById);
router.put("/update-announcement/:id", updateAnnouncementbyID);

// Prayer Requests
router.get("/prayer-requests/sorted", getSortedPrayerRequests);
router.get("/prayer-requests/grouped", getGroupedPrayerRequests);

// User Profile by Name
router.get("/users/profile/:name", getUserByFullName);

// Network Lead Records
router.get("/records/networkLead/:networkLead", getRecordsByNetworkLead);

// Statistics & Analytics
router.get("/new-members-per-month", newMembers);
router.get("/total-members-per-month", totalMembersPerMonth);
router.get("/attendance-category-percentage", totalAttendancePercentage);
router.get("/top-users-attendance", top5UsersByAttendance);
router.get("/weekly-prayer-requests", fetchTotalPrayerRequestWeekly);

// Notifications for Admin
router.get("/fetch-prayers", fetchAllPrayer);
router.get("/fetch-newusers", fetchNewMembers);

module.exports = router;
