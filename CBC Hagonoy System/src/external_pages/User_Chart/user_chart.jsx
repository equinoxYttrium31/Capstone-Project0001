import { useState, useEffect } from 'react';
import './user_chart.css';
import { getCurrentMonth, getCurrentYear } from '../../Utility Functions/utility_setmonth';
import axios from 'axios';
import PropTypes from 'prop-types';


function UserChart({ userId, refresh}) {
  //PropType Validation
  UserChart.propTypes = {
    userId: PropTypes.string.isRequired, // Assuming userId is a string and is required
    refresh: PropTypes.bool.isRequired,   // Assuming refresh is a boolean and is required
  };

  console.log('Received userId:', userId);
  const [attendanceProgress, setAttendanceProgress] = useState({
    cellGroup: 0,
    personalDevotion: 0,
    familyDevotion: 0,
    prayerMeeting: 0,
    worshipService: 0,
  });
  const [totalWeeks, setTotalWeeks] = useState(4); // Assuming 4 weeks for the month
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    setCurrentMonth(month);
    setCurrentYear(year);
    fetchAttendanceData(userId, month, year);
  }, [userId]);

  const fetchAttendanceData = async (userId, month, year) => {
    try {
      if (!userId) {
        throw new Error('User ID is not available.');
      }

      const yearInt = parseInt(year, 10);
      const response = await axios.get(`http://localhost:8000/attendance-month/${userId}/${month}/${yearInt}`, {
        withCredentials: true,
      });

      const attendance = response.data;

      // Initialize totals
      let totalCellGroup = 0;
      let totalPersonalDevotion = 0;
      let totalFamilyDevotion = 0;
      let totalPrayerMeeting = 0;
      let totalWorshipService = 0;

      // Calculate totals
      attendance.weeklyAttendance.forEach(week => {
        totalCellGroup += week.cellGroup ? 1 : 0;
        totalPersonalDevotion += week.personalDevotion ? 1 : 0;
        totalFamilyDevotion += week.familyDevotion ? 1 : 0;
        totalPrayerMeeting += week.prayerMeeting ? 1 : 0;
        totalWorshipService += week.worshipService ? 1 : 0;
      });

      // Set attendance progress state
      setAttendanceProgress({
        cellGroup: totalCellGroup,
        personalDevotion: totalPersonalDevotion,
        familyDevotion: totalFamilyDevotion,
        prayerMeeting: totalPrayerMeeting,
        worshipService: totalWorshipService,
      });

      setTotalWeeks(4); // Set total weeks for the month
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      
      // Reset attendance progress if there's an error
      setAttendanceProgress({
        cellGroup: 0,
        personalDevotion: 0,
        familyDevotion: 0,
        prayerMeeting: 0,
        worshipService: 0,
      });
    }
  };

  const handleRefresh = () => {
    fetchAttendanceData(userId, currentMonth, currentYear); // Fetch current data again
  };

  useEffect(() => {
    if (refresh) {
      handleRefresh();
    }
  }, [refresh]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setCurrentMonth(month);
    fetchAttendanceData(userId, month, currentYear); // Fetch progress data for the selected month
  };

  const isFutureMonth = (month) => {
    const monthIndex = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(month);
    const currentMonthIndex = new Date().getMonth();
    return monthIndex > currentMonthIndex;
  };

  // Calculate total attendance
  const totalAttendance = attendanceProgress.cellGroup + 
    attendanceProgress.personalDevotion + 
    attendanceProgress.familyDevotion + 
    attendanceProgress.prayerMeeting + 
    attendanceProgress.worshipService;

  // Calculate the number of weeks (total attendances)
  const totalAttendancesExpected = totalWeeks * 5;

  // Calculate percentage for each category
  const calculatePercentage = (attendedWeeks) => {
    return attendedWeeks > 0 ? ((attendedWeeks / totalAttendancesExpected) * 100).toFixed(2) : 0;
  };

  // Colors for the donut chart
  const colors = {
    cellGroup: '#36a2eb', // Blue
    personalDevotion: '#ff6384', // Red
    familyDevotion: '#ffce56', // Yellow
    prayerMeeting: '#4bc0c0', // Teal
    worshipService: '#9966ff', // Purple
    missing: '#d3d3d3', // Light Gray for missing attendance
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
            {['January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                <option 
                  key={month} 
                  value={month} 
                  disabled={isFutureMonth(month)} // Disable future months
                >
                  {month}
                </option>
            ))}
          </select>
      </div>

      <div className="chart_container">
        <div className="doughnut_chart" style={{
            background: `conic-gradient(
              ${colors.cellGroup} 0deg ${calculatePercentage(attendanceProgress.cellGroup) * 3.6}deg,
              ${colors.personalDevotion} ${calculatePercentage(attendanceProgress.cellGroup) * 3.6}deg ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion) * 3.6}deg,
              ${colors.familyDevotion} ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion) * 3.6}deg ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion) * 3.6}deg,
              ${colors.prayerMeeting} ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion) * 3.6}deg ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion + attendanceProgress.prayerMeeting) * 3.6}deg,
              ${colors.worshipService} ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion + attendanceProgress.prayerMeeting) * 3.6}deg ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion + attendanceProgress.prayerMeeting + attendanceProgress.worshipService) * 3.6}deg,
              ${colors.missing} ${calculatePercentage(attendanceProgress.cellGroup + attendanceProgress.personalDevotion + attendanceProgress.familyDevotion + attendanceProgress.prayerMeeting + attendanceProgress.worshipService) * 3.6}deg ${360}deg
            )`
          }}>
          <div className="chart_center"></div>
        </div>
      </div>

      <div className="chart_percentage_cont">
        <div className="chart_label">Total Attendance: {((totalAttendance / (totalWeeks * 5)) * 100).toFixed(2)}%</div>
      </div>

      <div className="legends_container">
        <h3 className="legends_title">Legends:</h3>

        {/* Render progress for each activity */}
        <div className="individual_legend_cont">
          <div className="legend_color_div CG"></div>
          <p className="legend_color_label">Cell Group: {calculatePercentage(attendanceProgress.cellGroup)}%</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PD"></div>
          <p className="legend_color_label">Personal Devotion: {calculatePercentage(attendanceProgress.personalDevotion)}%</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div FD"></div>
          <p className="legend_color_label">Family Devotion: {calculatePercentage(attendanceProgress.familyDevotion)}%</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div PM"></div>
          <p className="legend_color_label">Prayer Meeting: {calculatePercentage(attendanceProgress.prayerMeeting)}%</p>
        </div>
        <div className="individual_legend_cont">
          <div className="legend_color_div WS"></div>
          <p className="legend_color_label">Worship Service: {calculatePercentage(attendanceProgress.worshipService)}%</p>
        </div>
      </div>
    </div>
  );
}

export default UserChart;
