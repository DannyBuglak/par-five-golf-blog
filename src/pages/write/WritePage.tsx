import "./WritePage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";

interface Tag {
  id: string;
  name: string;
}

function WritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [signature, setSignature] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your post...</p>",
  });

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("id, name");
      console.log("tags data", data);
      console.log("tags error", error);
      if (data) setTags(data);
    };
    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      setError("Please add a title before saving");
      return;
    }

    if (!editor?.getText().trim()) {
      setError("Please write something before saving");
      return;
    }

    setSaving(true);
    setError(null);

    const slug = generateSlug(title);

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: user?.id,
        title: title.trim(),
        slug,
        content: editor.getHTML(),
        signature: signature.trim(),
        is_published: publish,
      })
      .select()
      .single();

    if (postError) {
      setError(postError.message);
      setSaving(false);
      return;
    }

    // Save selected tags
    if (selectedTags.length > 0) {
      const tagRows = selectedTags.map((tag_id) => ({
        post_id: post.id,
        tag_id,
      }));

      const { error: tagError } = await supabase
        .from("post_tags")
        .insert(tagRows);

      if (tagError) {
        setError(tagError.message);
        setSaving(false);
        return;
      }
    }

    navigate(publish ? "/feed" : "/my-posts");
  };

  return (
    <main className="write">
      <div className="write__container">
        {error && <p className="write__error">{error}</p>}

        <div className="write__header">
          <input
            className="write__title"
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="write__tags">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`write__tag ${
                selectedTags.includes(tag.id) ? "write__tag--active" : ""
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="write__toolbar">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={
              editor?.isActive("bold") ? "toolbar__btn--active" : "toolbar__btn"
            }
          >
            B
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={
              editor?.isActive("italic")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            I
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor?.isActive("heading", { level: 1 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor?.isActive("heading", { level: 2 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H2
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor?.isActive("heading", { level: 3 })
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            H3
          </button>
          <div className="toolbar__divider" />
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={
              editor?.isActive("bulletList")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            • List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={
              editor?.isActive("orderedList")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            1. List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={
              editor?.isActive("blockquote")
                ? "toolbar__btn--active"
                : "toolbar__btn"
            }
          >
            " Quote
          </button>
          <div className="toolbar__divider" />
          <button
            onClick={() => editor?.chain().focus().undo().run()}
            className="toolbar__btn"
          >
            ↩ Undo
          </button>
          <button
            onClick={() => editor?.chain().focus().redo().run()}
            className="toolbar__btn"
          >
            ↪ Redo
          </button>
        </div>

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
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            className="write__publish"
            onClick={() => handleSave(true)}
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
