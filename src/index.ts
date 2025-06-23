// import session from "cookie-session";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import passport from "passport";
import "./config/passport.config";
import { passportAuthenticateJWT } from "./config/passport.config";
// import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import authRoutes from "./routes/auth.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     name: "session",
//     keys: [config.SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000,
//     secure: config.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "lax",
//   }),
// );

app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Hello! Welcome to teamtrackr" });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, passportAuthenticateJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, passportAuthenticateJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, passportAuthenticateJWT, projectRoutes);
app.use(`${BASE_PATH}/task`, passportAuthenticateJWT, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
