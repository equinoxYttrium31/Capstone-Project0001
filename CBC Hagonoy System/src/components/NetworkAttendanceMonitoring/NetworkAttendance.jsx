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
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/network-attendance?networkLeaderId=${networkLeader}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data); // Log data for debugging

        // Aggregate the attendance data by month
        const aggregatedData = response.data.reduce((acc, user) => {
          // Format the month from the attendance data (assume there's a 'date' field)
          const month = new Date(user.attendance.date).toLocaleString(
            "default",
            {
              month: "long",
            }
          );

          if (!acc[month]) {
            acc[month] = {
              cellGroup: 0,
              personalDevotion: 0,
              familyDevotion: 0,
              prayerMeeting: 0,
              worshipService: 0,
            };
          }

          acc[month].cellGroup += user.attendance.cellGroup || 0;
          acc[month].personalDevotion += user.attendance.personalDevotion || 0;
          acc[month].familyDevotion += user.attendance.familyDevotion || 0;
          acc[month].prayerMeeting += user.attendance.prayerMeeting || 0;
          acc[month].worshipService += user.attendance.worshipService || 0;

          return acc;
        }, {});

        // Convert the aggregated data into a format suitable for the chart
        const formattedData = Object.entries(aggregatedData).map(
          ([month, data]) => ({
            month,
            ...data,
          })
        );

        setMonthlyData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data", error);
        setLoading(false);
      }
    };

    if (networkLeader) {
      fetchMonthlyData();
    }
  }, [networkLeader]);

  // Prepare data for the chart
  const chartData = {
    labels: monthlyData.map((data) => data.month), // Month labels
    datasets: [
      {
        label: "Cell Group",
        data: monthlyData.map((data) => data.cellGroup),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Personal Devotion",
        data: monthlyData.map((data) => data.personalDevotion),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Family Devotion",
        data: monthlyData.map((data) => data.familyDevotion),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Prayer Meeting",
        data: monthlyData.map((data) => data.prayerMeeting),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Worship Service",
        data: monthlyData.map((data) => data.worshipService),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
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
        text: "Total Attendance by Category per Month",
      },
    },
    scales: {
      x: {
        stacked: true, // Stack the bars for each month
      },
      y: {
        beginAtZero: true, // Start the y-axis from zero
        ticks: {
          stepSize: 10, // Adjust the step size if necessary
        },
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
