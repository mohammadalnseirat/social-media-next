"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

async function syncUser() {
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

export default syncUser;
