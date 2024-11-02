import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./PrayerRequestChart.css";

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

const PrayerRequestChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchWeeklyPrayerRequests = async () => {
      try {
        const response = await axios.get(
          "https://capstone-project0001-2.onrender.com/weekly-prayer-requests"
        );
        console.log("API Response:", response.data); // Log the response

        if (Array.isArray(response.data) && response.data.length > 0) {
          const labels = response.data.map(
            (item) => `${getMonthName(item.month)} - ${item.year}`
          );
          const data = response.data.map((item) => item.totalRequests);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Total Prayer Requests",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("Expected an array with data but got:", response.data);
          setError("No data available for the chart."); // Set error message
        }
      } catch (error) {
        console.error("Error fetching prayer request data", error);
        setError("Error fetching prayer request data."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchWeeklyPrayerRequests();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div>
      <h2 className="header_prayerRequest">Monthly Prayer Requests Report</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default PrayerRequestChart;
