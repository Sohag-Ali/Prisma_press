import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subcription.service";
import { send } from "node:process";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const createCheckoutSession = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
   
    const userId = req.user?.id;
    const result = await subscriptionService.createCheckoutSession(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Checkout session created successfully",
        data: result,
    });
});

export const subscriptionController = {
    createCheckoutSession
}