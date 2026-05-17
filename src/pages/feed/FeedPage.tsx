import "./FeedPage.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Tag {
  name: string;
}

interface PostTag {
  tag_id: string;
  tags: Tag;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  signature: string | null;
  "profiles!posts_author_id_fkey": {
    username: string;
  }[];
  post_tags: PostTag[];
}

type SortOption = "date_desc" | "date_asc" | "alpha" | "tags";

function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("date_desc");

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

      console.log("data", data);
      console.log("error", error);

      if (!error && data) {
        setPosts(data as unknown as Post[]);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const getExcerpt = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > 160 ? text.slice(0, 160) + "..." : text;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredAndSorted = posts
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
      if (sort === "tags") {
        const aTag = a.post_tags?.[0]?.tags?.name ?? "zzz";
        const bTag = b.post_tags?.[0]?.tags?.name ?? "zzz";
        return aTag.localeCompare(bTag);
      }
      return 0;
    });

  return (
    <main className="feed">
      <div className="feed__container">
        <div className="feed__header">
          <h1>Feed</h1>
          <p>The latest from the Par Five community</p>
        </div>

        <div className="feed__controls">
          <div className="feed__filter">
            <span className="feed__filter-label">Filter by tag</span>
            <div className="feed__tags">
              <button
                className={`feed__tag ${
                  selectedTag === null ? "feed__tag--active" : ""
                }`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`feed__tag ${
                    selectedTag === tag ? "feed__tag--active" : ""
                  }`}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? null : tag)
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="feed__sort-wrapper">
            <span className="feed__filter-label">Sort by</span>
            <select
              className="feed__sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="alpha">A → Z</option>
              <option value="tags">By Tag</option>
            </select>
          </div>
        </div>

        {loading && <p className="feed__loading">Loading posts...</p>}

        {!loading && filteredAndSorted.length === 0 && (
          <div className="feed__empty">
            <p>No posts yet. Be the first to write one!</p>
            <Link to="/write" className="feed__empty-btn">
              Start Writing
            </Link>
          </div>
        )}

        <div className="feed__list">
          {filteredAndSorted.map((post) => (
            <Link
              to={`/post/${post.slug}`}
              key={post.id}
              className="feed__card"
            >
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
                <span className="feed__card-date">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default FeedPage;
