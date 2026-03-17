import express, { Application, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import booksRouter from "./routes/books";
import logger from "./utils/logger";

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many requests, please try again later" },
});

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/books", limiter, booksRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ error: "Internal server error" });
});
export default app;
