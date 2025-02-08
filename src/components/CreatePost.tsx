"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Image, Loader2Icon, SendIcon } from "lucide-react";
import { createNewPost } from "@/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  //! Function To Submit The Post To The Database:
  const handleSubmitPost = async () => {
    if (!content.trim() && !imageUrl) {
      toast.error("Please add content or an image");
      return;
    }
    setIsPostLoading(true);
    try {
      const result = await createNewPost(content, imageUrl);
      if (result?.success) {
        //? reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post Created Successfully");
      }
    } catch (error) {
      console.log("Error creating post:", error);
      toast.error("Error creating post");
    } finally {
      setIsPostLoading(false);
    }
  };
  return (
    <Card className="mb-6 border border-gray-300">
      <CardContent className="pt-5 ">
        <div className="space-y-4">
          {/* Teaxt Area and Avatar Start Here */}
          <div className="flex space-x-2">
            <Avatar className="size-10">
              <AvatarImage src={user?.imageUrl || "/avatar_user.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="resize-none min-h-[100px]  focus-visible:ring-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPostLoading}
            />
          </div>
          <div className="flex justify-between items-center border-t pt-4">
            <div className="space-x-2">
              <Button
                type="button"
                size={"sm"}
                disabled={isPostLoading}
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="text-gray-50 bg-red-500 hover:bg-red-600 hover:ring-2 hover:ring-red-400 transition-all duration-200 "
              >
                <Image className="size-4 mr-1" />
                photo
              </Button>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleSubmitPost}
              disabled={isPostLoading || !content.trim()}
            >
              {isPostLoading ? (
                <>
                  Posting...
                  <Loader2Icon className="animate-spin size-4" />
                </>
              ) : (
                <>
                  <SendIcon className="size-4" />
                  Post
                </>
              )}
            </Button>
          </div>
          {/* Teaxt Area and Avatar End Here */}
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
