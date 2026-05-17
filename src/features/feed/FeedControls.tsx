import type { SortOption } from "./useFeedPosts";

interface Props {
  allTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest First", value: "date_desc" },
  { label: "Oldest First", value: "date_asc" },
  { label: "A → Z", value: "alpha" },
];

import { useState } from "react";

function FeedControls({
  allTags,
  selectedTag,
  onTagSelect,
  sort,
  onSortChange,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="feed__controls">
      <div className="feed__filter">
        <span className="feed__filter-label">Filter by tag</span>
        <div className="feed__tags">
          <button
            className={`feed__tag ${
              selectedTag === null ? "feed__tag--active" : ""
            }`}
            onClick={() => onTagSelect(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`feed__tag ${
                selectedTag === tag ? "feed__tag--active" : ""
              }`}
              onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="feed__sort-wrapper">
        <span className="feed__filter-label">Sort by</span>
        <div className="feed__sort-dropdown">
          <button
            className="feed__sort-btn"
            onClick={() => setSortOpen((o) => !o)}
          >
            {sortOptions.find((o) => o.value === sort)?.label}
            <span className="feed__sort-chevron">▾</span>
          </button>
          {sortOpen && (
            <div className="feed__sort-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`feed__sort-option ${
                    sort === option.value ? "feed__sort-option--active" : ""
                  }`}
                  onClick={() => {
                    onSortChange(option.value);
                    setSortOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedControls;
