import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUserByClerkId } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnauthenticatedUserSidebar />;

  //! call a function to get the user:
  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;
  return (
    <div className="sticky top-20">
      <Card className="border border-cyan-700">
        <CardContent className="pt-10">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="size-20 border-2 border-cyan-600">
                <AvatarImage src={user.image || "/avatar_user.png"} />
              </Avatar>
              <div className="mt-5 space-y-1">
                <h1 className="text-xl font-semibold font-mono">{user.name}</h1>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>

            {user.bio && (
              <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>
            )}
            <div className="w-full">
              <Separator className="my-5" />
              <div className="flex justify-between">
                <div>
                  <p
                    className={`font-semibold ${
                      user._count.following > 0
                        ? "text-cyan-600"
                        : "text-red-600"
                    }`}
                  >
                    {user._count.following}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    Following
                  </p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p
                    className={`font-semibold ${
                      user._count.followers > 0
                        ? "text-cyan-600"
                        : "text-red-600"
                    }`}
                  >
                    {user._count.followers}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    Followers
                  </p>
                </div>
              </div>
              <Separator className="my-5" />
            </div>
            <div className="space-y-2 text-sm w-full">
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPinIcon
                  className={`size-4 ${
                    user.location ? "text-green-600" : "text-red-600"
                  }`}
                />
                <p>{user.location || "Not Location Available"}</p>
              </div>
              <div className="flex items-center text-muted-foreground gap-2">
                <LinkIcon
                  className={`size-4 ${
                    user.website ? "text-green-600" : "text-red-600"
                  }`}
                />
                {user.website ? (
                  <a
                    href={`${user.website}`}
                    target="_blank"
                    className="hover:underline truncate transition-all duration-300"
                  >
                    {user.website}
                  </a>
                ) : (
                  <p>Not Website Available</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnauthenticatedUserSidebar = () => {
  return (
    <div className="sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-center font-mono text-2xl text-cyan-500">
            Welcom to Socially!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Log in to access your profile and content with others.
          </p>
          <SignInButton mode="modal">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:ring-2 hover:ring-blue-500 transition-all duration-300">
              Log In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-full mt-2 bg-gray-50 hover:bg-gray-100 hover:ring-2 hover:ring-gray-400 transition-all duration-300 ">
              Sign Up
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
};
