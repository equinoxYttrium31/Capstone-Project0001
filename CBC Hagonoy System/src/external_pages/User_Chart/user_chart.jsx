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
  const [totalWeeks, setTotalWeeks] = useState(0);
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

      // Ensure that we handle missing weeks by creating a default attendance array
      const totalWeeksInMonth = getWeeksInMonth(month, year);
      setTotalWeeks(totalWeeksInMonth);

      let cellGroup = new Array(totalWeeksInMonth).fill(0);
      let personalDevotion = new Array(totalWeeksInMonth).fill(0);
      let familyDevotion = new Array(totalWeeksInMonth).fill(0);
      let prayerMeeting = new Array(totalWeeksInMonth).fill(0);
      let worshipService = new Array(totalWeeksInMonth).fill(0);

      // Process the weekly attendance data
      attendance.weeklyAttendance.forEach((week) => {
        const weekIndex = week.weekNumber - 1; // Convert weekNumber to array index
        if (weekIndex >= 0 && weekIndex < totalWeeksInMonth) {
          cellGroup[weekIndex] = week.cellGroup ? 1 : 0;
          personalDevotion[weekIndex] = week.personalDevotion ? 1 : 0;
          familyDevotion[weekIndex] = week.familyDevotion ? 1 : 0;
          prayerMeeting[weekIndex] = week.prayerMeeting ? 1 : 0;
          worshipService[weekIndex] = week.worshipService ? 1 : 0;
        }
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

  // Get the number of weeks in a month (defaults to 5 weeks for months that don't have a full 6th week)
  const getWeeksInMonth = (month, year) => {
    const daysInMonth = new Date(
      year,
      new Date(month + " 1, " + year).getMonth() + 1,
      0
    ).getDate();
    return Math.ceil(daysInMonth / 7); // Calculate number of weeks based on the number of days
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

  // Chart options with stacked bars
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true, // Enable stacking on x-axis
      },
      y: {
        stacked: true, // Enable stacking on y-axis
      },
    },
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
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="chart_percentage_cont">
        <div className="chart_label">
          Total Attendance:{" "}
          {(
            ((attendanceProgress.cellGroup.filter(Boolean).length +
              attendanceProgress.personalDevotion.filter(Boolean).length +
              attendanceProgress.familyDevotion.filter(Boolean).length +
              attendanceProgress.prayerMeeting.filter(Boolean).length +
              attendanceProgress.worshipService.filter(Boolean).length) /
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
