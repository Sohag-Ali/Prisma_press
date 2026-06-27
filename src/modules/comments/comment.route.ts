import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.post("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR),commentController.createComment);

router.get("/author/:authorId", commentController.getAllComments);

router.get("/:commentId", commentController.getCommentById);

router.patch("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR),commentController.updateComment);

router.delete("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR),commentController.deleteComment);

router.patch("/:commentId/moderate", auth(Role.ADMIN),commentController.likeComment);

export const commentRouter = router;