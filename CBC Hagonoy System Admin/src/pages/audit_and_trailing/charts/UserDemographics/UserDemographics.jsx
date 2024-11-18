import "./UserDemographics.css";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

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
            params: { gender }, // Send the selected gender as a query parameter
          }
        );

        const data = response.data;

        // Example response: { male: 45, female: 55 }
        const labels = ["Male", "Female"];
        const dataset =
          gender === "all" ? [data.male, data.female] : [data[gender]];

        setChartData({
          labels,
          datasets: [
            {
              label: "User Demographics",
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
  }, [gender]); // Re-run effect when gender changes

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <div className="user_demographics_container">
      <h1>User Demographics</h1>
      <div>
        <label htmlFor="gender-select">Filter by Gender:</label>
        <select id="gender-select" value={gender} onChange={handleGenderChange}>
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="chart_container">
        {chartData ? <Pie data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
}
