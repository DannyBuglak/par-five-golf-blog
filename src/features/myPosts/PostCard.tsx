import { Link } from "react-router-dom";
import type { Post } from "./useMyPosts";

interface Props {
  post: Post;
  onDelete: (id: string) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function PostCard({ post, onDelete }: Props) {
  return (
    <div className="my-posts__card">
      <div className="my-posts__card-left">
        <div className="my-posts__card-title-row">
          <h2 className="my-posts__card-title">{post.title}</h2>

          <span
            className={`my-posts__badge ${
              post.is_published
                ? "my-posts__badge--published"
                : "my-posts__badge--draft"
            }`}
          >
            {post.is_published ? "Published" : "Draft"}
          </span>
        </div>

        {post.signature && (
          <p className="my-posts__card-signature">By {post.signature}</p>
        )}

        <p className="my-posts__card-date">{formatDate(post.created_at)}</p>
      </div>

      <div className="my-posts__card-actions">
        <Link
          to={`/post/${post.slug}`}
          className="my-posts__action my-posts__action--view"
        >
          View
        </Link>

        <button
          className="my-posts__action my-posts__action--delete"
          onClick={() => onDelete(post.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default PostCard;
