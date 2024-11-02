import { Paper, Box, Typography } from "@mui/material";
import "./AuditAndTrailing.css";
import NewMembersChart from "./charts/newMembers/NewMembersChart";
import TotalMembersChart from "./charts/totalMembers/TotalMembersChart";
import AttendanceChart from "./charts/attendanceChart/AttendanceChart";
import PrayerRequestChart from "./charts/PrayerRequestTraffic/PrayerRequestChart";

export default function AuditAndTrailing() {
  return (
    <div className="main_container_audit">
      <Box className="grid-container">
        <Paper className="grid-item">
          <Typography className="typography" variant="h6">
            New Members
          </Typography>
          {/* NewMembersChart component */}
          <NewMembersChart />
        </Paper>
        <Paper className="grid-item">
          <Typography className="typography" variant="h6">
            Total Members
          </Typography>
          {/* TotalMembersChart component */}
          <TotalMembersChart />
        </Paper>
        <Paper className="grid-item">
          <Typography className="typography" variant="h6">
            Attendance
          </Typography>
          {/* MonthlyAttendanceChart component */}
          <AttendanceChart />
        </Paper>
        <Paper className="grid-item">
          <Typography className="typography" variant="h6">
            Prayer Request
          </Typography>
          {/* PrayerRequestCharts component */}
          <PrayerRequestChart />
        </Paper>
      </Box>
    </div>
  );
}
