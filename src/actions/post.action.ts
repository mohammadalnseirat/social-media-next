"use server";

import prisma from "@/lib/prisma";
import { getDbUser } from "./user.action";
import { revalidatePath } from "next/cache";

//! 1-Function To Create a Post :
export async function createNewPost(content: string, image: string) {
  try {
    const userId = await getDbUser();
    if (!userId) return;
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });
    revalidatePath("/"); //purge the cache for the home page
    return { success: true, post };
  } catch (error) {
    console.log("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

//! 2-Function To Get Posts from the database :
export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log("Error getting posts:", error);
    throw new Error("Failed to get posts");
  }
};

//! 3-Function To Toggle Likes and Unlikes For a Post :
export const toggleLikePost = async (postId: string) => {
  try {
    const userId = await getDbUser();
    if (!userId) return;
    //? check if like exists:
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    //? Find the post:
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });
    if (!post) throw new Error("Post not found");
    if (existingLike) {
      // ? Delete the like:
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //? like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, // recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error toggling like:", error);
    throw new Error("Failed to toggle like");
  }
};

//! 4-Function To Add New Comment :
export const createNewComment = async (postId: string, content: string) => {
  try {
    const userId = await getDbUser();
    if (!userId) return;
    if (!content) throw new Error("Comment cannot be empty");
    //? Find the post:
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });
    if (!post) throw new Error("Post not found");
    //! Create comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      //? create new comment
      const newComment = await prisma.comment.create({
        data: {
          content,
          postId,
          authorId: userId,
        },
      });
      //? create notification (only if commenting someone else's post)
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId, // recipient (post author)
            creatorId: userId, // person who commented
            postId,
            commentId: newComment.id,
          },
        });
      }
      return [newComment];
    });
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.log("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
};

//! 5-Function To Delete A Post :
export const deleteApost = async (postId: string) => {
  try {
    const userId = await getDbUser();
    if (!userId) return;
    //! Find the post:
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("You don't have permission to delete this post");

    //? Delete the post:
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
};
