import express from "express";
import cors from "cors";
import { FRONTEND_URL } from "./config/env.js";

/* Routes */
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import votingRoutes from "./routes/votingRoutes.js"; // ✅ NEW

/* Middleware */
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

/* ------------------------------------------------------------------ */
/* CORS — allow Vercel production + localhost dev in one config        */
/* ------------------------------------------------------------------ */
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* Core middleware */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* Health check */
app.get("/", (req, res) => {
  res.json({ message: "NACO Voting API is running 🚀" });
});

/* API routes */
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/voting", votingRoutes); // ✅ NEW

/* Error handling (must be last) */
app.use(notFound);
app.use(errorHandler);

export default app;