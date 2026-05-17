import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import type { Editor } from "@tiptap/react";

export function useWritePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);

  const savePost = async (
    publish: boolean,
    title: string,
    signature: string,
    selectedTags: string[],
    editor: Editor | null,
  ) => {
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

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: user?.id,
        title: title.trim(),
        slug: generateSlug(title),
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

    if (selectedTags.length > 0) {
      const { error: tagError } = await supabase
        .from("post_tags")
        .insert(selectedTags.map((tag_id) => ({ post_id: post.id, tag_id })));

      if (tagError) {
        setError(tagError.message);
        setSaving(false);
        return;
      }
    }

    navigate(publish ? "/feed" : "/my-posts");
  };

  return { saving, error, savePost };
}
