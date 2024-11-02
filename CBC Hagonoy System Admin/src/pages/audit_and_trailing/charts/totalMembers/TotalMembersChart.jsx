import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./TotalMembersChart.css"; // Import CSS for styling

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getMonthName = (monthIndex) => {
  const months = [
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
  ];
  return months[monthIndex - 1]; // Adjust for 1-based month indexing
};

const TotalMembersChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Members",
        data: [],
        borderColor: "rgba(54, 162, 235, 0.6)", // Line color
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Point fill color
        fill: true, // Area fill under the line
        tension: 0.3, // Smooth line
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/total-members-per-month`
        );

        // Process response to extract labels and data
        const labels = response.data.map(
          (item) => `${getMonthName(item._id.month)}-${item._id.year}`
        );
        const data = response.data.map((item) => item.totalMembers);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Members",
              data,
              borderColor: "rgba(54, 162, 235, 0.6)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching total members data", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TotalMembersChart;
