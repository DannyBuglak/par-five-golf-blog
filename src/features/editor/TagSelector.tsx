interface Tag {
  id: string;
  name: string;
}

interface Props {
  tags: Tag[];
  selectedTags: string[];
  onToggle: (id: string) => void;
}

function TagSelector({ tags, selectedTags, onToggle }: Props) {
  return (
    <div className="write__tags">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onToggle(tag.id)}
          className={`write__tag ${
            selectedTags.includes(tag.id) ? "write__tag--active" : ""
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}

export default TagSelector;
