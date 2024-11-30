const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http"); // Import the http module for creating the server
const socketIo = require("socket.io"); // Import socket.io
const ChurchUser = require("./models/ChurchUser");

require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.Mongo_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Failed to Connect!", err));

const app = express();

// Create a server with http and integrate Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "https://client-2oru.onrender.com",
      "https://cbc-hagonoy-admin.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ], // List your frontend origins here
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies to be sent/received
  },
});
// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: [
      "https://client-2oru.onrender.com",
      "https://cbc-hagonoy-admin.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle custom events, e.g., fetch records
  socket.on("fetchRecords", async () => {
    try {
      const records = await ChurchUser.find(); // Fetch records from the database
      socket.emit("updateRecords", records); // Send the records back to the client
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  });

  // Clean up when the user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server listening on port 8001
const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
