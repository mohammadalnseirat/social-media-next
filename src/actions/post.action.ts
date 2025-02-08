"use server";

import prisma from "@/lib/prisma";
import { getDbUser } from "./user.action";
import { revalidatePath } from "next/cache";

//! 1-Function To Create a Post :
export async function createNewPost(content: string, image: string) {
  try {
    const userId = await getDbUser();
    if (!userId) return null;
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
