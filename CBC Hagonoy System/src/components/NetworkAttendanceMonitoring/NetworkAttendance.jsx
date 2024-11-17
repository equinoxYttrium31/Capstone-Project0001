import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
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

const NetworkAttendance = ({ netLeader }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/attendance-report/${netLeader}`
        );
        const data = response.data;

        const labels = data.map((item) => `${item._id.month} ${item._id.year}`);
        const cellGroup = data.map((item) => item.cellGroup);
        const personalDevotion = data.map((item) => item.personalDevotion);
        const familyDevotion = data.map((item) => item.familyDevotion);
        const prayerMeeting = data.map((item) => item.prayerMeeting);
        const worshipService = data.map((item) => item.worshipService);

        setChartData({
          labels,
          datasets: [
            {
              label: "Cell Group",
              data: cellGroup,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Personal Devotion",
              data: personalDevotion,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
            {
              label: "Family Devotion",
              data: familyDevotion,
              backgroundColor: "rgba(255, 206, 86, 0.5)",
            },
            {
              label: "Prayer Meeting",
              data: prayerMeeting,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
            {
              label: "Worship Service",
              data: worshipService,
              backgroundColor: "rgba(153, 102, 255, 0.5)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching attendance data", error);
      }
    };

    fetchAttendanceData();
  }, [netLeader]);

  return (
    <div>
      <h2>Monthly Attendance Report</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Monthly Attendance Report" },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NetworkAttendance;
