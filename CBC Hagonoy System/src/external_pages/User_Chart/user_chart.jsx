import { useState, useEffect } from 'react';
import './user_chart.css';
import { getCurrentMonth, getCurrentYear } from '../../Utility Functions/utility_setmonth';
import axios from 'axios'; // Import axios for API calls
import { toast } from 'react-hot-toast';

function UserChart() {
  const [progress, setProgress] = useState(0); // Progress value
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    setCurrentMonth(month);
    setCurrentYear(year);
    fetchProgressData(month, year); // Fetch progress data on component mount
  }, []);

  // Function to fetch progress data from the backend
  const fetchProgressData = async (month, year) => {
    try {
      const response = await axios.get(`http://localhost:8000/progress/${year}/${month}`, {
        withCredentials: true,
      });
      setProgress(response.data.tasksCompleted || 0); // Use the appropriate field from your response
    } catch (error) {
      console.error('Error fetching progress data:', error);
      toast.error('Failed to fetch progress data.');
    }
  };

  // Function to handle month change
  const handleMonthChange = (event) => {
    const month = event.target.value;
    setCurrentMonth(month);
    fetchProgressData(month, currentYear); // Fetch progress data for the selected month
  };

  return (
    <div className='user_chart_main_cont'>
      <div className="chart_header">
        <select
          name="months"
          id="months"
          className='months_selector'
          onChange={handleMonthChange}
          value={currentMonth}
        >
          <option value="Select_Month">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div className="chart_container">
        <div
          className="doughnut_chart"
          style={{
            background: `conic-gradient(
              #36a2eb ${progress * 3.6}deg, 
              #ffce56 ${progress * 3.6}deg 360deg)`
          }}
        >
          <div className="chart_center"></div>
        </div>
      </div>
      <div className="chart_percentage_cont">
        <div className="chart_label">Completed: {progress}%</div>
        <div className="chart_label">Remaining: {100 - progress}%</div>
      </div>
      <div className="legends_container">
        <h3 className="legends_title">Legends:</h3>

        <div className="individual_legend_cont">
          <div className="legend_color_div CG"></div>
          <p className="legend_color_label">Cell Group</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PD"></div>
          <p className="legend_color_label">Personal Devotion</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div FD"></div>
          <p className="legend_color_label">Family Devotion</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PM"></div>
          <p className="legend_color_label">Prayer Meeting</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div WS"></div>
          <p className="legend_color_label">Worship Service</p>
        </div>
      </div>
    </div>
  );
}

export default UserChart;
