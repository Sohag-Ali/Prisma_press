
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import Jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


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

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        message: "My profile retrieved successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: {
            profile
        }
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userService.updateMyProfileInDB(userId, payload);

    sendResponse(res, {
        message: "My profile updated successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: {
            updatedProfile
        }
    });

});

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
};