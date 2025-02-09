"use client";

import {
  createNewComment,
  deleteApost,
  getPosts,
  toggleLikePost,
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import {
  DeleteIcon,
  HeartIcon,
  Loader2,
  Loader2Icon,
  LogInIcon,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";
import DeleteAlertModal from "./DeleteAlertModal";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type POSTs = Awaited<ReturnType<typeof getPosts>>;
type POST = POSTs[number];

function PostCard({ post, dbUserId }: { post: POST; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [hasedLike, setHasedLike] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLike, setOptimisticLike] = useState(post._count.likes);

  //! Function To handleLike:
  const handleLikeApost = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const isCurrentLike = hasedLike;
      setHasedLike((prev) => !prev);
      setOptimisticLike((prev) => prev + (isCurrentLike ? -1 : 1));
      await toggleLikePost(post.id);
      if (isCurrentLike) {
        toast.success("Post Unliked Successfully");
      } else {
        toast.success("Post Liked Successfully");
      }
    } catch (error) {
      setHasedLike(post.likes.some((like) => like.userId === dbUserId));
      setOptimisticLike(post._count.likes);
    } finally {
      setIsLiking(false);
    }
  };

  //! Function To handleComment:
  const handleAddComment = async () => {
    if (isCommenting || !newComment.trim()) return;
    try {
      setIsCommenting(true);
      const result = await createNewComment(post.id, newComment);
      if (result?.success) {
        setNewComment("");
        toast.success("Comment added successfully");
      }
    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error("Error adding comment");
    } finally {
      setIsCommenting(false);
      setNewComment("");
    }
  };

  //! Function To handleDelete:
  const handleDeleteApost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deleteApost(post.id);
      if (result?.success) toast.success("Post deleted successfully");
    } catch (error) {
      console.log("Error deleting post:", error);
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Header Part and Text Content start here */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="sixe-8 md:size-10">
                <AvatarImage src={post.author.image ?? "/avatar_user.png"} />
              </Avatar>
            </Link>
            <div className=" flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col  sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span className="text-red-600">•</span>
                    <span className="italic">
                      {formatDistanceToNow(new Date(post.createdAt))}
                    </span>
                  </div>
                </div>
                {/*Check if the user is the owner of the post start here */}
                {dbUserId === post.author.id && (
                  <DeleteAlertModal
                    isDeleting={isDeleting}
                    onDelete={handleDeleteApost}
                  />
                )}
                {/* Check if the user is the owner of the post end here */}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
          {/* Header Part and Text Conent end here */}
          {/* Image Part start here */}
          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt="Post Image Content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          {/* Image Part end here */}
          {/* Like and Comment Part start here */}
          <div className="flex items-center mt-2 gap-2">
            {user ? (
              <>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className={`
                  text-muted-foreground gap-2
                  ${
                    hasedLike
                      ? "text-red-500 hover:text-red-600"
                      : "hover:text-red-500"
                  }`}
                  onClick={handleLikeApost}
                  disabled={isLiking}
                >
                  {hasedLike ? (
                    <HeartIcon className="size-5 fill-current" />
                  ) : (
                    <HeartIcon className="size-5" />
                  )}
                  <span>{optimisticLike}</span>
                </Button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="gap-2 text-muted-foreground"
                  >
                    <HeartIcon className="size-5" />
                    <span>{optimisticLike}</span>
                  </Button>
                </SignInButton>
              </>
            )}
            <Button
              variant={"ghost"}
              size={"sm"}
              className="gap-2 text-muted-foreground"
              onClick={() => setShowComment((prev) => !prev)}
            >
              <MessageCircleIcon
                className={`size-5 ${
                  showComment ? "fill-blue-500 text-blue-500" : ""
                }`}
              />
              <span>{post.comments.length}</span>
            </Button>
          </div>

          {/* Comment Section start here */}
          {showComment && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage
                        src={comment.author.image ?? "/avatar_user.png"}
                      />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-white">
                          {comment.author.name}
                        </span>
                        <span>@{comment.author.username}</span>
                        <span className="text-red-600 text-lg">·</span>
                        <span className="italic">
                          {formatDistanceToNow(new Date(comment.createdAt))}
                        </span>
                      </div>
                      <p className="mt-1 text-sm break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {user ? (
                <>
                  <div className="flex gap-4">
                    <Avatar className="size-10 flex-shrink-0">
                      <AvatarImage src={user?.imageUrl || "/avatar_user.png"} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="resize-none min-h-[80px]"
                        disabled={isCommenting}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size={"sm"}
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isCommenting}
                        >
                          {isCommenting ? (
                            <div className="flex items-center gap-2">
                              Commenting...
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              Comment
                              <SendIcon className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                  <SignInButton mode="modal">
                    <Button
                      variant={"outline"}
                      className="flex items-center gap-2"
                    >
                      <LogInIcon className="size-4 animate-pulse" />
                      Sign in to comment
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          )}
          {/* Comment Section end here */}
          {/* Like and Comment Part end here */}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
