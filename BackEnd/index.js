const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http"); // Import the http module for creating the server
const socketIo = require("socket.io"); // Import socket.io

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
}); // Initialize Socket.io with the server

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
    allowedHeaders: [
      "Content-Type",
      "Access-Control-Allow-Headers",
      "Authorization",
    ],
    credentials: true, // Allow cookies to be sent and received
  })
);

// Define your routes
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // You can listen for custom events here, for example, fetching user data
  socket.on("fetchData", async () => {
    try {
      // Assuming you have a function to fetch data from the database
      const data = await fetchYourDataFromDB(); // Replace this with your actual fetching logic
      socket.emit("updateData", data); // Send the data back to the client
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server listening on port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
