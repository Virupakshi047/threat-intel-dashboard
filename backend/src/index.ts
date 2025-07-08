import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import threatRoutes from "./routes/threat.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/threats", threatRoutes);

app.get("/", (_req, res) => res.send("🚀 Threat Intelligence API is running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
