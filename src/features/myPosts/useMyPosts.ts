import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  is_published: boolean;
  signature: string | null;
}

export function useMyPosts(userId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, created_at, is_published, signature")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [userId]);

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return {
    posts,
    loading,
    deletePost,
  };
}
