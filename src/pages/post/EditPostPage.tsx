import "../write/WritePage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";
import EditorToolbar from "../../features/editor/EditorToolbar";
import TagSelector from "../../features/editor/TagSelector";

interface Tag {
  id: string;
  name: string;
}

function EditPostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [signature, setSignature] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, signature, author_id, post_tags(tag_id)")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        navigate("/my-posts");
        return;
      }

      // Redirect if not the owner
      if (data.author_id !== user?.id) {
        navigate("/feed");
        return;
      }

      setPostId(data.id);
      setTitle(data.title);
      setSignature(data.signature ?? "");
      setSelectedTags(
        data.post_tags.map((pt: { tag_id: string }) => pt.tag_id),
      );
      editor?.commands.setContent(data.content);
      setLoading(false);
    };

    if (user && editor) fetchPost();
  }, [slug, user, editor]);

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

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please add a title");
      return;
    }

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title: title.trim(),
        content: editor?.getHTML(),
        signature: signature.trim(),
        is_published: true,
      })
      .eq("id", postId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    await supabase.from("post_tags").delete().eq("post_id", postId);

    if (selectedTags.length > 0) {
      await supabase
        .from("post_tags")
        .insert(selectedTags.map((tag_id) => ({ post_id: postId, tag_id })));
    }

    navigate(`/post/${slug}`);
  };

  const handleDiscard = () => navigate(`/post/${slug}`);

  if (loading) return null;

  return (
    <main className="write">
      <div className="write__container">
        <div className="write__header">
          <h1>Edit Post</h1>
          <p>Make changes and save or discard</p>
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
            onClick={handleDiscard}
            disabled={saving}
          >
            Discard
          </button>
          <button
            className="write__publish"
            onClick={() => handleSave()}
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default EditPostPage;
