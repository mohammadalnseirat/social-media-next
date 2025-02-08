"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    //*1-Get The User Id and the current User from clerk:
    const { userId } = await auth();
    const user = await currentUser();
    //*2-Check if the user exists in your database:
    if (!userId || !user) {
      console.error("User not found in Clerk or server");
      return;
    }
    //*3-Check if the user already exists in your database:
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) {
      return existingUser;
    }
    //*4-Create a new User:
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    //*5-Return the User:
    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error);
  }
}

//! 2-Function To Get User Details from the database:
export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

//! 3-Function To Get User Id based On The Clerk Id From The Database:
export async function getDbUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.id;
}
