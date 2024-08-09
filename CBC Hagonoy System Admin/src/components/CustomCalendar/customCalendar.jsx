// src/components/CustomCalendar.jsx

import React, { useState } from 'react';
import './customCalendar.css'; // Import your styles

const CustomCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(0, i);
        return { value: i, label: date.toLocaleString('default', { month: 'long' }) };
    });

    const years = Array.from({ length: 11 }, (_, i) => {
        const year = currentDate.getFullYear() - 5 + i;
        return { value: year, label: year };
    });

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value, 10);
        setCurrentDate(new Date(currentDate.setMonth(newMonth)));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setCurrentDate(new Date(currentDate.setFullYear(newYear)));
    };

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <select onChange={handleMonthChange} value={currentDate.getMonth()}>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                <select onChange={handleYearChange} value={currentDate.getFullYear()}>
                    {years.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="calendar-body">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}
                {days.map((day) => (
                    <div
                        key={day}
                        className={`calendar-day ${selectedDate.getDate() === day ? 'selected' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomCalendar;
