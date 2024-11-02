import { Paper, Box, Typography } from "@mui/material";
import "./AuditAndTrailing.css";
import NewMembersChart from "./charts/newMembers/NewMembersChart";
import TotalMembersChart from "./charts/totalMembers/TotalMembersChart";
import AttendanceChart from "./charts/attendanceChart/AttendanceChart";

export default function AuditAndTrailing() {
  return (
    <div className="main_container_audit">
      <Box className="grid-container">
        <Paper className="grid-item">
          <Typography variant="h6">New Members</Typography>
          {/* NewMembersChart component */}
          <NewMembersChart />
        </Paper>
        <Paper className="grid-item">
          <Typography variant="h6">Total Members per Month</Typography>
          {/* TotalMembersChart component */}
          <TotalMembersChart />
        </Paper>
        <Paper className="grid-item">
          <Typography variant="h6">Monthly Attendance</Typography>
          {/* MonthlyAttendanceChart component */}
          <AttendanceChart />
        </Paper>
      </Box>
    </div>
  );
}
