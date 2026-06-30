import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface"

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        },
        include: {
            author: true
        }
    });
    return result;
}


const getAllPosts = async (query: IPostQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;

    const page = query.page ? Number(query.page) : 1;

    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ? query.sortBy : "createdAt";

    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const tags = query.tags ? JSON.parse(query.tags as string) : null;

    const tagsArray = Array.isArray(tags) ? tags : []

    const andConditions: PostWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        });
    }

    if (query.title) {
        andConditions.push({
            title: query.title
        });
    }

    if (query.content) {
        andConditions.push({
            content: query.content
        });
    }

    if (query.authorId) {
        andConditions.push({
            authorId: query.authorId
        });
    }

    if (query.isFeatured) {
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        });
    }

    if (query.tags) {
        andConditions.push({
            tags: {
                hasSome: tagsArray
            }
        });
    }

    if (query.status) {
        andConditions.push({
            status: query.status as PostStatus
        });
    }





    const posts = await prisma.post.findMany({

        where: {
            AND: andConditions
        },
        take: limit,
        skip: skip,

        orderBy: {
            [sortBy]: sortOrder
        },

        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    });
    return posts;
}

const getPostById = async (postId: string) => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });

            // throw new Error("Test error");

            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            });
            return post;

        }
    )

    return transactionResult;

}

const getMyPosts = async (authorId: string) => {

    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }

    });

    return result;
}

const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post");
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload
    });

    return result;
}


const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post");
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    });

}

const getPostStats = async () => {
    const transcationResult = await prisma.$transaction(
        async (tx) => {

            const [totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalPendingComments,
                totalRejectedComments,
                totalPostViewsAggregate] = await Promise.all([
                    await tx.post.count(),
                    await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
                    await tx.post.count({ where: { status: PostStatus.DRAFT } }),
                    await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
                    await tx.comment.count(),
                    await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                    await tx.comment.count({ where: { status: CommentStatus.PENDING } }),
                    await tx.comment.count({ where: { status: CommentStatus.REJECTED } }),
                    await tx.post.aggregate({ _sum: { views: true } })
                ]);

            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalPendingComments,
                totalRejectedComments,
                totalViews: totalPostViewsAggregate._sum.views || 0
            }
        }
    )
    return transcationResult;
}





export const postService = {
    createPost,
    getAllPosts,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
};