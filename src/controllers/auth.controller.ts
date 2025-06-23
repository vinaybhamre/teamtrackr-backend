import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { registerUserService } from "../services/auth.service";
import { signJwtToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validation/auth.validation";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const jwt = req.jwt;
    const currentWorkspace = req.user?.currentWorkspace;

    if (!jwt) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`,
      );
    }

    // return res.redirect(
    //   `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`,
    // );

    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}&current_workspace=${currentWorkspace}`,
    );
  },
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User created successfully" });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined,
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        // req.logIn(user, (err) => {
        //   if (err) {
        //     return next(err);
        //   }

        //   return res.status(HTTPSTATUS.OK).json({
        //     message: "Logged in successfully",
        //     user,
        //   });
        // });

        const access_token = signJwtToken({ userId: user._id });

        return res.status(HTTPSTATUS.OK).json({
          message: "Logged in successfully",
          access_token,
          user,
        });
      },
    )(req, res, next);
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logOut((err) => {
      if (err) {
        console.error("Logout error: ", err);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          error: "Failed to log out",
        });
      }
    });

    req.session = null;

    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Logged out successfully" });
  },
);
