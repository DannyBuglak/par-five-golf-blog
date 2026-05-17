import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Tag {
  name: string;
}

export interface PostTag {
  tag_id: string;
  tags: Tag;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  signature: string | null;
  "profiles!posts_author_id_fkey": { username: string }[];
  post_tags: PostTag[];
}

export type SortOption = "date_desc" | "date_asc" | "alpha";

export function useFeedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("name");
      if (data) setAllTags(data.map((t) => t.name).sort());
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, title, slug, content, created_at, signature, profiles!posts_author_id_fkey(username), post_tags(tag_id, tags(name))",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setPosts(data as unknown as Post[]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filterAndSort = (selectedTag: string | null, sort: SortOption) =>
    posts
      .filter((post) => {
        if (!selectedTag) return true;
        return post.post_tags?.some((pt) => pt.tags?.name === selectedTag);
      })
      .sort((a, b) => {
        if (sort === "date_desc")
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        if (sort === "date_asc")
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        if (sort === "alpha") return a.title.localeCompare(b.title);
        return 0;
      });

  return { posts, allTags, loading, filterAndSort };
}
