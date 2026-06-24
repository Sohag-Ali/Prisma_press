import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";


export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
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
};