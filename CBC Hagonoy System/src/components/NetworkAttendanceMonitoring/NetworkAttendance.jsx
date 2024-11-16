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

const NetworkAttendance = ({ networkLeader }) => {
  const [categoryPercentage, setCategoryPercentage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPercentage = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/network-attendance?networkLeaderId=${networkLeader}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data); // Log data for debugging
        setCategoryPercentage(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data", error);
        setLoading(false);
      }
    };

    if (networkLeader) {
      fetchCategoryPercentage();
    }
  }, [networkLeader]);

  const chartData = {
    labels: [
      "Cell Group",
      "Personal Devotion",
      "Family Devotion",
      "Prayer Meeting",
      "Worship Service",
    ],
    datasets: categoryPercentage.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      data: [
        user.attendance.cellGroup || 0,
        user.attendance.personalDevotion || 0,
        user.attendance.familyDevotion || 0,
        user.attendance.prayerMeeting || 0,
        user.attendance.worshipService || 0,
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
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Attendance Percentage by Category (Church Users)",
      },
    },
  };

  return (
    <div className="attendance_overview_container">
      {loading ? <p>Loading...</p> : <Bar data={chartData} options={options} />}
    </div>
  );
};

export default NetworkAttendance;
