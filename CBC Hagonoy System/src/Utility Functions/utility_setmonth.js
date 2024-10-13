export const getCurrentMonth = () => {
    const monthIndex = new Date().getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };
  
export const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear(); // Ensure this function exists
};