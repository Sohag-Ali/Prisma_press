import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { postRouter } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comments/comment.route";

import { notFound } from "./middleware/notFounds";

import { globalErrorHandler } from "./middleware/globalErrorHandeler";
import { subscriptionRouter } from "./modules/Subcription/subcription.route";



const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {

    res.send("Hello, World!");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRouter);

app.use(notFound);

app.use(globalErrorHandler);


export default app;