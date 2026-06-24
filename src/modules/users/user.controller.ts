
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        message: "User registered successfully",
        success: true,
        statusCode: httpStatus.CREATED,
        data: {
            user
        }
    });
}
);

export const userController = {
    registerUser,
};