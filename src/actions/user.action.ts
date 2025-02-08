"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

//! 4-Function To Get Random Users from database:
export const getRecomenendedUsers = async () => {
  try {
    const userId = await getDbUser();
    if (!userId) return [];
    //! get 4 random users exclude ourselves & users that we already follow
    const reandomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: { id: userId },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 4,
    });
    return reandomUsers;
  } catch (error) {
    console.log("Error getting recommended users:", error);
    return [];
  }
};

//! 5-Function To Follow A User:
export async function toggleFollowUser(targetUserId: string) {
  try {
    const userId = await getDbUser();

    //? Check If There is no user(not authenticated):
    if (!userId) return null;

    //? check if try to follow yourself:
    if (userId === targetUserId) {
      throw new Error("You can't follow yourself");
    }

    //? get the existing FollowUser:
    const existingFollowUser = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollowUser) {
      // Un Following User
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // Following User
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user being followed
          },
        }),
      ]);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.log("Error following user:", error);
    return { success: false };
  }
}
