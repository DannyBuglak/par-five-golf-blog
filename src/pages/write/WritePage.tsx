import "./WritePage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import EditorToolbar from "../../features/editor/EditorToolbar";
import TagSelector from "../../features/editor/TagSelector";
import { useWritePost } from "../../features/editor/useWritePost";

interface Tag {
  id: string;
  name: string;
}

function WritePage() {
  const [title, setTitle] = useState("");
  const [signature, setSignature] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { saving, error, savePost } = useWritePost();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your post...</p>",
  });

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from("tags").select("id, name");
      if (data) setTags(data);
    };
    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <main className="write">
      <div className="write__container">
        <div className="write__header">
          <h1>Write your Post</h1>
          <p>Write your thoughts, ideas, or stories</p>
        </div>

        {error && <p className="write__error">{error}</p>}

        <input
          className="write__title"
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TagSelector
          tags={tags}
          selectedTags={selectedTags}
          onToggle={toggleTag}
        />

        <EditorToolbar editor={editor} />

        <EditorContent editor={editor} className="write__editor" />

        <input
          className="write__signature"
          type="text"
          placeholder="Sign your post..."
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />

        <div className="write__footer">
          <button
            className="write__draft"
            onClick={() =>
              savePost(false, title, signature, selectedTags, editor)
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            className="write__publish"
            onClick={() =>
              savePost(true, title, signature, selectedTags, editor)
            }
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default WritePage;
