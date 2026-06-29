import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { send } from "node:process";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
        message: "Post created successfully",
        success: true,
        statusCode: httpStatus.CREATED,
        data: result
    });

});

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
        message: "Posts retrieved successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: result
    });

});

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        return next(new Error("Post ID is required"));
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
        message: "Post retrieved successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: result
    });

});

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    if (!authorId) {
        return next(new Error("Author ID is required"));
    }

    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
        message: "Posts retrieved successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: result
    });

});

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const payload = req.body;

    if (!postId) {
        return next(new Error("Post ID is required"));
    }


    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin as boolean);

    sendResponse(res, {
        message: "Post updated successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: result
    });
});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!postId) {
        return next(new Error("Post ID is required"));
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin as boolean);

    sendResponse(res, {
        message: "Post deleted successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: null
    });

});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await postService.getPostStats();

    sendResponse(res, {
        message: "Post stats retrieved successfully",
        success: true,
        statusCode: httpStatus.OK,
        data: result
    });

});





export const postController = {
    createPost,
    getAllPosts,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
};

