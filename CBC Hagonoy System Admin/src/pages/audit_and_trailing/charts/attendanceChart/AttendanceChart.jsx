import { useEffect, useState } from "react";
import axios from "axios";
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
import "./AttendanceChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NetworkAttendanceOverview = () => {
  const [attendancePercentages, setAttendancePercentages] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch attendance category percentages
        const percentagesResponse = await axios.get(
          `https://capstone-project0001-2.onrender.com/attendance-category-percentage`
        );
        setAttendancePercentages(percentagesResponse.data);

        // Fetch top 5 users by attendance
        const topUsersResponse = await axios.get(
          `https://capstone-project0001-2.onrender.com/top-users-attendance`
        );
        setTopUsers(topUsersResponse.data);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to fetch attendance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Prepare data for attendance percentage chart
  const chartData = {
    labels: [
      "Cell Group",
      "Personal Devotion",
      "Family Devotion",
      "Prayer Meeting",
      "Worship Service",
    ],
    datasets: [
      {
        label: "Attendance Percentage",
        data: [
          attendancePercentages.cellGroup || 0,
          attendancePercentages.personalDevotion || 0,
          attendancePercentages.familyDevotion || 0,
          attendancePercentages.prayerMeeting || 0,
          attendancePercentages.worshipService || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Attendance Percentage by Category",
      },
    },
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div>
            <Bar data={chartData} options={options} />
          </div>
          <div className="ranking-container">
            <h2>Top 5 Users by Attendance</h2>
            <ul>
              {topUsers.map((user, index) => (
                <li key={index}>
                  {`${user.userDetails.firstName} ${user.userDetails.lastName}`}{" "}
                  - <b>{user.totalAttendance}</b> Attendance
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkAttendanceOverview;
