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
import "./NetworkAttendance.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NetworkAttendance = ({ networkLeader }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        console.log("Fetching data for networkLeader:", networkLeader);

        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/network-attendance?networkLeaderId=${networkLeader}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API Response:", response.data);

        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
        });
        const currentYear = new Date().getFullYear();

        // Filter for the current month and year
        const filteredData = response.data.filter(
          (attendance) =>
            attendance.month === currentMonth && attendance.year === currentYear
        );

        console.log("Filtered Current Month Data:", filteredData);

        setMonthlyData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };

    if (networkLeader) {
      fetchMonthlyData();
    }
  }, [networkLeader]);

  // Chart data preparation
  const chartData = {
    labels: monthlyData.map((data) => data.monthYear),
    datasets: [
      {
        label: "Cell Group",
        data: monthlyData.map((data) => data.cellGroup || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Personal Devotion",
        data: monthlyData.map((data) => data.personalDevotion || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Family Devotion",
        data: monthlyData.map((data) => data.familyDevotion || 0),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Prayer Meeting",
        data: monthlyData.map((data) => data.prayerMeeting || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Worship Service",
        data: monthlyData.map((data) => data.worshipService || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
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
        text: `Attendance for ${new Date().toLocaleString("default", {
          month: "long",
        })} ${new Date().getFullYear()}`,
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
