
import httpStatus from "http-status";
import { Request, Response } from "express";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {

    try {
        const payload = req.body;

        const user = await userService.registerUserIntoDB(payload);

        res.status(httpStatus.CREATED).json({
            message: "User registered successfully",
            success: true,
            statusCode: httpStatus.CREATED,
            data: {
                user
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Failed to register user",
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const userController = {
    registerUser,
};