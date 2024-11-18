import "./UserDemographics.css";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDemographics() {
  const [gender, setGender] = useState("all"); // State for selected gender
  const [chartData, setChartData] = useState(null);

  // Fetch data based on selected gender
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project0001-2.onrender.com/users-by-gender`, // Replace with your actual API endpoint
          {
            params: { gender },
          }
        );

        const data = response.data;

        const labels = ["Male", "Female"];
        const dataset =
          gender === "all" ? [data.male, data.female] : [data[gender]];

        setChartData({
          labels,
          datasets: [
            {
              label: "User Gender",
              data: dataset,
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching user demographics", error);
      }
    };

    fetchData();
  }, [gender]);

  return (
    <div className="user_demographics_container">
      <div className="chart_container">
        {chartData ? <Pie data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
}
