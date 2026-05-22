import "./FeedPage.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeedPosts } from "../../features/feed/useFeedPosts";
import FeedControls from "../../features/feed/FeedControls";
import FeedCard from "../../features/feed/FeedCard";
import type { SortOption } from "../../features/feed/useFeedPosts";
import { useMetaTags } from "../../hooks/useMetaTags";

function FeedPage() {
  useMetaTags({
    title: "Latest Golf Blog Posts",
    description: "Browse the latest golf blog posts and stories from our community of passionate golfers.",
    url: "/feed",
    type: "website",
  });
  
  const { allTags, loading, loadingMore, hasMore, loadMore, filterAndSort } =
    useFeedPosts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("date_desc");

  const posts = filterAndSort(selectedTag, sort);

  return (
    <main className="feed">
      <div className="feed__container">
        <div className="feed__header">
          <h1>Feed</h1>
          <p>The latest from the Par Five community</p>
        </div>

        <FeedControls
          allTags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          sort={sort}
          onSortChange={setSort}
        />

        {loading && <p className="feed__loading">Loading posts...</p>}

        {!loading && posts.length === 0 && (
          <div className="feed__empty">
            <p>No posts yet. Be the first to write one!</p>
            <Link to="/write" className="feed__empty-btn">
              Start Writing
            </Link>
          </div>
        )}

        <div className="feed__list">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore && !loading && (
          <div className="feed__pagination">
            <button
              className="feed__load-more"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default FeedPage;
