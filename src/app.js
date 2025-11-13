import express from "express";
import dotenv from "dotenv";

import recognitionRoutes from "./routes/recognitionRoutes.js";
import endorsementRoutes from "./routes/endorsementRoutes.js";
import redemptionRoutes from "./routes/redemptionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
dotenv.config();
const app = express();
app.use(express.json()); 
app.use("/api/recognition", recognitionRoutes);
app.use("/api/endorsement", endorsementRoutes);
app.use("/api/redemption", redemptionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Boostly API is running successfully!");
});

export default app;
