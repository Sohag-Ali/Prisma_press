import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getAllComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getCommentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const likeComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const commentController = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment,
    likeComment
};
