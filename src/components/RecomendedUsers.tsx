import { getRecomenendedUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

async function RecomendedUsers() {
  const users = await getRecomenendedUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-cyan-600">
          Who To Follow:
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 && (
            <p className="font-semibold text-red-600">
              No Recomended Users Found!
            </p>
          )}
          {users.length > 0 &&
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${user.username}`}>
                    <Avatar>
                      <AvatarImage src={user.image ?? "/avatar_user.png"} />
                    </Avatar>
                  </Link>
                  <div className="text-xs">
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium cursor-pointer"
                    >
                      {user.name}
                    </Link>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <span
                        className={`${
                          user._count.followers > 0
                            ? "text-cyan-600"
                            : "text-red-600"
                        }`}
                      >
                        {user._count.followers}
                      </span>
                      Followers
                    </p>
                  </div>
                </div>
                <FollowButton userId={user.id} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecomendedUsers;
