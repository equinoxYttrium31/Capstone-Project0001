export const getCurrentWeekNumber = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentDay = currentDate.getDate();
  
    const dayOfWeek = startOfMonth.getDay();
    const weekNumber = Math.ceil((currentDay + dayOfWeek) / 7);
  
    return weekNumber;
  };
  