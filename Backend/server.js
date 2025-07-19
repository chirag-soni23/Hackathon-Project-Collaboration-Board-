import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDb } from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/stickyRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);

// Socket.IO
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("new-user", (user) => {
    activeUsers.set(socket.id, user);
    io.emit("active-users", Array.from(activeUsers.values()));
  });

  socket.on("createNote", (note) => {
    socket.broadcast.emit("noteCreated", note);
  });

  socket.on("updateNote", (note) => {
    socket.broadcast.emit("noteUpdated", note);
  });

  socket.on("deleteNote", (id) => {
    socket.broadcast.emit("noteDeleted", id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    activeUsers.delete(socket.id);
    io.emit("active-users", Array.from(activeUsers.values()));
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDb();
});
