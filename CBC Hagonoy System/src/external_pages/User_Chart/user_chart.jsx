import { useState, useEffect } from "react";
import "./user_chart.css";
import {
  getCurrentMonth,
  getCurrentYear,
} from "../../Utility Functions/utility_setmonth";
import axios from "axios";
import PropTypes from "prop-types";

function UserChart({ userId, refresh }) {
  // PropType Validation
  UserChart.propTypes = {
    userId: PropTypes.string.isRequired,
    refresh: PropTypes.bool.isRequired,
  };

  const [attendanceProgress, setAttendanceProgress] = useState({
    cellGroup: 0,
    personalDevotion: 0,
    familyDevotion: 0,
    prayerMeeting: 0,
    worshipService: 0,
  });
  const [totalWeeks, setTotalWeeks] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    setCurrentMonth(month);
    setCurrentYear(year);
    fetchAttendanceData(userId, month, year);
  }, [userId]);

  const fetchAttendanceData = async (userId, month, year) => {
    try {
      if (!userId) {
        throw new Error("User ID is not available.");
      }

      const response = await axios.get(
        `https://capstone-project0001-2.onrender.com/attendance-month/${userId}/${month}/${year}`,
        {
          withCredentials: true,
        }
      );

      const attendance = response.data;

      // Set totalWeeks based on weeklyAttendance array length
      const weeksInAttendance = attendance.weeklyAttendance.length;
      setTotalWeeks(weeksInAttendance);

      // Accumulate total attendance for each activity
      let totalCellGroup = 0;
      let totalPersonalDevotion = 0;
      let totalFamilyDevotion = 0;
      let totalPrayerMeeting = 0;
      let totalWorshipService = 0;

      attendance.weeklyAttendance.forEach((week) => {
        totalCellGroup += week.cellGroup ? 1 : 0;
        totalPersonalDevotion += week.personalDevotion ? 1 : 0;
        totalFamilyDevotion += week.familyDevotion ? 1 : 0;
        totalPrayerMeeting += week.prayerMeeting ? 1 : 0;
        totalWorshipService += week.worshipService ? 1 : 0;
      });

      setAttendanceProgress({
        cellGroup: totalCellGroup,
        personalDevotion: totalPersonalDevotion,
        familyDevotion: totalFamilyDevotion,
        prayerMeeting: totalPrayerMeeting,
        worshipService: totalWorshipService,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceProgress({
        cellGroup: 0,
        personalDevotion: 0,
        familyDevotion: 0,
        prayerMeeting: 0,
        worshipService: 0,
      });
    }
  };

  const handleRefresh = () => {
    fetchAttendanceData(userId, currentMonth, currentYear);
  };

  useEffect(() => {
    if (refresh) {
      handleRefresh();
    }
  }, [refresh]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setCurrentMonth(month);
    fetchAttendanceData(userId, month, currentYear);
  };

  const isFutureMonth = (month) => {
    const monthIndex = [
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
    ].indexOf(month);
    const currentMonthIndex = new Date().getMonth();
    return monthIndex > currentMonthIndex;
  };

  const totalAttendance =
    attendanceProgress.cellGroup +
    attendanceProgress.personalDevotion +
    attendanceProgress.familyDevotion +
    attendanceProgress.prayerMeeting +
    attendanceProgress.worshipService;

  const totalAttendancesExpected = totalWeeks * 5;

  const calculatePercentage = (attendedWeeks) => {
    return attendedWeeks > 0
      ? ((attendedWeeks / totalAttendancesExpected) * 100).toFixed(2)
      : 0;
  };

  const colors = {
    cellGroup: "#36a2eb",
    personalDevotion: "#ff6384",
    familyDevotion: "#ffce56",
    prayerMeeting: "#4bc0c0",
    worshipService: "#9966ff",
    missing: "#d3d3d3",
  };

  return (
    <div className="user_chart_main_cont">
      <div className="chart_header">
        <select
          name="months"
          id="months"
          className="months_selector"
          onChange={handleMonthChange}
          value={currentMonth}
        >
          <option value="Select_Month">Select Month</option>
          {[
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
          ].map((month) => (
            <option
              key={month}
              value={month}
              disabled={isFutureMonth(month)} // Disable future months
            >
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="chart_container">
        <div
          className="doughnut_chart"
          style={{
            background: `conic-gradient(
              ${colors.cellGroup} 0deg ${
              calculatePercentage(attendanceProgress.cellGroup) * 3.6
            }deg,
              ${colors.personalDevotion} ${
              calculatePercentage(attendanceProgress.cellGroup) * 3.6
            }deg ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion
              ) * 3.6
            }deg,
              ${colors.familyDevotion} ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion
              ) * 3.6
            }deg ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion
              ) * 3.6
            }deg,
              ${colors.prayerMeeting} ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion
              ) * 3.6
            }deg ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion +
                  attendanceProgress.prayerMeeting
              ) * 3.6
            }deg,
              ${colors.worshipService} ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion +
                  attendanceProgress.prayerMeeting
              ) * 3.6
            }deg ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion +
                  attendanceProgress.prayerMeeting +
                  attendanceProgress.worshipService
              ) * 3.6
            }deg,
              ${colors.missing} ${
              calculatePercentage(
                attendanceProgress.cellGroup +
                  attendanceProgress.personalDevotion +
                  attendanceProgress.familyDevotion +
                  attendanceProgress.prayerMeeting +
                  attendanceProgress.worshipService
              ) * 3.6
            }deg ${360}deg
            )`,
          }}
        >
          <div className="chart_center"></div>
        </div>
      </div>

      <div className="chart_percentage_cont">
        <div className="chart_label">
          Total Attendance:{" "}
          {((totalAttendance / (totalWeeks * 5)) * 100).toFixed(2)}%
        </div>
      </div>

      <div className="legends_container">
        <h3 className="legends_title">Legends:</h3>

        {/* Render progress for each activity */}
        <div className="individual_legend_cont">
          <div className="legend_color_div CG"></div>
          <p className="legend_color_label">
            Cell Group: {calculatePercentage(attendanceProgress.cellGroup)}%
          </p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PD"></div>
          <p className="legend_color_label">
            Personal Devotion:{" "}
            {calculatePercentage(attendanceProgress.personalDevotion)}%
          </p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div FD"></div>
          <p className="legend_color_label">
            Family Devotion:{" "}
            {calculatePercentage(attendanceProgress.familyDevotion)}%
          </p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PM"></div>
          <p className="legend_color_label">
            Prayer Meeting:{" "}
            {calculatePercentage(attendanceProgress.prayerMeeting)}%
          </p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div WS"></div>
          <p className="legend_color_label">
            Worship Service:{" "}
            {calculatePercentage(attendanceProgress.worshipService)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserChart;
