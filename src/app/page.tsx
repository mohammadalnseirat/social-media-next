import CreatePost from "@/components/CreatePost";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Create Post */}
      <div className="lg:col-span-6">
        <CreatePost />
      </div>
      <div className="lg:col-span-4">whoToFollow</div>
    </div>
  );
}
