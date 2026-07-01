
import e, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";
    let errorStack = err.stack || "Unknown error";

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provieded incorrect data, please check your request and try again.";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Duplicate field value entered.";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Foreign key constraint failed.";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            errorMessage = "Record not found.";
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed, please check your database connection and try again.";
        }
        else if (err.errorCode === "P1001") {
            statusCode = httpStatus.SERVICE_UNAVAILABLE;
            errorMessage = "Database connection failed, please check your database connection and try again.";
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "An unknown error occurred, please try again later.";
    }


    res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        message: errorMessage,
        name: errorName,
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        error: errorStack,
    });
}