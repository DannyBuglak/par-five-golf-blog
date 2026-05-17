import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useComments } from "./useComments";
import "./Comments.css";

interface Props {
  postId: string;
}

function Comments({ postId }: Props) {
  const { user } = useAuth();
  const { comments, loading, submitting, addComment, deleteComment } =
    useComments(postId);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addComment(content);
    setContent("");
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="comments">
      <h3 className="comments__title">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {user ? (
        <div className="comments__form">
          <textarea
            className="comments__input"
            placeholder="Leave a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <button
            className="comments__submit"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Posting..." : "Post Comment →"}
          </button>
        </div>
      ) : (
        <p className="comments__guest">
          <Link to="/login">Sign in</Link> to leave a comment.
        </p>
      )}

      {loading && <p className="comments__loading">Loading comments...</p>}

      {!loading && comments.length === 0 && (
        <p className="comments__empty">No comments yet. Be the first!</p>
      )}

      <div className="comments__list">
        {comments.map((comment) => (
          <div key={comment.id} className="comments__item">
            <div className="comments__item-header">
              <span className="comments__author">
                {comment.profiles?.username ?? "unknown"}
              </span>
              <span className="comments__date">
                {formatDate(comment.created_at)}
              </span>
              {user?.id === comment.author_id && (
                <button
                  className="comments__delete"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p className="comments__content">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
