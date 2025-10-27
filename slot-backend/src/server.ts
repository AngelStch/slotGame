import express, { Application } from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

export function createServer(): Application {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/",
    gameRoutes
  );

  // Error handling
  app.use(errorMiddleware);

  return app;
}
