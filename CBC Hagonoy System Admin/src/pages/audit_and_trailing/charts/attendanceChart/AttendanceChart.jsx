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

const NetworkAttendanceOverview = ({ networkLeaderId }) => {
  const [categoryPercentage, setCategoryPercentage] = useState({});

  useEffect(() => {
    const fetchCategoryPercentage = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/network-attendance?networkLeaderId=${networkLeader}`
        );
        setCategoryPercentage(response.data);
      } catch (error) {
        console.error("Error fetching network category percentage", error);
      }
    };

    if (networkLeaderId) {
      fetchCategoryPercentage();
    }
  }, [networkLeaderId]);

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
        text: "Network Attendance Percentage by Category",
      },
    },
  };

  return (
    <div>
      <div>
        <Bar data={chartData} options={options} /> {/* Render the chart */}
      </div>
    </div>
  );
};

export default NetworkAttendanceOverview;
