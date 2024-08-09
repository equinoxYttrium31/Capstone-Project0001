import React, { useState, useEffect } from 'react';
import './user_chart.css';
import { getCurrentMonth } from '../../Utility Functions/utility_setmonth';

function UserChart() {
  const [progress, setProgress] = useState(0); // Example progress value
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    setCurrentMonth(getCurrentMonth());
  }, []);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setCurrentMonth(month);

    // Update progress based on selected month (this is just an example)
    if (month === 'January') {
      setProgress(50);
    } else if (month === 'February') {
      setProgress(30);
    } else if (month === 'Select_Month') {
      setProgress(0);
    } else {
      setProgress(0); // Default progress for other months
    }
  };

  return (
    <div className='user_chart_main_cont'>
      <div className="chart_header">
        <select
          name="months"
          id="months"
          className='months_selector'
          onChange={handleMonthChange}
          value={currentMonth} // Set the current month as the selected value
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
    </div>
  );
}

export default UserChart;
