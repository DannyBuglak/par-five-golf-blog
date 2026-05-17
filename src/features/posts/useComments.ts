import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/AuthContext";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: { username: string };
}

export function useComments(postId: string) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("id, content, created_at, author_id, profiles(username)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (data) setComments(data as unknown as Comment[]);
      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id: user.id, content: content.trim() })
      .select("id, content, created_at, author_id, profiles(username)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as unknown as Comment]);
    }

    setSubmitting(false);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return { comments, loading, submitting, addComment, deleteComment };
}
