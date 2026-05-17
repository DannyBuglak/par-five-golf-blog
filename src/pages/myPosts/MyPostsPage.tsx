import "./MyPostsPage.css";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import ConfirmModal from "../../components/ui/ConfirmModal";

import PostCard from "../../features/myPosts/PostCard";
import { useMyPosts } from "../../features/myPosts/useMyPosts";

function MyPostsPage() {
  const { user } = useAuth();

  const { posts, loading, deletePost } = useMyPosts(user?.id);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    await deletePost(deleteId);
    setDeleteId(null);
  };

  return (
    <main className="my-posts">
      <div className="my-posts__container">
        <div className="my-posts__header">
          <div>
            <h1>My Posts</h1>
            <p>Manage your published posts and drafts</p>
          </div>

          <Link to="/write" className="my-posts__new">
            New Post →
          </Link>
        </div>

        {loading && <p className="my-posts__loading">Loading your posts...</p>}

        {!loading && posts.length === 0 && (
          <div className="my-posts__empty">
            <p>You haven't written anything yet.</p>

            <Link to="/write" className="my-posts__empty-btn">
              Start Writing →
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="my-posts__list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={setDeleteId} />
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this post? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </main>
  );
}

export default MyPostsPage;
