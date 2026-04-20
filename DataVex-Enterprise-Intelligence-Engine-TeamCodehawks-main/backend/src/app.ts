import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.set("trust proxy", 1);

const devOrigins = new Set(["http://localhost:3000", "http://localhost:3001"]);
const allowedOrigins = new Set([env.CORS_ORIGIN, ...(env.NODE_ENV === "development" ? devOrigins : [])]);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "x-webhook-secret"],
    credentials: false
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use((req, res, next) => {
  if (env.NODE_ENV === "production") {
    const proto = req.header("x-forwarded-proto");
    if (proto && proto !== "https") {
      res.status(400).json({ message: "HTTPS is required in production" });
      return;
    }
  }
  next();
});

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
