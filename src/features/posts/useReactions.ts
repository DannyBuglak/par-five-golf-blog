import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/AuthContext";

export function useReactions(postId: string) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("likes")
        .select("user_id")
        .eq("post_id", postId);

      if (data) {
        setLikeCount(data.length);
        setHasLiked(data.some((l) => l.user_id === user?.id));
      }
    };

    fetchLikes();
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user || loading) return;
    setLoading(true);

    if (hasLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      setLikeCount((c) => c - 1);
      setHasLiked(false);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.id });
      setLikeCount((c) => c + 1);
      setHasLiked(true);
    }

    setLoading(false);
  };

  return { likeCount, hasLiked, toggleLike };
}
