"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollowUser } from "@/actions/user.action";

function FollowButton({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);

  //! Function To Follow A User:
  const handleFollowUser = async () => {
    setIsFollowing(true);
    try {
      await toggleFollowUser(userId);
      toast.success("User followed successfully");
    } catch (error) {
      toast.error("Error following user");
    } finally {
      setIsFollowing(false);
    }
  };
  return (
    <>
      <Button
        disabled={isFollowing}
        size={"sm"}
        onClick={handleFollowUser}
        variant={isFollowing ? "destructive" : "default"}
      >
        {isFollowing ? (
          <>
            Following...
            <Loader2Icon className=" size-4 animate-spin" />
          </>
        ) : (
          "Follow"
        )}
      </Button>
    </>
  );
}

export default FollowButton;
