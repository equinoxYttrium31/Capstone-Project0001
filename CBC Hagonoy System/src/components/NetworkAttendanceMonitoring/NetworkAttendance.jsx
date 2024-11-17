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
import axios from "axios";
import { useEffect, useState } from "react";
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
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to generate all months between two dates
  const generateMonthLabels = (data) => {
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

    const firstYear = Math.min(...data.map((d) => d._id.year));
    const lastYear = Math.max(...data.map((d) => d._id.year));

    const labels = [];
    for (let year = firstYear; year <= lastYear; year++) {
      for (let month = 0; month < 12; month++) {
        labels.push(`${months[month]} ${year}`);
      }
    }

    return labels;
  };

  // Helper to match data with month labels
  const mapDataToLabels = (labels, data, category) => {
    return labels.map((label) => {
      const [month, year] = label.split(" ");
      const found = data.find(
        (item) =>
          item._id.month === month && parseInt(item._id.year) === parseInt(year)
      );
      return found ? found[category] : 0;
    });
  };

  useEffect(() => {
    if (!networkLeader) {
      console.warn("No networkLeader provided, skipping fetch.");
      setLoading(false);
      return;
    }

    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/attendance-report/${encodeURIComponent(
            networkLeader
          )}`
        );
        const data = response.data;

        if (!data || data.length === 0) {
          console.warn("No attendance data available.");
          setLoading(false);
          return;
        }

        // Generate full list of labels (all months between first and last entry)
        const labels = generateMonthLabels(data);

        // Map data for each category
        const cellGroup = mapDataToLabels(labels, data, "cellGroup");
        const personalDevotion = mapDataToLabels(
          labels,
          data,
          "personalDevotion"
        );
        const familyDevotion = mapDataToLabels(labels, data, "familyDevotion");
        const prayerMeeting = mapDataToLabels(labels, data, "prayerMeeting");
        const worshipService = mapDataToLabels(labels, data, "worshipService");

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

        console.log("Fetched and mapped data:", { labels, data });
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [networkLeader]);

  return (
    <div className="network_progress_cont">
      <h2>Monthly Attendance Report</h2>
      <div className="chart-container">
        {loading ? (
          <div className="loader_container">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : chartData ? (
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
          <p>No data available for the selected network leader.</p>
        )}
      </div>
    </div>
  );
};

export default NetworkAttendance;
