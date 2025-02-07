import { currentUser } from "@clerk/nextjs/server";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon, HomeIcon, LogInIcon, UserIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

async function DeskTopHeader() {
  const user = await currentUser();
  console.log(user);
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />
      <Button variant={"outline"} asChild className="flex items-center gap-2">
        <Link href={"/"}>
          <HomeIcon className="size-4 text-green-600" />
          <span className="hidden lg:block">Home</span>
        </Link>
      </Button>
      {user ? (
        <>
          <Button
            variant={"outline"}
            asChild
            className="flex items-center gap-2"
          >
            <Link href={"/notifications"}>
              <BellIcon className="size-4 text-blue-600" />
              <span className="hidden lg:block">Notifications</span>
            </Link>
          </Button>
          <Button
            variant={"outline"}
            className="flex items-center gap-2"
            asChild
          >
            <Link
              href={`/profile/${
                user?.username ??
                user?.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="size-4 text-cyan-600" />
              <span className="hidden lg:block">Profile</span>
            </Link>
          </Button>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant={"outline"} className="flex items-center gap-2">
            <LogInIcon className="size-4 text-red-600" />
            <span className="hidden lg:block">Sign In</span>
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DeskTopHeader;
