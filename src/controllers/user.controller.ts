import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getCurrentUserService } from "../services/user.service";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      messsage: "User fetched successfully",
      user,
    });
  },
);
