import { getPosts } from "@/actions/post.action";
import { getDbUser } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import RecomendedUsers from "@/components/RecomendedUsers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Create Post */}
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        <div className="space-y-4">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <RecomendedUsers />
      </div>
    </div>
  );
}
