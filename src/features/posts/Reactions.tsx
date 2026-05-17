import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useReactions } from "./useReactions";
import "./Reactions.css";

interface Props {
  postId: string;
}

function Reactions({ postId }: Props) {
  const { user } = useAuth();
  const { likeCount, hasLiked, toggleLike } = useReactions(postId);

  return (
    <div className="reactions">
      {user ? (
        <button
          className={`reactions__like ${
            hasLiked ? "reactions__like--active" : ""
          }`}
          onClick={toggleLike}
        >
          ♥ {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>
      ) : (
        <div className="reactions__guest">
          <span>
            ♥ {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
          <Link to="/login" className="reactions__prompt">
            Sign in to like
          </Link>
        </div>
      )}
    </div>
  );
}

export default Reactions;
