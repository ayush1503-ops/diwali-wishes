import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { getSupabase, isSupabaseConfigured } from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import wishRoutes from "./routes/wishRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Verify Supabase connection (non-fatal)
try {
  getSupabase()
    .from("profiles")
    .select("count", { head: true })
    .then(() => console.log("Supabase connected successfully"))
    .catch((err) =>
      console.warn(
        "Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
      )
    );
} catch (err) {
  console.warn(
    "Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
  );
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api/", limiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "diwaliwish-api",
    database: "supabase",
    supabaseConfigured: isSupabaseConfigured(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/wishes", wishRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Export app for Vercel serverless (Express framework)
export default app;

// Only listen on a port when running standalone (not on Vercel)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`DiwaliWish server running on http://localhost:${PORT}`);
  });
}
