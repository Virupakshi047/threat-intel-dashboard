import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import threatRoutes from "./routes/threat.routes";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/threats", threatRoutes);

app.get("/", (_req, res) => res.send("🚀 Threat Intelligence API is running"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

export function broadcastNewThreat(threat: any) {
  const data = JSON.stringify({ type: "NEW_THREAT", payload: threat });
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
