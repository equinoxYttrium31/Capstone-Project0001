import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./user_chart.css";
import {
  getCurrentMonth,
  getCurrentYear,
} from "../../Utility Functions/utility_setmonth";
import axios from "axios";
import PropTypes from "prop-types";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UserChart({ userId, refresh }) {
  // PropType Validation
  UserChart.propTypes = {
    userId: PropTypes.string.isRequired,
    refresh: PropTypes.bool.isRequired,
  };

  const [attendanceProgress, setAttendanceProgress] = useState({
    cellGroup: [],
    personalDevotion: [],
    familyDevotion: [],
    prayerMeeting: [],
    worshipService: [],
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

      // Initialize arrays for weekly progress
      let cellGroup = [];
      let personalDevotion = [];
      let familyDevotion = [];
      let prayerMeeting = [];
      let worshipService = [];

      attendance.weeklyAttendance.forEach((week) => {
        cellGroup.push(week.cellGroup ? 1 : 0);
        personalDevotion.push(week.personalDevotion ? 1 : 0);
        familyDevotion.push(week.familyDevotion ? 1 : 0);
        prayerMeeting.push(week.prayerMeeting ? 1 : 0);
        worshipService.push(week.worshipService ? 1 : 0);
      });

      setAttendanceProgress({
        cellGroup,
        personalDevotion,
        familyDevotion,
        prayerMeeting,
        worshipService,
      });
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setAttendanceProgress({
        cellGroup: [],
        personalDevotion: [],
        familyDevotion: [],
        prayerMeeting: [],
        worshipService: [],
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

  // Prepare the chart data
  const chartData = {
    labels: Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`), // Dynamic weeks based on attendance
    datasets: [
      {
        label: "Cell Group",
        data: attendanceProgress.cellGroup,
        backgroundColor: "#36a2eb",
        borderColor: "#36a2eb",
        borderWidth: 1,
      },
      {
        label: "Personal Devotion",
        data: attendanceProgress.personalDevotion,
        backgroundColor: "#ff6384",
        borderColor: "#ff6384",
        borderWidth: 1,
      },
      {
        label: "Family Devotion",
        data: attendanceProgress.familyDevotion,
        backgroundColor: "#ffce56",
        borderColor: "#ffce56",
        borderWidth: 1,
      },
      {
        label: "Prayer Meeting",
        data: attendanceProgress.prayerMeeting,
        backgroundColor: "#4bc0c0",
        borderColor: "#4bc0c0",
        borderWidth: 1,
      },
      {
        label: "Worship Service",
        data: attendanceProgress.worshipService,
        backgroundColor: "#9966ff",
        borderColor: "#9966ff",
        borderWidth: 1,
      },
    ],
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
            <option key={month} value={month} disabled={isFutureMonth(month)}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="chart_container">
        <Bar data={chartData} />
      </div>

      <div className="chart_percentage_cont">
        <div className="chart_label">
          Total Attendance:{" "}
          {(
            ((attendanceProgress.cellGroup.length +
              attendanceProgress.personalDevotion.length +
              attendanceProgress.familyDevotion.length +
              attendanceProgress.prayerMeeting.length +
              attendanceProgress.worshipService.length) /
              (totalWeeks * 5)) *
            100
          ).toFixed(2)}
          %
        </div>
      </div>
    </div>
  );
}

export default UserChart;
