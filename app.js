import express from "express";
import cors from "cors";
import { FRONTEND_URL } from "./config/env.js";

/* Routes */
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

/* Middleware */
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

/* Core middleware */
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
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

/* Error handling (must be last) */
app.use(notFound);
app.use(errorHandler);

export default app;