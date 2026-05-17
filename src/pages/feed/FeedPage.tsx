import "./FeedPage.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeedPosts } from "../../features/posts/useFeedPosts";
import FeedControls from "../../features/posts/FeedControls";
import FeedCard from "../../features/posts/FeedCard";
import type { SortOption } from "../../features/posts/useFeedPosts";

function FeedPage() {
  const { allTags, loading, filterAndSort } = useFeedPosts();
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
      </div>
    </main>
  );
}

export default FeedPage;
