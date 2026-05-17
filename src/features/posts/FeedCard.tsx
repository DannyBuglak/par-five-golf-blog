import { Link } from "react-router-dom";
import type { Post } from "./useFeedPosts";

interface Props {
  post: Post;
}

const getExcerpt = (html: string) => {
  const text = html.replace(/<[^>]*>/g, "");
  return text.length > 160 ? text.slice(0, 160) + "..." : text;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function FeedCard({ post }: Props) {
  return (
    <Link to={`/post/${post.slug}`} className="feed__card">
      <div className="feed__card-body">
        <h2 className="feed__card-title">{post.title}</h2>
        <p className="feed__card-excerpt">{getExcerpt(post.content)}</p>
      </div>
      {post.post_tags?.length > 0 && (
        <div className="feed__card-tags">
          {post.post_tags.map((pt) => (
            <span key={pt.tag_id} className="feed__card-tag">
              {pt.tags?.name}
            </span>
          ))}
        </div>
      )}
      <div className="feed__card-meta">
        <span className="feed__card-author">
          By{" "}
          {post.signature ??
            post["profiles!posts_author_id_fkey"]?.[0]?.username ??
            "unknown"}
        </span>
        <span className="feed__card-date">{formatDate(post.created_at)}</span>
      </div>
    </Link>
  );
}

export default FeedCard;
