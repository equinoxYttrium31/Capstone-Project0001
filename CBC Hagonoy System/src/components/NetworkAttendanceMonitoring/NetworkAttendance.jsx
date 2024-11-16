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
        console.log("Fetching data for networkLeader:", networkLeader); // Log the network leader being passed

        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/network-attendance?networkLeaderId=${networkLeader}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("API Response:", response.data); // Log API response to check data structure

        // Aggregate the attendance data by month and year
        const aggregatedData = response.data.reduce((acc, user) => {
          console.log("Processing user:", user); // Log each user data

          // Make sure attendanceByMonth exists and is an array
          if (user.attendanceByMonth && Array.isArray(user.attendanceByMonth)) {
            user.attendanceByMonth.forEach((attendance) => {
              const {
                month,
                year,
                cellGroup,
                personalDevotion,
                familyDevotion,
                prayerMeeting,
                worshipService,
              } = attendance;

              // Combine month and year to create the monthYear key
              const monthYear = `${month} ${year}`;
              console.log("Processing attendance for monthYear:", monthYear); // Log the combined monthYear

              // Initialize the monthYear entry if it doesn't exist
              if (!acc[monthYear]) {
                acc[monthYear] = {
                  cellGroup: 0,
                  personalDevotion: 0,
                  familyDevotion: 0,
                  prayerMeeting: 0,
                  worshipService: 0,
                };
              }

              // Sum attendance by category for each month
              acc[monthYear].cellGroup += cellGroup || 0;
              acc[monthYear].personalDevotion += personalDevotion || 0;
              acc[monthYear].familyDevotion += familyDevotion || 0;
              acc[monthYear].prayerMeeting += prayerMeeting || 0;
              acc[monthYear].worshipService += worshipService || 0;
            });
          } else {
            console.warn("No attendanceByMonth data found for user:", user); // Warn if attendanceByMonth is missing
          }
          return acc;
        }, {});

        console.log("Aggregated Data:", aggregatedData); // Log aggregated data after processing all users

        // Convert aggregated data to an array for chart display
        const formattedData = Object.entries(aggregatedData).map(
          ([monthYear, data]) => ({
            monthYear,
            ...data,
          })
        );

        console.log("Formatted Data for Chart:", formattedData); // Log formatted data ready for the chart

        setMonthlyData(formattedData);
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
    labels: monthlyData.map((data) => data.monthYear), // Month and year labels
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
        text: "Total Attendance by Category per Month",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Render the bar chart
  return (
    <div className="attendance_overview_container">
      {loading ? <p>Loading...</p> : <Bar data={chartData} options={options} />}
    </div>
  );
};

export default NetworkAttendance;
