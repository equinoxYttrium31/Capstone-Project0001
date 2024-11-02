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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AttendanceOverview = () => {
  const [categoryPercentage, setCategoryPercentage] = useState({});
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchCategoryPercentage = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/attendance-category-percentage"
        );
        setCategoryPercentage(response.data);
      } catch (error) {
        console.error("Error fetching category percentage", error);
      }
    };

    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/top-users-attendance"
        );
        setTopUsers(response.data);
      } catch (error) {
        console.error("Error fetching top users", error);
      }
    };

    fetchCategoryPercentage();
    fetchTopUsers();
  }, []);

  // Prepare data for the chart
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
          categoryPercentage.cellGroup || 0,
          categoryPercentage.personalDevotion || 0,
          categoryPercentage.familyDevotion || 0,
          categoryPercentage.prayerMeeting || 0,
          categoryPercentage.worshipService || 0,
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
      <div>
        <h3>Attendance Percentage by Category</h3>
        <ul>
          <li>Cell Group: {categoryPercentage.cellGroup?.toFixed(2)}%</li>
          <li>
            Personal Devotion: {categoryPercentage.personalDevotion?.toFixed(2)}
            %
          </li>
          <li>
            Family Devotion: {categoryPercentage.familyDevotion?.toFixed(2)}%
          </li>
          <li>
            Prayer Meeting: {categoryPercentage.prayerMeeting?.toFixed(2)}%
          </li>
          <li>
            Worship Service: {categoryPercentage.worshipService?.toFixed(2)}%
          </li>
        </ul>
        <Bar data={chartData} options={options} /> {/* Render the chart */}
      </div>

      <div>
        <h3>Top 5 Users by Total Attendance</h3>
        <ul>
          {topUsers.map((user) => (
            <li key={user.userId}>
              {user.userDetails.firstName} {user.userDetails.lastName} - Total
              Attendance: {user.totalAttendance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceOverview;
