const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const problemRoutes = require("./routes/problems");
const { startFixMyItchSync } = require("./utils/fixMyItchSync");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/thethink";

// --------------- Security Middleware ---------------

// Helmet — sets secure HTTP headers (XSS protection, content-type sniffing, etc.)
app.use(helmet());

// CORS — restrict to allowed origins
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET"],
    optionsSuccessStatus: 200,
  })
);

// Rate limiting — prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// Body parser
app.use(express.json());

// --------------- Routes ---------------

app.use("/api/problems", problemRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "The Think API is running", status: "healthy" });
});

// --------------- Frontend (Production) ---------------

const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));

// SPA fallback — all non-API routes serve index.html for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// --------------- Database & Startup ---------------

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
      startFixMyItchSync();
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
