import { NextFunction, Request, Response, Router } from "express";

import httpStatus from "http-status";

import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { Role } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role;
            };
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
        if (!token) {
            throw new Error("No token provided");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);



        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { id, name, email, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new Error("You do not have permission to access this resource");
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
                name,
                email,
                role
            }
        });
        if (!user) {
            throw new Error("User not found");
        }

        if (user.activeStatus !== "ACTIVE") {
            throw new Error("User is not active");
        }

        req.user = { id, name, email, role };
        next();
    }


    )
}