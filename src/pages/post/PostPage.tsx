import "./PostPage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";
import Reactions from "../../features/posts/Reactions";
import Comments from "../../features/posts/Comments";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  signature: string | null;
  author_id: string;
  "profiles!posts_author_id_fkey": { username: string }[];
  post_tags: { tag_id: string; tags: { name: string } }[];
}

function PostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, title, content, created_at, signature, author_id, profiles!posts_author_id_fkey(username), post_tags(tag_id, tags(name))",
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as unknown as Post);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  if (loading)
    return (
      <main className="post">
        <div className="post__container">
          <p className="post__loading">Loading...</p>
        </div>
      </main>
    );

  if (notFound)
    return (
      <main className="post">
        <div className="post__container">
          <p className="post__not-found">Post not found.</p>
          <Link to="/feed" className="post__back">
            ← Back to Feed
          </Link>
        </div>
      </main>
    );

  if (!post) return null;

  const isOwner = user?.id === post.author_id;

  return (
    <main className="post">
      <div className="post__container">
        <Link to="/feed" className="post__back">
          ← Back to Feed
        </Link>

        <div className="post__header">
          <h1 className="post__title">{post.title}</h1>

          <div className="post__meta">
            <div className="post__meta-left">
              <span className="post__author">
                By{" "}
                {post.signature ??
                  post["profiles!posts_author_id_fkey"]?.[0]?.username ??
                  "unknown"}
              </span>
              <span className="post__date">{formatDate(post.created_at)}</span>
            </div>
            {isOwner && (
              <button
                className="post__edit-btn"
                onClick={() => navigate(`/edit/${slug}`)}
              >
                Edit Post
              </button>
            )}
          </div>

          {(post.post_tags?.length ?? 0) > 0 && (
            <div className="post__tags">
              {post.post_tags.map((pt) => (
                <span key={pt.tag_id} className="post__tag">
                  {pt.tags?.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Reactions postId={post.id} />
        <Comments postId={post.id} />
      </div>
    </main>
  );
}

export default PostPage;
