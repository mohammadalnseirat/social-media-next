"use client";

import { useTheme } from "next-themes";
import React, { useState } from "react";
import ModeToggle from "./ModeToggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  BellIcon,
  HomeIcon,
  LogIn,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";

const MobileHeader = () => {
  const [showMobileHeader, setShowMobileHeader] = useState(false);
  const { isSignedIn } = useAuth();
  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle />
      <Sheet open={showMobileHeader} onOpenChange={setShowMobileHeader}>
        <SheetTrigger asChild>
          <Button variant="destructive" size={"icon"}>
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="w-[300px]">
          <SheetTitle>Menu</SheetTitle>
          <nav className="flex flex-col mt-6 gap-4">
            <Button
              variant={"outline"}
              className="flex items-center gap-4 justify-start"
              asChild
            >
              <Link href={"/"}>
                <HomeIcon className="size-4 text-green-600" />
                Home
              </Link>
            </Button>
            {isSignedIn ? (
              <>
                <Button
                  variant={"outline"}
                  className="flex items-center gap-4 justify-start"
                  asChild
                >
                  <Link href={"/notifications"}>
                    <BellIcon className="size-4 text-blue-600" />
                    Notifications
                  </Link>
                </Button>
                <Button
                  variant={"outline"}
                  className="flex items-center gap-4 justify-start"
                  asChild
                >
                  <Link href={"/profile"}>
                    <UserIcon className="size-4 text-cyan-600" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant={"destructive"}
                    className="flex items-center gap-4 w-full justify-start"
                  >
                    <LogOutIcon className="size-4" />
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant={"default"}
                  className="flex items-center gap-4 w-full justify-start"
                >
                  <LogIn className="size-4" />
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileHeader;
